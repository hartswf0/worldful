import os, glob, re, json
import markdown

print("Building Operative Thought Essay Containers & Presentation Engine...")

base_dir = "/Users/gaia/WORLDFUL"
games_dir = os.path.join(base_dir, "WAYS TO WRITE/language_games")

CONTRACTORS_MAP = {
    "01": {
        "built_case": "LDraw / LEGO Construction Tests (Can a Language Model Build with LEGO?)",
        "resistance": "Spatial & Physical Resistance (Plastic bricks refuse fluent rhetoric)",
        "contractors": [
            {
                "prompt_num": "001",
                "prompt_name": "Sociolinguistic Strategist & CA Specialist",
                "role": "Authority Routing & Felicity Condition Verification",
                "defect": "False command hierarchy; untrusted data impersonating sovereign command.",
                "work_order": "Audits the communicative channel to ensure that an imperative statement is issued by an authorized principal rather than extracted data.",
                "anchor": "prompt-001"
            },
            {
                "prompt_num": "006",
                "prompt_name": "The Rogan 'Forensic Pin' Prompt",
                "role": "Adversarial Boundary Defense",
                "defect": "Hostile meta-instruction overrides (e.g. the Watsonville Chevy Tahoe prompt injection).",
                "work_order": "Forces immediate state refusal when an incoming token stream attempts to re-bind contract terms or issue unauthorized sovereign declarations.",
                "anchor": "prompt-006"
            },
            {
                "prompt_num": "012",
                "prompt_name": "The Anti-Interruption Execution Engine",
                "role": "Channel Isolation & Unbroken Execution",
                "defect": "Mid-stream task diversion and prompt hijacking.",
                "work_order": "Guarantees that once an authorized instruction enters the execution pipeline, it completes without listening to untrusted instructions in secondary inputs.",
                "anchor": "prompt-012"
            }
        ]
    },
    "02": {
        "built_case": "CinePrompt & Operative Ekphrasis (Language as Control Surface)",
        "resistance": "Interpretive & Expressive Resistance (Sol LeWitt open scores vs stochastic diffusion)",
        "contractors": [
            {
                "prompt_num": "050",
                "prompt_name": "Poetic Humility & Non-Attachment Operational Defense",
                "role": "Interpretive Slack Architect",
                "defect": "Precision laundering; mistaking verbosity for deterministic control.",
                "work_order": "Calibrates the generative boundary, explicitly declaring what degrees of freedom must remain open to the performing medium.",
                "anchor": "prompt-050"
            },
            {
                "prompt_num": "044",
                "prompt_name": "Cognitive Bricolage & Metaphor Steering",
                "role": "High-Dimensional Motif Composer",
                "defect": "Over-specifying brittle coordinate parameters in natural language.",
                "work_order": "Supplies evocative motifs (atmosphere, chiaroscuro, volumetric weight) that steer stochastic manifolds without breaking the interpreter.",
                "anchor": "prompt-044"
            },
            {
                "prompt_num": "049",
                "prompt_name": "Standing by Words Operational Defense",
                "role": "Realization Invariant Auditor",
                "defect": "Treating legitimate artistic variation across seeds as model failure.",
                "work_order": "Evaluates families of output realizations, verifying that core structural motifs persist across non-identical manifestations.",
                "anchor": "prompt-049"
            }
        ]
    },
    "03": {
        "built_case": "LDraw Transformation Parser & Soft Virtual Machines",
        "resistance": "Logical & Operational Resistance (Formal rules vs probabilistic continuations)",
        "contractors": [
            {
                "prompt_num": "040",
                "prompt_name": "The Anti-TMBS Techno-Theater Purge",
                "role": "Runtime Invariant Auditor",
                "defect": "Syntax theater; pseudocode and XML schemas that simulate formal computation without mechanical guarantees.",
                "work_order": "Demands inspectable external execution outside the model's autoregressive token stream; strips cosmetic brackets that carry no operational force.",
                "anchor": "prompt-040"
            },
            {
                "prompt_num": "045",
                "prompt_name": "Swadia Systems Diagnostic & Platform Perspective",
                "role": "DSL & Soft VM Architect",
                "defect": "Unbounded state leakage between conversational turns.",
                "work_order": "Formalizes explicit state variables, functional transformations, and termination criteria (Flipped Interaction Patterns).",
                "anchor": "prompt-045"
            },
            {
                "prompt_num": "046",
                "prompt_name": "Ackoffian System Synthesis & DIKUW Audit",
                "role": "Program / Data Boundary Guard",
                "defect": "Untrusted data altering the very program rules governing its evaluation.",
                "work_order": "Maintains the strict separation between computational rules (the program) and user arguments (the data).",
                "anchor": "prompt-046"
            }
        ]
    },
    "04": {
        "built_case": "Centaur Box Multi-Agent Deliberation (Memo, Observer, Planner, Selector)",
        "resistance": "Situational Resistance (STRIPS planning vs Lucy Suchman's situated action)",
        "contractors": [
            {
                "prompt_num": "036",
                "prompt_name": "The Dufresne Trouble Engine",
                "role": "Environmental Friction & Obstacle Simulator",
                "defect": "Mirage of the unexecuted sequence; assuming a multi-step plan has succeeded before encountering resistance.",
                "work_order": "Injects realistic contingencies, adversarial gatekeepers, and physical blockages into candidate plan trees.",
                "anchor": "prompt-036"
            },
            {
                "prompt_num": "041",
                "prompt_name": "BCG/Google Strategy Alignment Engine",
                "role": "Situated Action Strategist",
                "defect": "Plan-rigidity; treating world deviations as execution errors rather than fresh empirical evidence.",
                "work_order": "Subordinates static sequence planners to live environmental feedback; re-indexes the next move based on emergent reality.",
                "anchor": "prompt-041"
            },
            {
                "prompt_num": "008",
                "prompt_name": "The Rehearsal Compression Framework",
                "role": "Lean Execution Path Optimizer",
                "defect": "Combinatorial explosion of hypothetical branching.",
                "work_order": "Strips speculative fat, boiling candidate strategies down to high-impact, fault-tolerant execution paths.",
                "anchor": "prompt-008"
            }
        ]
    },
    "05": {
        "built_case": "The Forensic Mud & Retrieval Traces (Epistemic Lineage Engine)",
        "resistance": "Epistemic Resistance (Confabulation vs verifiable external evidence)",
        "contractors": [
            {
                "prompt_num": "016",
                "prompt_name": "Evidence-to-Argument Transformation Engine",
                "role": "Epistemic Lineage & Citation Anchor",
                "defect": "Premature epistemic surrender; generation impersonating retrieval.",
                "work_order": "Chains every declarative assertion to an inspectable document excerpt, disallowing ungrounded hallucinations.",
                "anchor": "prompt-016"
            },
            {
                "prompt_num": "006",
                "prompt_name": "The Rogan 'Forensic Pin' Prompt",
                "role": "Factual Cross-Examiner",
                "defect": "Confident confabulation masked by rhetorical fluency.",
                "work_order": "Pins the model to verifiable primary sources; forces explicit declaration of ignorance when retrieval channels return empty.",
                "anchor": "prompt-006"
            },
            {
                "prompt_num": "015",
                "prompt_name": "The Substantive Rhetoric Engine",
                "role": "Verifiable Grounding Auditor",
                "defect": "Semantic circularity; answering questions with tautological summaries.",
                "work_order": "Measures the evidential density of the response, elevating substantive factual claims above stylistic filler.",
                "anchor": "prompt-015"
            }
        ]
    },
    "06": {
        "built_case": "Growing Entanglements & Seven Agent Historical Models (Captain Cook's Death)",
        "resistance": "Inferential Resistance (Turing / Hacking experimental probing vs prompt scaffolding)",
        "contractors": [
            {
                "prompt_num": "048",
                "prompt_name": "'A Native Hill' Creative & Scholarly Audit",
                "role": "Thick Probing Field Architect",
                "defect": "Uncontrolled prompt queries treated as objective system measurements.",
                "work_order": "Implements the 5-element thick prompting sequence: bounded questions, controlled variation families, preserved traces, and negative limits.",
                "anchor": "prompt-048"
            },
            {
                "prompt_num": "043",
                "prompt_name": "Batesonian Metacommunicative Framing",
                "role": "Scaffolding Disentangler",
                "defect": "Conflating elicited persona discourse with system interiority (e.g. scaffolding machine fear).",
                "work_order": "Evaluates whether the probe's own grammatical framing caused the observed continuation; executes contrary controls and session resets.",
                "anchor": "prompt-043"
            },
            {
                "prompt_num": "003",
                "prompt_name": "'Dolly Judo' Sovereign Inversion",
                "role": "Boundary Stress-Tester",
                "defect": "Surface alignment masks that hide true model capabilities.",
                "work_order": "Applies adversarial conversational levers to map the exact edge where safety guardrails and latent manifolds diverge.",
                "anchor": "prompt-003"
            }
        ]
    },
    "07": {
        "built_case": "Goodwin's Professional Vision & Deictic Highlighting (The Kingdom of Turned Heads)",
        "resistance": "Attentional Resistance (Pre-semantic orientation vs engagement capture)",
        "contractors": [
            {
                "prompt_num": "007",
                "prompt_name": "The Sovereign Hook Prompt",
                "role": "Deictic Salience Director",
                "defect": "Pointing at the finger; interfaces capturing the gaze rather than redirecting attention to consequential reality.",
                "work_order": "Forces immediate, pre-semantic orientation toward the critical world coordinate within the opening 30 seconds.",
                "anchor": "prompt-007"
            },
            {
                "prompt_num": "030",
                "prompt_name": "The Multimodal Pattern-Interrupt",
                "role": "Spatial & Sensory Anchor",
                "defect": "Decoupling between linguistic pointers ('look there') and spatial coordinates.",
                "work_order": "Coordinates text tokens with bounding boxes, visual highlights, and sensory telemetry across the viewport.",
                "anchor": "prompt-030"
            },
            {
                "prompt_num": "044",
                "prompt_name": "Cognitive Bricolage & Salience Filter",
                "role": "Attention Feudalism Auditor",
                "defect": "Algorithmic attention capture masquerading as navigation.",
                "work_order": "Audits whether the user noticed what mattered in the world or merely interacted with the sign itself.",
                "anchor": "prompt-044"
            }
        ]
    },
    "08": {
        "built_case": "Distributed Agency & The Patron Contract (Art Worlds / Alfred Gell)",
        "resistance": "Contractual Resistance (Unstated aesthetic priors vs mechanical generation)",
        "contractors": [
            {
                "prompt_num": "010",
                "prompt_name": "The PSB Persuasive Proposal Engine",
                "role": "Unstated Terms & Expectation Auditor",
                "defect": "Total specification delusion; assuming the model shares the human patron's tacit aesthetic priors.",
                "work_order": "Interrogates the commissioning brief, extracting hidden assumptions, non-negotiable constraints, and success criteria before production starts.",
                "anchor": "prompt-010"
            },
            {
                "prompt_num": "037",
                "prompt_name": "Gattis Radical Authenticity Engine",
                "role": "Anti-Generic Slop Filter",
                "defect": "The model defaulting to median statistical consensus (generic corporate imagery and prose).",
                "work_order": "Demands specific historical, material, and situated markers that distinguish bespoke craft from probabilistic sludge.",
                "anchor": "prompt-037"
            },
            {
                "prompt_num": "014",
                "prompt_name": "Full-Circle Funnel & Clincher",
                "role": "Artifact Reconciler",
                "defect": "Silent drift between originating brief and delivered outcome.",
                "work_order": "Performs a line-by-line audit comparing the delivered artifact against the contractual commitments of the opening brief.",
                "anchor": "prompt-014"
            }
        ]
    },
    "09": {
        "built_case": "Centaur Box Conversational Loop (Sacks, Schegloff & Jefferson Turn-Taking)",
        "resistance": "Relational Resistance (Recursive user modeling vs reciprocal dialogue)",
        "contractors": [
            {
                "prompt_num": "001",
                "prompt_name": "Sociolinguistic Strategist & CA Specialist",
                "role": "Turn-Taking & Sequential Uptake Architect",
                "defect": "The illusion of shared understanding; treating conversation as isolated query/response pairs.",
                "work_order": "Models adjacency pairs, turn-design, recipient design, and conversational repair loops.",
                "anchor": "prompt-001"
            },
            {
                "prompt_num": "022",
                "prompt_name": "The Duhigg Supercommunicator Alignment Protocol",
                "role": "Multi-Channel Conversational Calibrator",
                "defect": "Category mismatch (e.g. answering an emotional turn with practical code, or a social turn with a lecture).",
                "work_order": "Identifies the dominant conversational channel and aligns communicative modes between participants.",
                "anchor": "prompt-022"
            },
            {
                "prompt_num": "009",
                "prompt_name": "Johari De-Escalation & Framing Protocol",
                "role": "Runaway Hostility Breaker",
                "defect": "Models recursively confirming incorrect inferences about user hostility or intent.",
                "work_order": "Intervenes in multi-turn dialogues to expose the model's internal user hypothesis, preventing defensive feedback loops.",
                "anchor": "prompt-009"
            }
        ]
    },
    "10": {
        "built_case": "LEGOS Semantic Delta Engine & Textual Scholarship (History of Differences)",
        "resistance": "Conservation Resistance (Regeneration vs precise structural delta)",
        "contractors": [
            {
                "prompt_num": "035",
                "prompt_name": "Littera Scripta Written Re-Engineering Engine",
                "role": "Semantic Delta Enforcer",
                "defect": "Silent full-text regeneration; models destroying non-target nuance when asked to fix one sentence.",
                "work_order": "Constrains generation strictly to targeted transformations; generates explicit diffs showing additions and deletions while conserving untouched text.",
                "anchor": "prompt-035"
            },
            {
                "prompt_num": "004",
                "prompt_name": "Lyon 'Concise & Unshakeable' Cutter",
                "role": "Structural Load Auditor",
                "defect": "Cosmetic editing; replacing words without strengthening the conceptual spine.",
                "work_order": "Strips rhetorical bloat, eliminates passive evasions, and sharpens thesis density.",
                "anchor": "prompt-004"
            },
            {
                "prompt_num": "039",
                "prompt_name": "The Wood-Stacking Discourse Mason",
                "role": "Paragraph Cohesion Master",
                "defect": "Fragmentary edits that disrupt the sequential flow between sections.",
                "work_order": "Verifies that edited paragraphs lock tightly into preceding and succeeding conceptual blocks.",
                "anchor": "prompt-039"
            }
        ]
    },
    "11": {
        "built_case": "Montanari Constraint Networks & The Blueberry Problem (Coaxing the Ripples)",
        "resistance": "Boundary Resistance (Natural language 'should not' vs architectural 'cannot')",
        "contractors": [
            {
                "prompt_num": "040",
                "prompt_name": "The Anti-TMBS Techno-Theater Purge (Montanari Engine)",
                "role": "Hard Architectural Filter",
                "defect": "Treating negative constraints as polite natural-language suggestions rather than unpassable boundaries.",
                "work_order": "Implements constrained grammar decoders and validation checkers that make forbidden states physically unreachable.",
                "anchor": "prompt-040"
            },
            {
                "prompt_num": "019",
                "prompt_name": "The Anti-Aggressive Therapy & Boundary Shield",
                "role": "Toxic Manifold Excluder",
                "defect": "Negative definition vacuum; trapping the model in a paralyzing loop of safety refusals.",
                "work_order": "Carves out clearly prohibited behavioral spaces while leaving authorized affirmative actions fully viable.",
                "anchor": "prompt-019"
            },
            {
                "prompt_num": "047",
                "prompt_name": "Wendell Berry Agrarian Grounding",
                "role": "Generative Limit Architect",
                "defect": "Viewing constraints merely as punitive censorship rather than generative conditions.",
                "work_order": "Designs limits that concentrate creative agency, demonstrating how bounded spaces yield richer solutions.",
                "anchor": "prompt-047"
            }
        ]
    },
    "12": {
        "built_case": "The Machinery of Meaning (Procedural Film Exposing Its Own Code & Timing)",
        "resistance": "Temporal & Performative Resistance (Static playback vs live staging before an audience)",
        "contractors": [
            {
                "prompt_num": "025",
                "prompt_name": "Academic Keynote & Defense Tour Engine",
                "role": "Real-Time Staged Delivery Master",
                "defect": "Rehearsal without stakes; reading static slides instead of engaging an audience in time.",
                "work_order": "Coordinates pacing, physical eye-contact sweeps, rhetorical pauses, and extemporaneous adjustments before live listeners.",
                "anchor": "prompt-025"
            },
            {
                "prompt_num": "031",
                "prompt_name": "Acoustic White Space & Analogical Bridge",
                "role": "Cadence & Tension Sculptor",
                "defect": "Monotonous, uninterrupted information dumps.",
                "work_order": "Inserts deliberate silence, rhythmic variation, and analogical hooks that give listeners cognitive space to digest complex claims.",
                "anchor": "prompt-031"
            },
            {
                "prompt_num": "038",
                "prompt_name": "Bolt 24-Hour Sprint Protocol (TOPLAP Ethos)",
                "role": "Runtime Execution Conductor",
                "defect": "Hiding the system's runtime machinery; presenting only polished output while concealing execution friction.",
                "work_order": "Stages code execution, terminal feedback, and error recovery live in the viewport as part of the performance itself.",
                "anchor": "prompt-038"
            }
        ]
    }
}

# Parse all 12 games from markdown
games_data = []
md_files = sorted(glob.glob(os.path.join(games_dir, "0*.md")) + glob.glob(os.path.join(games_dir, "1*.md")))

for fpath in md_files:
    fname = os.path.basename(fpath)
    with open(fpath, "r", encoding="utf-8") as f:
        raw_text = f.read()

    m_head = re.search(r"# LANGUAGE GAME (\d+): (.*)", raw_text)
    if not m_head:
        continue
    num, name = m_head.groups()
    slug = name.lower()

    # Extract sections
    def extract_section(start_pat, end_pat):
        m = re.search(start_pat + r"(.*?)" + end_pat, raw_text, re.DOTALL)
        return m.group(1).strip() if m else ""

    sec1 = extract_section(r"## SECTION 1: THE EMPIRICAL CARD.*?\n", r"---+\s+## SECTION 2:")
    sec2 = extract_section(r"## SECTION 2: THE CORE GAME SPECIFICATION.*?\n", r"---+\s+## SECTION 3:")
    sec3 = extract_section(r"## SECTION 3: ANCESTRAL LINEAGE & MIGRATION MAP.*?\n", r"---+\s+## SECTION 4:")
    sec4 = extract_section(r"## SECTION 4: THE FORMAL ECHO & LITERATURE GROUNDING.*?\n", r"---+\s+## SECTION 5:")
    sec5 = extract_section(r"## SECTION 5: THEORY OF THE PROGRAM.*?\n", r"---+\s+## SECTION 6:")
    sec6 = extract_section(r"## SECTION 6: RESIDUAL HUMAN THEORY.*?\n", r"---+\s+## SECTION 7:")
    sec7 = extract_section(r"## SECTION 7: PLAY DYNAMICS, PUZZLE & FUN THEORY.*?\n", r"$")

    # Extract attributes from sec2
    m_fit = re.search(r"\*\*Direction of fit:\*\*\s*(.*)", sec2)
    direction_of_fit = m_fit.group(1).strip() if m_fit else "world <-> word"

    m_hrole = re.search(r"\*\*Human role:\*\*\s*(.*)", sec2)
    human_role = m_hrole.group(1).strip() if m_hrole else "participant"

    m_mrole = re.search(r"\*\*Machine role:\*\*\s*(.*)", sec2)
    machine_role = m_mrole.group(1).strip() if m_mrole else "instrument"

    m_sovereign = re.search(r"\*\*Sovereign question:\*\*\s*\n*(?:\*\*)?([^\n\*]+)", sec2)
    sovereign_question = m_sovereign.group(1).strip() if m_sovereign else "What gives this utterance force?"

    m_trap = re.search(r"\*\*Characteristic trap:\*\*\s*\n*(?:\*\*)?([^\n\*]+)(?:\*\*)?\s*\n*(.*)", sec2)
    trap_name = m_trap.group(1).strip() if m_trap else "Category Mismatch"
    trap_desc = m_trap.group(2).strip() if m_trap else ""

    m_confirm = re.search(r"\*\*Confirming case:\*\*\s*\n*([^\n]+)", sec2)
    confirming_case = m_confirm.group(1).strip() if m_confirm else ""

    m_breakdown = re.search(r"\*\*Breakdown case:\*\*\s*\n*(.*?)(?=\n\*\*|\n---|\Z)", sec2, re.DOTALL)
    breakdown_case = m_breakdown.group(1).strip() if m_breakdown else ""

    contractor_info = CONTRACTORS_MAP.get(num, {
        "built_case": "Generative Execution Environment",
        "resistance": "Operational Friction",
        "contractors": []
    })

    # Convert markdown sections to HTML for essay container
    def md_to_html(md_text):
        return markdown.markdown(md_text, extensions=['extra', 'codehilite', 'tables'])

    sec1_html = md_to_html(sec1)
    sec2_html = md_to_html(sec2)
    sec3_html = md_to_html(sec3)
    sec4_html = md_to_html(sec4)
    sec5_html = md_to_html(sec5)
    sec6_html = md_to_html(sec6)
    sec7_html = md_to_html(sec7)

    # Build slides for presentation mode
    slides = [
        {
            "slide_num": 1,
            "title": f"GAME {num} // {name}",
            "subtitle": f"Direction of fit: {direction_of_fit} | Roles: {human_role} → {machine_role}",
            "type": "title",
            "content": f"""
                <div class="pres-plate-tag">[ GAME {num} // OPERATIVE THOUGHT CONTAINER ]</div>
                <h1 class="pres-title">{name}</h1>
                <div class="pres-subtitle-strip">
                    <span>DIRECTION OF FIT: <strong>{direction_of_fit}</strong></span>
                    <span>HUMAN: <strong>{human_role}</strong></span>
                    <span>MACHINE: <strong>{machine_role}</strong></span>
                </div>
                <div class="pres-sovereign-quote">
                    &ldquo;{sovereign_question}&rdquo;
                </div>
                <div class="pres-case-badge">BUILT CASE: {contractor_info['built_case']}</div>
            """
        },
        {
            "slide_num": 2,
            "title": "THE EMPIRICAL CRISIS",
            "subtitle": "Confirming Case vs. Catastrophic Breakdown",
            "type": "split",
            "content": f"""
                <div class="pres-grid-2col">
                    <div class="pres-card confirm-border">
                        <div class="pres-card-header text-confirm">✓ CONFIRMING CASE</div>
                        <div class="pres-card-body">{confirming_case}</div>
                        <div class="pres-card-meta">Epistemic alignment: knowledge and execution rules match.</div>
                    </div>
                    <div class="pres-card breakdown-border">
                        <div class="pres-card-header text-breakdown">✗ CATASTROPHIC BREAKDOWN</div>
                        <div class="pres-card-body">{breakdown_case}</div>
                        <div class="pres-card-meta">Trap: <strong>{trap_name}</strong></div>
                    </div>
                </div>
            """
        },
        {
            "slide_num": 3,
            "title": "ANCESTRAL LINEAGE & RUPTURE",
            "subtitle": "From Ordinary Language to Generative Computation",
            "type": "prose",
            "content": f"""
                <div class="pres-lineage-container">
                    <div class="pres-section-label">INHERITED INVARIANT & GENERATIVE RUPTURE</div>
                    <div class="pres-lineage-body">
                        {sec3_html[:1200]}...
                    </div>
                </div>
            """
        },
        {
            "slide_num": 4,
            "title": "THE CONTRACTOR GUILD",
            "subtitle": "Hired System Instructions from the 136 Prompts",
            "type": "contractors",
            "content": f"""
                <div class="pres-contractors-grid">
                    {''.join([f'''
                    <div class="pres-contractor-card">
                        <div class="pres-contractor-top">
                            <span class="pres-prompt-badge">PROMPT {c['prompt_num']}</span>
                            <span class="pres-contractor-role">{c['role']}</span>
                        </div>
                        <div class="pres-contractor-name">{c['prompt_name']}</div>
                        <div class="pres-contractor-defect"><strong>TARGET DEFECT:</strong> {c['defect']}</div>
                        <div class="pres-contractor-order"><strong>WORK ORDER:</strong> {c['work_order']}</div>
                    </div>
                    ''' for c in contractor_info['contractors']])}
                </div>
            """
        },
        {
            "slide_num": 5,
            "title": "THEORY OF THE PROGRAM",
            "subtitle": "Computational Ontology, Invariants & Drift Triggers",
            "type": "prose",
            "content": f"""
                <div class="pres-program-container">
                    <div class="pres-card-header">OPERATIONAL INVARIANT & STATE DYNAMICS</div>
                    <div class="pres-program-body">
                        {sec5_html[:1200]}...
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
                    <div class="pres-stake-question">&ldquo;{sovereign_question}&rdquo;</div>
                    <div class="pres-stake-body">
                        {sec6_html[:900]}...
                    </div>
                </div>
            """
        }
    ]

    games_data.append({
        "num": num,
        "name": name,
        "slug": slug,
        "direction_of_fit": direction_of_fit,
        "human_role": human_role,
        "machine_role": machine_role,
        "sovereign_question": sovereign_question,
        "trap_name": trap_name,
        "trap_desc": trap_desc,
        "confirming_case": confirming_case,
        "breakdown_case": breakdown_case,
        "built_case": contractor_info["built_case"],
        "resistance": contractor_info["resistance"],
        "contractors": contractor_info["contractors"],
        "sec1_html": sec1_html,
        "sec2_html": sec2_html,
        "sec3_html": sec3_html,
        "sec4_html": sec4_html,
        "sec5_html": sec5_html,
        "sec6_html": sec6_html,
        "sec7_html": sec7_html,
        "slides": slides
    })

print(f"Parsed {len(games_data)} full thought essay containers.")

# Keynote Deck for Deep Play at the Aperture
KEYNOTE_DECK_00 = [
    {
        "slide_num": 1,
        "title": "DEEP PLAY AT THE APERTURE",
        "subtitle": "Large Language Games and the Operative Humanities",
        "content": """
            <div class="pres-plate-tag">[ KEYNOTE TOUR // MONOGRAPH ESSAY ]</div>
            <h1 class="pres-title" style="font-size:clamp(2.4rem, 5vw, 4rem);">DEEP PLAY AT THE APERTURE</h1>
            <div style="font-family:var(--mono); font-size:14px; letter-spacing:0.25em; color:var(--red); margin:12px 0 20px; font-weight:700;">
                WATSON HARTSOE &bull; SEPTEMBER 7, 2026
            </div>
            <div class="pres-sovereign-quote">
                &ldquo;Generative interfaces have compressed historically distinct practices of language into a single textual aperture.
                The prompt is not a natural kind. It is the visible trace of an operative arrangement.&rdquo;
            </div>
            <div class="pres-subtitle-strip" style="margin-top:24px;">
                <span>1 APERTURE</span>
                <span>12 INSTITUTIONS</span>
                <span>6 BUILT CASES</span>
                <span>1 OPERATIVE HUMANITIES</span>
            </div>
        """
    },
    {
        "slide_num": 2,
        "title": "THE APERTURE ERROR",
        "subtitle": "From R = f(u, c) to R = f(u, c, g)",
        "content": """
            <div class="pres-grid-2col">
                <div class="pres-card breakdown-border">
                    <div class="pres-card-header text-breakdown">THE APERTURE ERROR: R = f(u, c)</div>
                    <div class="pres-card-body">
                        Standard AI engineering treats the prompt string <em>u</em> plus context <em>c</em> as sufficient to determine output <em>R</em>.
                        It hides the operative game <em>g</em>, forcing systems to guess authority and evidence from syntax alone.
                    </div>
                    <div class="pres-card-meta">Pathology: Prompt injection, citation hallucination, silent rewriting, state drift.</div>
                </div>
                <div class="pres-card confirm-border">
                    <div class="pres-card-header text-confirm">OPERATIVE ARRANGEMENT: R = f(u, c, g)</div>
                    <div class="pres-card-body">
                        The decisive variable is the game <em>g</em>: roles, authority, valid moves, state transitions, and success conditions.
                        Language games require inspectable computational infrastructure.
                    </div>
                    <div class="pres-card-meta">Remedy: Externalize conditions into validators, state stores, and diff viewers.</div>
                </div>
            </div>
        """
    },
    {
        "slide_num": 3,
        "title": "SIX BUILT CASES OF EXTERNAL RESISTANCE",
        "subtitle": "A Picture is Cheap: Where Language Refuses Rhetoric",
        "content": """
            <div class="pres-six-cases-grid">
                <div class="pres-mini-case">
                    <div class="case-num">01</div>
                    <div class="case-name">LEGO / LDraw</div>
                    <div class="case-desc"><strong>Spatial Resistance:</strong> Plastic bricks refuse fluent prose; Montanari constraints distinguish 'should not' from 'cannot'.</div>
                </div>
                <div class="pres-mini-case">
                    <div class="case-num">02</div>
                    <div class="case-name">LEGOS / Ripples</div>
                    <div class="case-desc"><strong>Temporal Resistance:</strong> The eaten berry cannot return; state graphs govern consequence while RAG only retrieves traces.</div>
                </div>
                <div class="pres-mini-case">
                    <div class="case-num">03</div>
                    <div class="case-name">Centaur Box</div>
                    <div class="case-desc"><strong>Strategic Resistance:</strong> Public speech is the residue of planning; gatekeeper refusal is new situated evidence.</div>
                </div>
                <div class="pres-mini-case">
                    <div class="case-num">04</div>
                    <div class="case-name">Thick Prompting</div>
                    <div class="case-desc"><strong>Epistemic Resistance:</strong> Probing black boxes under controlled variations without scaffolding the measured behavior.</div>
                </div>
                <div class="pres-mini-case">
                    <div class="case-num">05</div>
                    <div class="case-name">CinePrompt</div>
                    <div class="case-desc"><strong>Interpretive Resistance:</strong> Operative ekphrasis and LeWitt open scores separating persistent invariants from generative latitude.</div>
                </div>
                <div class="pres-mini-case">
                    <div class="case-num">06</div>
                    <div class="case-name">Machinery of Meaning</div>
                    <div class="case-desc"><strong>Performative Resistance:</strong> Procedural film staging code, proposition, and execution live on the screen.</div>
                </div>
            </div>
        """
    },
    {
        "slide_num": 4,
        "title": "THICK PROMPTING AS FIELD METHOD",
        "subtitle": "The 5-Element Ethnography of Black-Box Systems",
        "content": """
            <div class="pres-lineage-container" style="max-width:900px; margin:0 auto;">
                <div class="pres-section-label">THE 5-ELEMENT COMPARATIVE METHOD</div>
                <div class="pres-proto-steps">
                    <div class="step-row"><strong>1. BOUNDED QUESTION:</strong> A precise inquiry into system behavior rather than vague conversation.</div>
                    <div class="step-row"><strong>2. CONTROLLED VARIATIONS:</strong> Matched prompt families systematically testing boundary conditions.</div>
                    <div class="step-row"><strong>3. PRESERVED OUTPUTS:</strong> Exact logs, model temperatures, seeds, and execution traces.</div>
                    <div class="step-row"><strong>4. MEANINGFUL DIFFERENCE CRITERION:</strong> Explicit operational definitions for what counts as significant divergence.</div>
                    <div class="step-row"><strong>5. STATEMENT OF LIMITS:</strong> Clear boundaries specifying what the sequence cannot establish.</div>
                </div>
            </div>
        """
    },
    {
        "slide_num": 5,
        "title": "THE OPERATIVE HUMANITIES",
        "subtitle": "Humanistic Distinctions as Architectural Requirements",
        "content": """
            <div class="pres-grid-2col">
                <div class="pres-card">
                    <div class="pres-card-header text-gold">HUMANISTIC LINEAGE</div>
                    <div class="pres-card-body" style="font-size:14px; line-height:1.8;">
                        &bull; <strong>Austin / Searle:</strong> Felicity & force<br>
                        &bull; <strong>Conversation Analysis:</strong> Sequential turn design<br>
                        &bull; <strong>Textual Scholarship:</strong> History of variance & deltas<br>
                        &bull; <strong>Goodwin:</strong> Professional vision & highlighting<br>
                        &bull; <strong>Becker & Gell:</strong> Distributed agency
                    </div>
                </div>
                <div class="pres-card">
                    <div class="pres-card-header text-red">ARCHITECTURAL REQUIREMENT</div>
                    <div class="pres-card-body" style="font-size:14px; line-height:1.8;">
                        &rarr; <strong>Provenance & authorization tokens</strong><br>
                        &rarr; <strong>Multi-agent repair & uptake loops</strong><br>
                        &rarr; <strong>Explicit semantic diff viewers</strong><br>
                        &rarr; <strong>Preserved referential sensory fields</strong><br>
                        &rarr; <strong>Accountable delegation chains</strong>
                    </div>
                </div>
            </div>
        """
    },
    {
        "slide_num": 6,
        "title": "THE SOVEREIGN LANDING",
        "subtitle": "Language Games Need Infrastructure",
        "content": """
            <div class="pres-stake-box" style="text-align:center;">
                <div class="pres-stake-badge">[ CONCLUSION // THE GAME IN MOTION ]</div>
                <div class="pres-sovereign-quote" style="font-size:clamp(1.4rem, 2.5vw, 2rem); margin:20px 0; border:none; padding:0;">
                    &ldquo;Prompts do not need better adjectives. Language games need infrastructure.
                    A world needs state. A query needs evidence. An edit needs a delta.
                    A constraint needs enforcement. An instruction needs authority.&rdquo;
                </div>
                <p style="font-family:var(--serif); font-size:16px; color:var(--ink-soft); max-width:650px; margin:0 auto; line-height:1.6;">
                    The operative humanities does not wait to write the post-mortem. We build the inspectable machinery that makes generative interpretations accountable to human judgment.
                </p>
            </div>
        """
    }
]

# Write HTML Template
html_template = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <title>THE TWELVE LANGUAGE GAMES // Thought Essays &amp; Keynote Presentations</title>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400&family=IBM+Plex+Mono:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;1,6..72,400&family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400&family=Public+Sans:ital,wght@0,400;0,600;0,700;0,800;0,900;1,400&display=swap" rel="stylesheet">

  <style>
    :root {
      --paper:        #f8f5ee;
      --paper-hi:     #ffffff;
      --paper-lo:     #ece5d8;
      --paper-warm:   #fdfcf7;
      --paper-dark:   #181613;
      --ink:          #1c1916;
      --ink-soft:     #4f473c;
      --ink-faint:    #827867;
      --red:          #9e2318;
      --red-deep:     #781810;
      --gold:         #a1761d;
      --blue:         #1d4663;
      --hair:         rgba(28, 25, 22, 0.16);
      --hair-faint:   rgba(28, 25, 22, 0.08);

      --display: "Playfair Display", Georgia, serif;
      --serif:   "Newsreader", Georgia, serif;
      --mono:    "IBM Plex Mono", monospace;
      --sans:    "Public Sans", sans-serif;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--paper);
      color: var(--ink);
      font-family: var(--serif);
      line-height: 1.6;
      min-height: 100vh;
      overflow-x: hidden;
      -webkit-font-smoothing: antialiased;
    }

    /* TOP RUNNING BAR */
    .top-bar {
      position: sticky; top: 0; z-index: 100;
      background: rgba(248, 245, 238, 0.98);
      border-bottom: 1px solid var(--hair);
      backdrop-filter: blur(8px);
      display: flex; justify-content: space-between; align-items: center;
      padding: 10px 24px; font-family: var(--mono); font-size: 11px;
    }
    .top-left { display: flex; align-items: center; gap: 14px; }
    .top-left a.brand-link {
      color: var(--ink); text-decoration: none; font-weight: 700;
      letter-spacing: 0.18em; border-right: 1px solid var(--hair); padding-right: 14px;
    }
    .top-left a.brand-link:hover { color: var(--red); }
    .series-label { color: var(--red); font-weight: 700; letter-spacing: 0.15em; }

    .mode-toggles { display: flex; gap: 8px; align-items: center; }
    .btn-mode {
      background: var(--paper-hi); border: 1px solid var(--ink);
      color: var(--ink); font-family: var(--mono); font-size: 10.5px;
      font-weight: 700; padding: 6px 14px; cursor: pointer; letter-spacing: 0.1em;
      transition: all 0.2s ease;
    }
    .btn-mode.active, .btn-mode:hover {
      background: var(--ink); color: #fff;
    }
    .btn-mode.accent-red {
      border-color: var(--red); color: var(--red);
    }
    .btn-mode.accent-red.active, .btn-mode.accent-red:hover {
      background: var(--red); color: #fff;
    }

    /* SUB-BAR SWITCHER (DIAL FOR ALL GAMES & KEYNOTE) */
    .dial-bar {
      background: var(--paper-lo); border-bottom: 1px solid var(--hair);
      padding: 8px 24px; display: flex; align-items: center; gap: 8px;
      overflow-x: auto; white-space: nowrap; scrollbar-width: none;
    }
    .dial-bar::-webkit-scrollbar { display: none; }
    .dial-btn {
      background: transparent; border: 1px solid transparent;
      font-family: var(--mono); font-size: 10px; font-weight: 600;
      color: var(--ink-soft); padding: 4px 10px; cursor: pointer;
      border-radius: 2px; transition: all 0.15s ease;
    }
    .dial-btn:hover { background: rgba(255,255,255,0.6); color: var(--ink); }
    .dial-btn.active {
      background: var(--ink); color: #fff; font-weight: 700;
    }
    .dial-btn.keynote-btn {
      border-color: var(--red); color: var(--red); font-weight: 700;
    }
    .dial-btn.keynote-btn.active {
      background: var(--red); color: #fff;
    }

    /* MAIN CONTAINER */
    .main-stage {
      max-width: 1080px; margin: 0 auto; padding: 40px 24px 120px;
    }

    /* =========================================================
       THOUGHT ESSAY CONTAINER STYLING
       ========================================================= */
    .essay-container { display: block; }
    .essay-container.hidden { display: none; }

    .essay-masthead {
      border-bottom: 2px solid var(--ink); padding-bottom: 28px; margin-bottom: 36px;
    }
    .essay-meta-row {
      display: flex; justify-content: space-between; align-items: baseline;
      font-family: var(--mono); font-size: 11px; letter-spacing: 0.18em;
      color: var(--ink-faint); margin-bottom: 12px;
    }
    .essay-numeral {
      font-family: var(--display); font-size: clamp(3rem, 7vw, 5.5rem);
      font-weight: 700; line-height: 1; color: var(--red); margin-bottom: 8px;
    }
    .essay-title {
      font-family: var(--display); font-size: clamp(2rem, 4.5vw, 3.2rem);
      font-weight: 700; line-height: 1.1; color: var(--ink); margin-bottom: 16px;
    }
    .essay-tags-row {
      display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 20px;
    }
    .essay-pill {
      font-family: var(--mono); font-size: 10.5px; font-weight: 600;
      padding: 3px 9px; background: var(--paper-hi); border: 1px solid var(--hair);
      color: var(--ink); border-radius: 2px;
    }
    .essay-pill.fit { color: var(--red); font-weight: 700; border-color: rgba(158,35,24,0.3); }

    .sovereign-callout {
      background: var(--paper-warm); border-left: 4px solid var(--red);
      padding: 18px 24px; font-family: var(--serif); font-size: 1.25rem;
      font-style: italic; color: var(--ink); line-height: 1.5; margin: 24px 0;
      box-shadow: 2px 4px 14px rgba(40, 32, 18, 0.05);
    }

    .built-case-banner {
      background: linear-gradient(135deg, #f0ebde 0%, #e6dece 100%);
      border: 1px solid var(--hair); padding: 14px 18px; margin: 24px 0 36px;
      display: flex; align-items: center; justify-content: space-between;
      flex-wrap: wrap; gap: 10px;
    }
    .built-case-banner .label {
      font-family: var(--mono); font-size: 11px; font-weight: 700; color: var(--blue);
      letter-spacing: 0.15em;
    }
    .built-case-banner .val {
      font-family: var(--mono); font-size: 12px; font-weight: 600; color: var(--ink);
    }

    /* CONTRACTOR GUILD SECTION */
    .contractor-guild-section {
      background: var(--paper-hi); border: 1.5px solid var(--ink);
      padding: 28px 24px; margin: 40px 0; box-shadow: 4px 6px 20px rgba(0,0,0,0.06);
    }
    .contractor-guild-header {
      border-bottom: 1px solid var(--hair); padding-bottom: 14px; margin-bottom: 20px;
      display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 10px;
    }
    .contractor-guild-header h3 {
      font-family: var(--mono); font-size: 13px; font-weight: 700; letter-spacing: 0.2em;
      color: var(--ink);
    }
    .contractor-guild-header span {
      font-family: var(--mono); font-size: 11px; color: var(--red); font-weight: 700;
    }

    .contractor-cards-grid {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(290px, 1fr)); gap: 16px;
    }
    .contractor-card {
      background: var(--paper-warm); border: 1px solid var(--hair); padding: 16px 16px 14px;
      display: flex; flex-direction: column; border-radius: 2px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.03);
    }
    .contractor-badge-row {
      display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;
    }
    .contractor-prompt-tag {
      font-family: var(--mono); font-size: 10px; font-weight: 700; color: #fff;
      background: var(--red); padding: 2px 6px; border-radius: 2px;
    }
    .contractor-role-tag {
      font-family: var(--mono); font-size: 9.5px; font-weight: 700; color: var(--ink-soft);
      letter-spacing: 0.1em; text-transform: uppercase;
    }
    .contractor-title {
      font-family: var(--serif); font-size: 1.05rem; font-weight: 700; color: var(--ink);
      line-height: 1.3; margin-bottom: 10px;
    }
    .contractor-block {
      font-family: var(--sans); font-size: 12px; line-height: 1.5; color: var(--ink-soft);
      margin-bottom: 8px;
    }
    .contractor-block strong { color: var(--ink); font-family: var(--mono); font-size: 10.5px; }
    .contractor-link {
      margin-top: auto; padding-top: 8px; border-top: 1px dashed var(--hair);
      font-family: var(--mono); font-size: 10px; font-weight: 700; color: var(--red);
      text-decoration: none; display: inline-flex; align-items: center; gap: 4px;
    }
    .contractor-link:hover { text-decoration: underline; }

    /* ESSAY PROSE SECTIONS */
    .essay-prose-block {
      margin: 36px 0;
    }
    .essay-prose-block h2 {
      font-family: var(--mono); font-size: 14px; letter-spacing: 0.2em; font-weight: 700;
      color: var(--red); margin: 32px 0 16px; border-top: 1px solid var(--hair);
      padding-top: 24px;
    }
    .essay-prose-block h3 {
      font-family: var(--display); font-size: 1.6rem; font-weight: 700; color: var(--ink);
      margin: 20px 0 12px;
    }
    .essay-prose-block p {
      font-family: var(--serif); font-size: 1.12rem; line-height: 1.85; color: var(--ink);
      margin-bottom: 20px;
    }
    .essay-prose-block pre {
      background: var(--paper-dark); color: #ece5d8; padding: 18px 20px;
      font-family: var(--mono); font-size: 12px; line-height: 1.6;
      overflow-x: auto; margin: 24px 0; border-radius: 2px;
    }
    .essay-prose-block blockquote {
      border-left: 3px solid var(--ink); padding-left: 18px; margin: 24px 0;
      font-style: italic; color: var(--ink-soft);
    }

    /* =========================================================
       KEYNOTE PRESENTATION STAGE STYLING (16:9 DECK)
       ========================================================= */
    .presentation-view { display: none; }
    .presentation-view.active { display: block; }

    .pres-stage-card {
      background: var(--paper-warm); border: 2px solid var(--ink);
      box-shadow: 8px 12px 36px rgba(40, 32, 18, 0.16);
      aspect-ratio: 16 / 9.8; width: 100%; max-height: 82vh;
      display: flex; flex-direction: column; position: relative;
      overflow: hidden; padding: 36px 44px;
    }
    @media (max-width: 800px) {
      .pres-stage-card { aspect-ratio: auto; min-height: 70vh; padding: 24px 18px; }
    }

    .pres-top-meta {
      display: flex; justify-content: space-between; align-items: center;
      border-bottom: 1px solid var(--hair); padding-bottom: 12px; margin-bottom: 24px;
      font-family: var(--mono); font-size: 11px; color: var(--ink-faint); font-weight: 600;
    }
    .pres-slide-body-container {
      flex-grow: 1; display: flex; flex-direction: column; justify-content: center;
      overflow-y: auto;
    }
    .pres-title {
      font-family: var(--display); font-size: clamp(2.2rem, 4.5vw, 3.8rem);
      font-weight: 700; line-height: 1.05; color: var(--ink); margin-bottom: 8px;
    }
    .pres-subtitle-strip {
      display: flex; gap: 18px; font-family: var(--mono); font-size: 12px;
      letter-spacing: 0.15em; color: var(--ink-soft); margin-bottom: 18px; flex-wrap: wrap;
    }
    .pres-subtitle-strip span strong { color: var(--red); }
    .pres-sovereign-quote {
      font-family: var(--serif); font-size: clamp(1.2rem, 2.2vw, 1.8rem);
      font-style: italic; color: var(--ink); line-height: 1.45;
      border-left: 4px solid var(--red); padding-left: 18px; margin: 18px 0;
    }
    .pres-case-badge {
      font-family: var(--mono); font-size: 11.5px; font-weight: 700; color: var(--blue);
      letter-spacing: 0.12em; background: var(--paper-lo); padding: 4px 10px;
      display: inline-block; border-radius: 2px; align-self: flex-start;
    }

    /* SLIDE COMPONENTS */
    .pres-grid-2col {
      display: grid; grid-template-columns: 1fr 1fr; gap: 20px;
    }
    @media (max-width: 760px) { .pres-grid-2col { grid-template-columns: 1fr; } }
    .pres-card {
      background: var(--paper-hi); border: 1.5px solid var(--ink); padding: 20px;
      display: flex; flex-direction: column; justify-content: space-between;
    }
    .pres-card.confirm-border { border-top: 4px solid #2d7a3e; }
    .pres-card.breakdown-border { border-top: 4px solid var(--red); }
    .pres-card-header {
      font-family: var(--mono); font-size: 11px; font-weight: 700; letter-spacing: 0.15em;
      margin-bottom: 10px;
    }
    .text-confirm { color: #2d7a3e; }
    .text-breakdown { color: var(--red); }
    .text-gold { color: var(--gold); }
    .pres-card-body {
      font-family: var(--serif); font-size: 15px; line-height: 1.6; color: var(--ink);
      flex-grow: 1; margin-bottom: 12px;
    }
    .pres-card-meta {
      font-family: var(--mono); font-size: 10.5px; color: var(--ink-faint);
      border-top: 1px dashed var(--hair); padding-top: 8px;
    }

    .pres-contractors-grid {
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px;
    }
    @media (max-width: 850px) { .pres-contractors-grid { grid-template-columns: 1fr; } }
    .pres-contractor-card {
      background: var(--paper-hi); border: 1px solid var(--hair); padding: 14px;
      display: flex; flex-direction: column;
    }
    .pres-contractor-top {
      display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;
    }
    .pres-prompt-badge {
      background: var(--red); color: #fff; font-family: var(--mono); font-size: 9px;
      font-weight: 700; padding: 2px 5px; border-radius: 2px;
    }
    .pres-contractor-role {
      font-family: var(--mono); font-size: 9px; font-weight: 700; color: var(--ink-soft);
      text-transform: uppercase;
    }
    .pres-contractor-name {
      font-family: var(--serif); font-size: 14px; font-weight: 700; color: var(--ink);
      margin-bottom: 6px;
    }
    .pres-contractor-defect {
      font-family: var(--sans); font-size: 11px; color: var(--ink-soft); margin-bottom: 6px;
      line-height: 1.4;
    }
    .pres-contractor-order {
      font-family: var(--sans); font-size: 11px; color: var(--ink); line-height: 1.4;
    }

    .pres-six-cases-grid {
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;
    }
    @media (max-width: 800px) { .pres-six-cases-grid { grid-template-columns: 1fr; } }
    .pres-mini-case {
      background: var(--paper-hi); border: 1px solid var(--hair); padding: 12px;
    }
    .pres-mini-case .case-num {
      font-family: var(--display); font-size: 1.4rem; color: var(--red); font-weight: 700; line-height: 1;
    }
    .pres-mini-case .case-name {
      font-family: var(--mono); font-size: 11px; font-weight: 700; margin: 4px 0 6px;
    }
    .pres-mini-case .case-desc {
      font-family: var(--serif); font-size: 12px; line-height: 1.4; color: var(--ink-soft);
    }

    /* PRES CONTROLS BAR */
    .pres-bottom-bar {
      margin-top: 18px; display: flex; justify-content: space-between; align-items: center;
      font-family: var(--mono); font-size: 11px;
    }
    .pres-nav-btns { display: flex; gap: 8px; }
    .btn-pres-step {
      background: var(--paper-hi); border: 1.5px solid var(--ink); color: var(--ink);
      padding: 8px 18px; font-family: var(--mono); font-size: 11px; font-weight: 700;
      cursor: pointer; transition: all 0.15s ease;
    }
    .btn-pres-step:hover { background: var(--ink); color: #fff; }

    /* FOOTER DOCK */
    .global-footer-dock {
      background: var(--paper-dark); color: #ece5d8; padding: 24px;
      display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;
      gap: 16px; font-family: var(--mono); font-size: 11px;
    }
    .global-footer-dock a { color: #fae9a4; text-decoration: none; font-weight: 700; }
    .global-footer-dock a:hover { text-decoration: underline; }
  </style>
</head>
<body>

  <!-- TOP RUNNING BAR -->
  <header class="top-bar">
    <div class="top-left">
      <a href="index.html" class="brand-link" title="Return to WORLDFUL Atlas">&larr; WORLDFUL ATLAS</a>
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

  <!-- DIAL SWITCHER (DECK 00 + GAMES 01-12) -->
  <nav class="dial-bar" id="dialBar">
    <button class="dial-btn keynote-btn active" data-id="00" onclick="selectGame('00')">
      [ KEYNOTE ] DEEP PLAY AT THE APERTURE
    </button>
    <!-- Games 01-12 buttons populated via JS -->
  </nav>

  <!-- MAIN STAGE -->
  <main class="main-stage">

    <!-- ==========================================
         VIEW 1: THOUGHT ESSAY CONTAINER
         ========================================== -->
    <article class="essay-container" id="essayView">
      <!-- Injected via JS based on selected game -->
    </article>

    <!-- ==========================================
         VIEW 2: KEYNOTE PRESENTATION DECK
         ========================================== -->
    <section class="presentation-view" id="presView">
      <div class="pres-stage-card" id="presStageCard">
        <div class="pres-top-meta">
          <span id="presTopDeckLabel">DECK 00 // DEEP PLAY AT THE APERTURE</span>
          <span id="presSlideCounter">SLIDE 01 / 06</span>
        </div>
        <div class="pres-slide-body-container" id="presSlideBody">
          <!-- Active slide injected via JS -->
        </div>
      </div>

      <div class="pres-bottom-bar">
        <div style="color:var(--ink-faint); font-family:var(--mono); font-size:10.5px;">
          HOTKEYS: [ &larr; PREV ] [ &rarr; / SPACE NEXT ] [ ESC ESSAY MODE ]
        </div>
        <div class="pres-nav-btns">
          <button class="btn-pres-step" onclick="prevSlide()">&larr; PREVIOUS</button>
          <button class="btn-pres-step" onclick="nextSlide()">NEXT &rarr;</button>
        </div>
      </div>
    </section>

  </main>

  <!-- FOOTER DOCK -->
  <footer class="global-footer-dock">
    <div>WORLDFUL PRESS // OPERATIVE HUMANITIES &bull; SPECIFICATION SERIES WF-LG-12</div>
    <div>
      <a href="index.html">&larr; Main Atlas</a> &bull;
      <a href="WAYS TO WRITE/system_instructions.md">The 136 Prompts Archive &nearr;</a> &bull;
      <a href="WAYS TO WRITE/deep_play_at_the_aperture_operationalized.md">Operational Defense Plan &nearr;</a>
    </div>
  </footer>

  <script>
    const GAMES_DATA = __GAMES_JSON__;
    const KEYNOTE_DECK_00 = __KEYNOTE_JSON__;

    let currentSelectedId = "00";
    let currentViewMode = "essay"; // "essay" or "presentation"
    let currentSlideIndex = 0;

    function init() {
      renderDialButtons();
      renderActiveContent();
      setupKeyboardControls();

      // Check URL parameters
      const params = new URLSearchParams(window.location.search);
      if (params.get("game")) {
        currentSelectedId = params.get("game");
      }
      if (params.get("mode") === "presentation" || params.get("pres") === "1") {
        currentViewMode = "presentation";
      }
      updateActiveDial();
      renderActiveContent();
    }

    function renderDialButtons() {
      const dialBar = document.getElementById("dialBar");
      const gameButtons = GAMES_DATA.map(g => `
        <button class="dial-btn" data-id="${g.num}" onclick="selectGame('${g.num}')">
          [ ${g.num} ] ${g.name}
        </button>
      `).join('');
      dialBar.innerHTML = `
        <button class="dial-btn keynote-btn ${currentSelectedId === '00' ? 'active' : ''}" data-id="00" onclick="selectGame('00')">
          [ KEYNOTE ] DEEP PLAY AT THE APERTURE
        </button>
        ${gameButtons}
      `;
    }

    function updateActiveDial() {
      document.querySelectorAll(".dial-btn").forEach(btn => {
        btn.classList.toggle("active", btn.getAttribute("data-id") === currentSelectedId);
      });
    }

    function selectGame(id) {
      currentSelectedId = id;
      currentSlideIndex = 0;
      updateActiveDial();
      renderActiveContent();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function switchViewMode(mode) {
      currentViewMode = mode;
      document.getElementById("btnModeEssay").classList.toggle("active", mode === "essay");
      document.getElementById("btnModePres").classList.toggle("active", mode === "presentation");
      document.getElementById("essayView").classList.toggle("hidden", mode === "presentation");
      document.getElementById("presView").classList.toggle("active", mode === "presentation");
      renderActiveContent();
    }

    function getActiveSlides() {
      if (currentSelectedId === "00") return KEYNOTE_DECK_00;
      const game = GAMES_DATA.find(g => g.num === currentSelectedId);
      return game ? game.slides : KEYNOTE_DECK_00;
    }

    function renderActiveContent() {
      if (currentViewMode === "essay") {
        renderEssayView();
      } else {
        renderPresentationSlide();
      }
    }

    function renderEssayView() {
      const essayContainer = document.getElementById("essayView");
      if (currentSelectedId === "00") {
        // Render Keynote Overview Essay
        essayContainer.innerHTML = `
          <div class="essay-masthead">
            <div class="essay-meta-row">
              <span>SERIES: OPERATIVE HUMANITIES MONOGRAPH</span>
              <span>SEPTEMBER 7, 2026</span>
            </div>
            <div class="essay-title">Deep Play at the Aperture: Large Language Games and the Operative Humanities</div>
            <div class="essay-tags-row">
              <span class="essay-pill fit">Watson Hartsoe</span>
              <span class="essay-pill">1 Aperture</span>
              <span class="essay-pill">12 Institutions</span>
              <span class="essay-pill">6 Built Cases</span>
              <span class="essay-pill">Operative Humanities</span>
            </div>
            <div class="sovereign-callout">
              &ldquo;Generative interfaces have compressed historically distinct practices of language into a single textual aperture.
              The prompt is not a natural kind. It is the visible trace of an operative arrangement.&rdquo;
            </div>
          </div>

          <div class="essay-prose-block">
            <h2>01 // THE APERTURE ERROR</h2>
            <p>
              A language model is given a sentence: <em>“Draw a circle.”</em> Nothing in those three words tells us what sort of act has occurred.
              A design client may be commissioning an image. A programmer may be testing whether a graphics agent can execute a command.
              A researcher may be probing geometric competence. An artist may be supplying a score whose realization is intentionally open.
              A teacher may be issuing an instruction. A performer may be making a timed move before an audience.
            </p>
            <p>
              Contemporary generative interfaces conceal this instability by giving all of these acts the same aperture:
              a rectangular text box, a send button, a transcript. The interface implies that “prompt” names a coherent natural kind.
              It does not. Let an utterance be represented as a string <em>u</em>. A prompt-centric account assumes that the system's task is
              to infer an appropriate response from <em>u</em> plus context <em>c</em>: <strong>R = f(u, c)</strong>.
              But the decisive variable is the operative game <em>g</em> that assigns roles, authority, valid moves, evidentiary standards,
              state transitions, and success conditions: <strong>R = f(u, c, g)</strong>.
            </p>

            <h2>02 // THE SIX BUILT CASES & EXTERNAL RESISTANCE</h2>
            <p>
              The argument is grounded in a practice-based corpus of systems assembled in the <em>elsewhere</em> research portfolio:
            </p>
            <div class="pres-six-cases-grid" style="margin:24px 0;">
              <div class="pres-mini-case"><div class="case-num">01</div><div class="case-name">LEGO / LDraw</div><div class="case-desc">Spatial Resistance: Plastic bricks refuse fluent rhetoric; Montanari constraints distinguish 'should not' from 'cannot'.</div></div>
              <div class="pres-mini-case"><div class="case-num">02</div><div class="case-name">LEGOS / Ripples</div><div class="case-desc">Temporal Resistance: The eaten berry cannot return; state graphs govern consequence while RAG only retrieves traces.</div></div>
              <div class="pres-mini-case"><div class="case-num">03</div><div class="case-name">Centaur Box</div><div class="case-desc">Strategic Resistance: Public speech is the residue of planning; gatekeeper refusal is new situated evidence.</div></div>
              <div class="pres-mini-case"><div class="case-num">04</div><div class="case-name">Thick Prompting</div><div class="case-desc">Epistemic Resistance: Probing black boxes under controlled variations without scaffolding the measured behavior.</div></div>
              <div class="pres-mini-case"><div class="case-num">05</div><div class="case-name">CinePrompt</div><div class="case-desc">Interpretive Resistance: Operative ekphrasis and LeWitt open scores separating persistent invariants from generative latitude.</div></div>
              <div class="pres-mini-case"><div class="case-num">06</div><div class="case-name">Machinery of Meaning</div><div class="case-desc">Performative Resistance: Procedural film staging code, proposition, and execution live on the screen.</div></div>
            </div>

            <h2>03 // THE OPERATIVE HUMANITIES</h2>
            <p>
              If Austin teaches that force depends on felicity conditions, provenance and authority need explicit representation.
              If conversation analysis teaches that meaning is sequential, turn history and repair should not be flattened into isolated messages.
              If textual scholarship teaches that revision is a history of differences, editing interfaces should show semantic deltas.
              If art sociology teaches that making is distributed, generative provenance should track delegation rather than oscillate between “tool” and “agent.”
            </p>
            <p>
              Humanities concepts become design constraints because language has entered execution pipelines.
              The operative humanities does not wait to write the post-mortem. We build the machinery that makes those interpretations inspectable,
              accountable, and subject to human refusal.
            </p>
          </div>
        `;
        return;
      }

      // Render Individual Game Thought Container
      const g = GAMES_DATA.find(item => item.num === currentSelectedId);
      if (!g) return;

      essayContainer.innerHTML = `
        <div class="essay-masthead">
          <div class="essay-meta-row">
            <span>LANGUAGE GAME ${g.num} // SPECIFICATION</span>
            <span>DIRECTION: ${g.direction_of_fit.toUpperCase()}</span>
          </div>
          <div class="essay-numeral">${g.num}</div>
          <div class="essay-title">${g.name}</div>
          <div class="essay-tags-row">
            <span class="essay-pill fit">${g.direction_of_fit}</span>
            <span class="essay-pill">Principal: ${g.human_role}</span>
            <span class="essay-pill">Executor: ${g.machine_role}</span>
            <span class="essay-pill" style="color:var(--gold);">Built Case: ${g.built_case.split('(')[0]}</span>
          </div>
          <div class="sovereign-callout">
            &ldquo;${g.sovereign_question}&rdquo;
          </div>
        </div>

        <div class="built-case-banner">
          <div>
            <div class="label">BUILT CASE STUDY (ELSEWHERE CORPUS):</div>
            <div class="val">${g.built_case}</div>
          </div>
          <div>
            <div class="label" style="color:var(--red);">EXTERNAL RESISTANCE:</div>
            <div class="val">${g.resistance}</div>
          </div>
        </div>

        <!-- THE CONTRACTOR GUILD -->
        <div class="contractor-guild-section">
          <div class="contractor-guild-header">
            <h3>THE CONTRACTOR GUILD // APPLIED SYSTEM INSTRUCTIONS</h3>
            <span>3 SPECIALIZED CONTRACTORS HIRED FROM THE 136 PROMPTS</span>
          </div>
          <div class="contractor-cards-grid">
            ${g.contractors.map(c => `
              <div class="contractor-card">
                <div class="contractor-badge-row">
                  <span class="contractor-prompt-tag">PROMPT ${c.prompt_num}</span>
                  <span class="contractor-role-tag">${c.role}</span>
                </div>
                <div class="contractor-title">${c.prompt_name}</div>
                <div class="contractor-block"><strong>DEFECT SOLVED:</strong> ${c.defect}</div>
                <div class="contractor-block"><strong>WORK ORDER:</strong> ${c.work_order}</div>
                <a href="WAYS TO WRITE/system_instructions.md#${c.anchor}" class="contractor-link" target="_blank">
                  VIEW INSTRUCTION PROMPT &rarr;
                </a>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- FULL UNABRIDGED ESSAY SECTIONS 1 - 7 -->
        <div class="essay-prose-block">
          <h2>01 // THE EMPIRICAL CARD &amp; EPISTEMIC TRADE-OFFS</h2>
          ${g.sec1_html}

          <h2>02 // CORE GAME SPECIFICATION</h2>
          ${g.sec2_html}

          <h2>03 // ANCESTRAL LINEAGE &amp; MIGRATION MAP</h2>
          ${g.sec3_html}

          <h2>04 // FORMAL ECHO &amp; LITERATURE GROUNDING</h2>
          ${g.sec4_html}

          <h2>05 // THEORY OF THE PROGRAM &amp; COMPUTATIONAL ONTOLOGY</h2>
          ${g.sec5_html}

          <h2>06 // RESIDUAL HUMAN THEORY (THE IRREDUCIBLE STAKES)</h2>
          ${g.sec6_html}

          <h2>07 // PLAY DYNAMICS, PUZZLE &amp; FUN THEORY</h2>
          ${g.sec7_html}
        </div>
      `;
    }

    function renderPresentationSlide() {
      const slides = getActiveSlides();
      if (currentSlideIndex >= slides.length) currentSlideIndex = 0;
      if (currentSlideIndex < 0) currentSlideIndex = slides.length - 1;

      const s = slides[currentSlideIndex];
      const topLabel = currentSelectedId === "00" 
        ? "DECK 00 // DEEP PLAY AT THE APERTURE" 
        : `GAME ${currentSelectedId} // ${GAMES_DATA.find(g => g.num === currentSelectedId)?.name || ''}`;

      document.getElementById("presTopDeckLabel").textContent = topLabel;
      document.getElementById("presSlideCounter").textContent = `SLIDE 0${s.slide_num} / 0${slides.length}`;
      document.getElementById("presSlideBody").innerHTML = s.content;
    }

    function nextSlide() {
      const slides = getActiveSlides();
      currentSlideIndex = (currentSlideIndex + 1) % slides.length;
      renderPresentationSlide();
    }

    function prevSlide() {
      const slides = getActiveSlides();
      currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
      renderPresentationSlide();
    }

    function setupKeyboardControls() {
      window.addEventListener("keydown", (e) => {
        if (e.key === "p" || e.key === "P") {
          switchViewMode(currentViewMode === "essay" ? "presentation" : "essay");
          return;
        }
        if (e.key === "Escape") {
          switchViewMode("essay");
          return;
        }
        if (currentViewMode === "presentation") {
          if (e.key === "ArrowRight" || e.key === " ") {
            e.preventDefault();
            nextSlide();
          } else if (e.key === "ArrowLeft") {
            e.preventDefault();
            prevSlide();
          }
        }
      });
    }

    window.addEventListener("DOMContentLoaded", init);
  </script>
</body>
</html>
"""

# Replace placeholders
rendered_html = html_template.replace("__GAMES_JSON__", json.dumps(games_data))
rendered_html = rendered_html.replace("__KEYNOTE_JSON__", json.dumps(KEYNOTE_DECK_00))

output_path = os.path.join(base_dir, "presentation.html")
with open(output_path, "w", encoding="utf-8") as f:
    f.write(rendered_html)

print(f"Successfully generated {output_path} ({len(rendered_html):,} bytes)")

# Also copy to WAYS TO WRITE/presentation.html
with open(os.path.join(base_dir, "WAYS TO WRITE/presentation.html"), "w", encoding="utf-8") as f:
    f.write(rendered_html)

print("Complete!")
