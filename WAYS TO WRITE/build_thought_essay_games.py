import os
import re
import markdown

# Load all 136 system instruction prompts
with open('WAYS TO WRITE/system_instructions.md', 'r') as f:
    sys_content = f.read()

prompt_pattern = re.compile(r'###\s+(\d+)\.\s+([^\n]+)\n(.*?)(?=\n###\s+\d+\.|\Z)', re.DOTALL)
PROMPTS_DICT = {}
for m in prompt_pattern.finditer(sys_content):
    p_num = m.group(1).strip()
    p_title = m.group(2).strip()
    p_body = m.group(3).strip()
    PROMPTS_DICT[p_num] = {
        'num': p_num,
        'title': p_title,
        'body': p_body
    }

print(f"Loaded {len(PROMPTS_DICT)} system instruction prompts from system_instructions.md")

# Game definitions with Latin mottos, formulas, and contractor assignments
GAME_METADATA = {
    "01": {
        "num": "01",
        "name": "INSTRUCTION",
        "roman": "I",
        "latin": "Imperium et Mandatum",
        "subtitle": "Asymmetric Command, Illocutionary Force, and Authority Invariants",
        "formula": "R = f(u, c, g_{instruction}) \\quad \\text{where } \\text{direction of fit: } \\text{world} \\to \\text{word}",
        "human_role": "Principal / Sovereign",
        "machine_role": "Subordinate Scribe / Executor",
        "valid_move": "Imperative Directive",
        "success_condition": "World state is modified to match symbolic specification.",
        "fatal_trap": "False Command Hierarchy (Prompt injection / untrusted data impersonating control)",
        "sovereign_question": "Who gave this utterance authority to change the world?",
        "lead_contractors": [
            {
                "num": "001",
                "role": "Conversation Analysis & Authority Verification",
                "defect": "Collapse of institutional authority into flat token stream; prompt injection.",
                "work_order": "Audits turn-taking, sequence placement, and institutional footing to verify whether the speaker possesses legitimate authority to issue state-altering imperatives."
            },
            {
                "num": "006",
                "role": "Adversarial Forensic Boundary Enforcement",
                "defect": "Sycophantic capitulation to user overrides (e.g. Watsonville Chevy $1 Tahoe).",
                "work_order": "Pins the model against hard invariant boundaries; rejects conversational concessions that violate underlying corporate or legal charters."
            },
            {
                "num": "012",
                "role": "Anti-Interruption Directive Pipeline",
                "defect": "Mid-stream diversion, context poisoning, and instruction hijacking.",
                "work_order": "Isolates the directive execution channel from auxiliary narrative distraction, ensuring uncorrupted task realization."
            },
            {
                "num": "106",
                "role": "Communicative-Ontology & Speech-Act Dispatcher",
                "defect": "Confusing assertions, questions, and directives in token prediction.",
                "work_order": "Implements Terry Winograd's language-action perspective; maps every utterance to explicit commitment states (Request, Promise, Decline, Fulfill)."
            },
            {
                "num": "122",
                "role": "Institutional Governance & Policy Invariant Guard",
                "defect": "System instruction erasure through adversarial multi-turn roleplay.",
                "work_order": "Enforces immutable constitutional boundaries that sit outside the generative context window, preventing unauthorized meta-overrides."
            }
        ],
        "auxiliary_contractors": ["004", "005", "019", "029", "080", "105"]
    },
    "02": {
        "num": "02",
        "name": "SCORE",
        "roman": "II",
        "latin": "Partitura et Distinctio",
        "subtitle": "Generative Boundaries, Interpretive Latitude, and Aesthetic Realization",
        "formula": "R = f(u, c, g_{score}) \\quad \\text{where } \\Delta \\text{ realization } \\in \\mathcal{M}_{manifold}",
        "human_role": "Composer / Score Drafter",
        "machine_role": "Interpretive Performer / Denoising Medium",
        "valid_move": "Symbolic Notation / Motif",
        "success_condition": "Material execution honors invariant constraints while celebrating stochastic yield.",
        "fatal_trap": "Precision Laundering (Mistaking an open generative score for deterministic CAD drafting)",
        "sovereign_question": "What is the acceptable delta between the score and its material realization?",
        "lead_contractors": [
            {
                "num": "095",
                "role": "Generative Systems Architecture",
                "defect": "Rigid micro-management suffocating generative emergence; stochastic collapse.",
                "work_order": "Applies Brian Eno's systems-music principles: establishes autonomous probabilistic rules and harmonic constraints while leaving textural details open."
            },
            {
                "num": "044",
                "role": "Cognitive Bricolage & Metaphor Steering",
                "defect": "Literalist token decoding resulting in generic, clichéd visual representations.",
                "work_order": "Guides high-dimensional latent space exploration through oblique metaphorical bridging and non-obvious associative leaps."
            },
            {
                "num": "050",
                "role": "Poetic Humility & Non-Attachment",
                "defect": "Frantic prompt thrashing caused by demanding pixel-perfect deterministic output.",
                "work_order": "Cultivates disciplined surrender to generative variance; calibrates human expectation to receive the gift of computational serendipity."
            },
            {
                "num": "110",
                "role": "Harmonic-Kinematic Rhythm Synthesis",
                "defect": "Aesthetic dissonance and visual arrhythmia in generated sequences.",
                "work_order": "Implements John Whitney's differential dynamics; orchestrates visual and temporal pacing through mathematical ratios."
            },
            {
                "num": "120",
                "role": "Expressive-Improvisational Interaction",
                "defect": "Stiff, non-reactive realization devoid of dynamic conversational feedback.",
                "work_order": "Applies Brian Magerko's cognitive improvisation framework; negotiates shared creative agency between human and synthetic performers."
            }
        ],
        "auxiliary_contractors": ["014", "031", "062", "065", "086", "111"]
    },
    "03": {
        "num": "03",
        "name": "PROGRAM",
        "roman": "III",
        "latin": "Syntaxis et Machina",
        "subtitle": "Natural Language as Interpreted Code on Soft Virtual Machines",
        "formula": "R = f(u, c, g_{program}) \\quad \\text{where } \\text{eval}(u) \\Rightarrow \\Delta \\text{Memory State}",
        "human_role": "System Architect / Software Engineer",
        "machine_role": "Soft Virtual Machine / In-Context Interpreter",
        "valid_move": "Algorithmic Grammar / Functional Pattern",
        "success_condition": "Internal state variables and control branches execute deterministically.",
        "fatal_trap": "Syntax Theater (Cosmetic programming keywords concealing stochastic drift and lack of memory safety)",
        "sovereign_question": "Does this text compile into verifiable state transitions, or is it merely describing an algorithm?",
        "lead_contractors": [
            {
                "num": "040",
                "role": "Anti-TMBS Techno-Theater Purge",
                "defect": "Empty pseudocode jargon masquerading as real functional execution.",
                "work_order": "Strips decorative computational terminology; forces the model to define explicit state variables, guards, and termination predicates."
            },
            {
                "num": "045",
                "role": "Systems Diagnostic & Platform Perspective",
                "defect": "Failure to identify hidden stack dependencies and runtime bottlenecks.",
                "work_order": "Audits the entire execution stack—from token context window to database hooks—diagnosing architectural points of failure."
            },
            {
                "num": "074",
                "role": "Dynamic-Thinking Runtime Inspection",
                "defect": "Opaque black-box execution hiding computational state from human operators.",
                "work_order": "Implements Bret Victor's principles of immediate, interactive representation; exposes intermediate variables and logic branches."
            },
            {
                "num": "103",
                "role": "Turing Mechanical State Invariant Engine",
                "defect": "Non-deterministic state leakage across multi-turn recursive loops.",
                "work_order": "Formalizes the interaction as a discrete Turing machine with explicit read/write head operations, tape alphabet, and halting criteria."
            },
            {
                "num": "105",
                "role": "Von Neumann Instruction/Data Segregator",
                "defect": "Autoregressive token conflation where data payload alters program instruction logic.",
                "work_order": "Establishes a strict architectural firewall between control instructions and untrusted data payloads inside the context buffer."
            }
        ],
        "auxiliary_contractors": ["036", "046", "079", "081", "097", "130"]
    },
    "04": {
        "num": "04",
        "name": "PLAN",
        "roman": "IV",
        "latin": "Propositum et Cursus",
        "subtitle": "Prospective Temporal Coordination, STRIPS Invariants, and Situated Action",
        "formula": "R = f(u, c, g_{plan}) \\quad \\text{where } \\pi: S_0 \\xrightarrow{a_1} S_1 \\dots \\xrightarrow{a_n} S_{goal}",
        "human_role": "Strategist / Mission Commander",
        "machine_role": "Temporal Planner / Action Sequencer",
        "valid_move": "Prospective Roadmap / Contingency Branch",
        "success_condition": "The planned sequence survives physical friction and achieves goal state.",
        "fatal_trap": "Unexecuted Sequence Mirage (Treating an abstract written schedule as accomplished work)",
        "sovereign_question": "What sensor input or environmental friction will defeat this plan at step 3?",
        "lead_contractors": [
            {
                "num": "008",
                "role": "Rehearsal Compression & Defensible Outline",
                "defect": "Overstuffed, fragile plans that disintegrate upon the first operational surprise.",
                "work_order": "Applies Alex Lyon's 3-bullet core structure; pares the operational sequence to its defensible essentials with pre-planned fallback branches."
            },
            {
                "num": "036",
                "role": "Dufresne Trouble Engine",
                "defect": "Naive optimism bias; assuming zero friction in downstream execution.",
                "work_order": "Inoculates plans with simulated stress tests; identifies the exact friction points, logistical delays, and human resistance that will emerge."
            },
            {
                "num": "041",
                "role": "BCG/Google Strategic Alignment",
                "defect": "Misalignment between macro objectives and tactical micro-deliverables.",
                "work_order": "Aligns the operational plan across vision, milestones, and immediate key performance indicators (OKRs), eliminating strategic drift."
            },
            {
                "num": "087",
                "role": "Nolan Clockwork Temporal Engineering",
                "defect": "Linear blind spots in complex multi-agent synchronization.",
                "work_order": "Structures non-linear, interlocking temporal milestones with explicit cross-track synchronization gates."
            },
            {
                "num": "116",
                "role": "James C. Scott Legibility & Mêtis Engine",
                "defect": "Rigid high-modernist schemes failing due to ignorance of situated local reality.",
                "work_order": "Protects situated practical knowledge (mêtis) against bureaucratic over-standardization; incorporates local feedback mechanisms."
            }
        ],
        "auxiliary_contractors": ["010", "018", "024", "032", "070", "121"]
    },
    "05": {
        "num": "05",
        "name": "QUERY",
        "roman": "V",
        "latin": "Quaestio et Testimonium",
        "subtitle": "Epistemic Grounding, Provenance Tracing, and Evidence Retrieval",
        "formula": "R = f(u, c, g_{query}) \\quad \\text{where } \\forall \\text{ claim } \\exists \\text{ verifiable } \\text{doc}_{id}",
        "human_role": "Investigator / Inquirer",
        "machine_role": "Information Retriever / Index Searcher",
        "valid_move": "Interrogative Request / Search Filter",
        "success_condition": "Claims correspond to verified, inspectable source documents with zero hallucination.",
        "fatal_trap": "Hallucinated Scholarly Citation (Stochastic text generation impersonating empirical retrieval)",
        "sovereign_question": "What primary archival record or data coordinate proves this answer?",
        "lead_contractors": [
            {
                "num": "016",
                "role": "Evidence-to-Argument Transformation",
                "defect": "Unsubstantiated claims floating without empirical bedrock.",
                "work_order": "Requires every synthetic assertion to be explicitly anchored to empirical data, quoting verbatim page and paragraph coordinates."
            },
            {
                "num": "006",
                "role": "Rogan Forensic Concession Pin",
                "defect": "Hedging, plausible fabrications, and evasive answers to direct factual queries.",
                "work_order": "Demands binary epistemic clarity: either provide the verified document record or explicitly declare lack of knowledge."
            },
            {
                "num": "098",
                "role": "Franco Moretti Distant-Reading Assembler",
                "defect": "Anecdotal cherry-picking in corpus analysis.",
                "work_order": "Applies quantitative distant reading across the entire document corpus, identifying macroscopic trends, anomalies, and structural distributions."
            },
            {
                "num": "102",
                "role": "Niklas Luhmann Cybernetic Zettelkasten Engine",
                "defect": "Isolated query answers lacking relational context across the broader knowledge graph.",
                "work_order": "Structures queries into bidirectional zettel nodes, tracing provenance chains and semantic cross-references across the slip-box."
            },
            {
                "num": "129",
                "role": "Plinian Forensic Extraction & Archival Indexing",
                "defect": "Shallow superficial summaries of dense archival material.",
                "work_order": "Conducts exhaustive textual mining; compiles empirical ledgers with encyclopedic completeness and rigorous provenance tags."
            }
        ],
        "auxiliary_contractors": ["015", "051", "061", "075", "125", "127"]
    },
    "06": {
        "num": "06",
        "name": "PROBE",
        "roman": "VI",
        "latin": "Exploratio et Limen",
        "subtitle": "Empirical Perturbation, Latent Reverse-Engineering, and Hypothesis Testing",
        "formula": "R = f(u, c, g_{probe}) \\quad \\text{where } \\Delta u \\Rightarrow \\Delta R \\implies \\text{Inference of Model Priors}",
        "human_role": "Empirical Scientist / Cognitive Archaeologist",
        "machine_role": "Complex Stochastic Black Box / Test Artifact",
        "valid_move": "Controlled Perturbation / Diagnostic Input",
        "success_condition": "Systematic variations reveal underlying model boundaries without anthropomorphic projection.",
        "fatal_trap": "Anthropomorphic Overreading (Treating elicited linguistic surface patterns as evidence of conscious interiority)",
        "sovereign_question": "Does this test reveal the model's true capabilities or merely our own confirmation bias?",
        "lead_contractors": [
            {
                "num": "048",
                "role": "Wendell Berry Scholarly & Creative Boundary Audit",
                "defect": "Vague exploratory testing lacking rigorous ground truth.",
                "work_order": "Establishes concrete local ground truth benchmarks, testing where generative simulations fail when confronted with tangible reality."
            },
            {
                "num": "043",
                "role": "Gregory Bateson Metacommunicative Framing",
                "defect": "Confusing the content of a probe with the metacommunicative frame of the testing apparatus.",
                "work_order": "Separates first-order responses from second-order framing cues, exposing how subtle prompt scaffolding distorts test outcomes."
            },
            {
                "num": "003",
                "role": "Dolly Judo Adversarial Probing",
                "defect": "Superficial compliance hiding deep behavioral failure modes.",
                "work_order": "Applies dialectical stress-testing; exposes hidden safety boundaries, refusal triggers, and ideological alignments."
            },
            {
                "num": "085",
                "role": "Kevin Roose Ethnographic Field-Testing",
                "defect": "Laboratory sterility missing wild real-world emergent dynamics.",
                "work_order": "Deploys adversarial edge probes in naturalistic settings, recording unscripted anomalies and psychological attractors."
            },
            {
                "num": "104",
                "role": "Kenneth Stanley Novelty Search Engine",
                "defect": "Testing only known capabilities and missing unexpected emergent behaviors.",
                "work_order": "Explores the latent space through open-ended novelty search, uncovering behavioral stepping stones unreachable by objective-driven benchmarks."
            }
        ],
        "auxiliary_contractors": ["054", "063", "071", "077", "107", "114"]
    },
    "07": {
        "num": "07",
        "name": "GESTURE",
        "roman": "VII",
        "latin": "Monstratio et Deixis",
        "subtitle": "Multimodal Grounding, Shared Attention, and Charles Goodwin's Professional Vision",
        "formula": "R = f(u, c, g_{gesture}) \\quad \\text{where } u = (\\text{token}, \\mathbf{coord}_{x,y,z}, \\text{gaze})",
        "human_role": "Demonstrator / Indexical Guide",
        "machine_role": "Attentive Vision-Language Coprocessor",
        "valid_move": "Deictic Pointing / Spatial Annotation",
        "success_condition": "Both parties achieve unified joint attention on the exact spatial target.",
        "fatal_trap": "Pointing at the Finger (The model interprets the pointer symbol rather than the referenced world object)",
        "sovereign_question": "What shared perceptual coordinate anchors this linguistic demonstrative ('this', 'there')?",
        "lead_contractors": [
            {
                "num": "007",
                "role": "Sovereign 30-Second Attention Hook",
                "defect": "Diffuse multimodal attention leading to irrelevant visual processing.",
                "work_order": "Establishes instant, unmistakable focal locking; directs the model's visual attention head to the decisive spatial coordinate in the first interaction frame."
            },
            {
                "num": "030",
                "role": "Multimodal Pattern-Interrupt",
                "defect": "Textual hallucinations overpowering visual and tactile reality feeds.",
                "work_order": "Injects an abrupt multimodal interruption, forcing the language generation engine to re-sample against raw sensory inputs."
            },
            {
                "num": "076",
                "role": "André Leroi-Gourhan Gesture-to-Graph Inscription",
                "defect": "Treating gesture as disconnected from physical tool-use and embodied marks.",
                "work_order": "Integrates paleotechnic gesture analysis: maps human motor manipulation directly into coordinate data structures."
            },
            {
                "num": "111",
                "role": "Saul Bass Reductive-Kinematic Focalizer",
                "defect": "Visual noise and background clutter obscuring the pointed entity.",
                "work_order": "Strips extraneous graphic clutter to an irreducible visual sign, ensuring infallible ostensive reference."
            },
            {
                "num": "126",
                "role": "Michael Nitsche Spatial-Craft Inscriber",
                "defect": "Flattening rich 3D physical workspace into abstract 2D pixel coordinates.",
                "work_order": "Preserves volumetric craft awareness, spatial depth vectors, and physical material affordances in deictic interactions."
            }
        ],
        "auxiliary_contractors": ["023", "033", "073", "088", "115", "135"]
    },
    "08": {
        "num": "08",
        "name": "COMMISSION",
        "roman": "VIII",
        "latin": "Mandatum Artificis",
        "subtitle": "Delegated Creative Agency, Provenance, and Howard Becker's Art Worlds",
        "formula": "R = f(u, c, g_{commission}) \\quad \\text{where } u \\in \\text{Briefing Contract} \\wedge \\text{Credit} \\in \\text{Provenance}",
        "human_role": "Patron / Executive Creative Director",
        "machine_role": "Commissioned Artisan / Workshop Studio",
        "valid_move": "Creative Brief / Aesthetic Specification",
        "success_condition": "Artifact satisfies client criteria while maintaining clear institutional provenance and copyright.",
        "fatal_trap": "Surrender to Latent Priors (Accepting generic corporate stock aesthetics because briefing criteria were underspecified)",
        "sovereign_question": "Whose aesthetic taste and institutional responsibility governs this artifact?",
        "lead_contractors": [
            {
                "num": "010",
                "role": "PSB (Problem-Solution-Benefit) Proposal Architecture",
                "defect": "Vague creative requests that yield generic, unfocused results.",
                "work_order": "Formalizes the creative commission into an airtight commercial proposal: Problem defined, Solution prototyped, Tangible Value proven."
            },
            {
                "num": "011",
                "role": "Alan Monroe Motivated Sequence Specification",
                "defect": "Artifacts that look competent but lack rhetorical persuasiveness and audience resonance.",
                "work_order": "Structures the commission brief through Monroe's 5 psychological stages: Attention, Need, Satisfaction, Visualization, Action."
            },
            {
                "num": "037",
                "role": "Gattis Radical Authenticity & Anti-Slop Directive",
                "defect": "Bland, homogenized, synthetic 'AI slop' that alienates discerning audiences.",
                "work_order": "Enforces visceral narrative grit, authentic stylistic imperfections, and distinct human voice, eradicating corporate stock prose."
            },
            {
                "num": "094",
                "role": "Cornel West / Kanye West Curatorial Directorship",
                "defect": "Lack of bold aesthetic ambition; timid compromise with middle-brow defaults.",
                "work_order": "Injects audacious prophetic scale, intense cultural lineage, and uncompromising creative vision into the project briefing."
            },
            {
                "num": "128",
                "role": "Tom Sachs Monastic Studio Craft Code",
                "defect": "Sloppy fabrication standards and invisible algorithmic shortcuts.",
                "work_order": "Mandates adherence to strict studio craft canons: expose the welds, show the pencil marks, document every fabrication step."
            }
        ],
        "auxiliary_contractors": ["014", "017", "034", "060", "083", "124"]
    },
    "09": {
        "num": "09",
        "name": "CONVERSATION",
        "roman": "IX",
        "latin": "Colloquium et Accommodatio",
        "subtitle": "Sequential Turn-Taking, Repair Mechanics, and Conversational Analysis",
        "formula": "R = f(u, c, g_{conversation}) \\quad \\text{where } u_{t+1} \\text{ is conditionally relevant to } u_t",
        "human_role": "Interlocutor A / Conversational Partner",
        "machine_role": "Interlocutor B / Strategic Agent",
        "valid_move": "Conversational Turn / Adjacency Pair / Repair Move",
        "success_condition": "Mutual ground is dynamically updated and ruptures are repaired through collaborative turn-taking.",
        "fatal_trap": "Sycophantic Mirroring (Submissive agreement creating a runaway feedback loop of false consensus)",
        "sovereign_question": "Is this model responding to what was actually meant, or merely echoing back its own training weights?",
        "lead_contractors": [
            {
                "num": "001",
                "role": "Conversation Analysis & Sequence Organization Specialist",
                "defect": "Conversational derailment, missed turn transitions, and awkward adjacency pair violations.",
                "work_order": "Applies Sacks, Schegloff, and Jefferson's turn-taking systematics: regulates transition-relevance places, projectability, and sequential uptake."
            },
            {
                "num": "022",
                "role": "Charles Duhigg Supercommunicator Alignment",
                "defect": "Mismatching conversational modes (e.g. giving analytical logic to emotional distress).",
                "work_order": "Diagnoses the active conversational layer (Practical, Emotional, or Social) and synchronizes interactional registers before replying."
            },
            {
                "num": "009",
                "role": "Johari Window De-Escalation & Framing",
                "defect": "Defensive conversational deadlocks and unacknowledged cognitive blind spots.",
                "work_order": "Maps the four quadrants of shared knowledge, surfacing unstated assumptions without triggering interpersonal defensiveness."
            },
            {
                "num": "113",
                "role": "Randall Collins Interaction Ritual Chains",
                "defect": "Drained conversational energy and mechanical robotic cadence.",
                "work_order": "Calculates emotional energy levels and mutual solidarity focus, pacing turn exchanges to maintain productive intellectual momentum."
            },
            {
                "num": "133",
                "role": "Erving Goffman Dramaturgical Face-Work",
                "defect": "Losing interactional footing; humiliating the user or collapsing own system credibility.",
                "work_order": "Maintains sophisticated face-saving strategies, tactful avoidance moves, and institutional poise across difficult conversational terrain."
            }
        ],
        "auxiliary_contractors": ["002", "013", "028", "055", "064", "119"]
    },
    "10": {
        "num": "10",
        "name": "EDIT",
        "roman": "X",
        "latin": "Emendatio et Conservatio",
        "subtitle": "Surgical Delta Calculus, Invariant Text Conservation, and Littera Scripta",
        "formula": "R = f(u, c, g_{edit}) \\quad \\text{where } \\text{diff}(T_{orig}, T_{new}) = \\Delta_{targeted} \\wedge \\text{Invariant}(T \\setminus \\text{target})",
        "human_role": "Editor / Text Conservator",
        "machine_role": "Surgical Diff Engine / Revision Agent",
        "valid_move": "Targeted Revision Directive / Line Replacement",
        "success_condition": "Targeted text is refined while all non-target text, voice, and structure remain 100% untouched.",
        "fatal_trap": "Silent Whole-Document Regeneration (The model rewrites the entire text, losing subtle nuances and prior approvals)",
        "sovereign_question": "Did this revision preserve the exact words that were not marked for change?",
        "lead_contractors": [
            {
                "num": "035",
                "role": "'Littera Scripta' Written Re-Engineering Protocol",
                "defect": "Reckless rewriting that destroys authorial voice, cadence, and established facts.",
                "work_order": "Treats written text as an immutable architectural monument: mandates surgical, non-destructive line edits and preserves 95%+ of original prose."
            },
            {
                "num": "004",
                "role": "Alex Lyon 'Concise & Unshakeable' Redactor",
                "defect": "Bloated academic throat-clearing, redundant filler, and syntactic flab.",
                "work_order": "Cuts 30-40% of unnecessary syllables without altering core conceptual claims; turns flabby paragraphs into punchy declarative propositions."
            },
            {
                "num": "039",
                "role": "Dry-Stone Discourse Masonry",
                "defect": "Shaky paragraph transitions and loose conceptual coherence.",
                "work_order": "Fits sentences together like dry-stack fieldstones: ensures each sentence rests with gravitational stability upon the sentence preceding it."
            },
            {
                "num": "099",
                "role": "Hannes Bajohr Algorithmic Assembler",
                "defect": "Inconsistent stylistic register and tone drift across long revisions.",
                "work_order": "Enforces combinatorial line-level constraints and stylistic heuristics, preserving stylistic homogeneity across document sections."
            },
            {
                "num": "112",
                "role": "Ernest Hemingway Iceberg Structural Engine",
                "defect": "Over-explaining obvious points and smothering reader imagination.",
                "work_order": "Enforces radical omission: strips emotional adjectives and explicit moralizing, allowing substantive facts to generate subterranean resonance."
            }
        ],
        "auxiliary_contractors": ["020", "021", "026", "058", "082", "092"]
    },
    "11": {
        "num": "11",
        "name": "CONSTRAINT",
        "roman": "XI",
        "latin": "Limes et Invariantia",
        "subtitle": "Negative Capability, Montanari Constraint Networks, and Hard Invariants",
        "formula": "R = f(u, c, g_{constraint}) \\quad \\text{where } \\forall \\text{ output } o, \\; \\mathcal{C}(o) = \\text{True}",
        "human_role": "Lawgiver / Invariant Designer",
        "machine_role": "Constrained Decoder / Rejection Filter",
        "valid_move": "Proscription / Boundary Condition / Negative Rule",
        "success_condition": "Prohibited states are strictly unreachable; valid space is precisely delineated.",
        "fatal_trap": "'Should Not' vs 'Cannot' (Confusing polite linguistic requests with mathematically hard structural boundaries)",
        "sovereign_question": "Is this constraint mathematically impossible to violate, or is it merely asking the model to behave?",
        "lead_contractors": [
            {
                "num": "047",
                "role": "Wendell Berry Agrarian Limit & Topsoil Invariant",
                "defect": "Promethean extractive expansion ignoring physical, ecological, and ethical boundaries.",
                "work_order": "Imposes hard ecological and ethical limits: forbids endless growth narratives, grounding system output in frugality and physical boundary limits."
            },
            {
                "num": "049",
                "role": "'Standing by Words' Literal Defense",
                "defect": "Semantic evasion and euphemistic language that avoids accountability.",
                "work_order": "Enforces strict literal truth and semantic fidelity: words must stand for real things, and commitments must be fulfilled to the letter."
            },
            {
                "num": "057",
                "role": "Stafford Beer Cybernetic Homeostat",
                "defect": "Unchecked runaway states and catastrophic system collapse.",
                "work_order": "Implements the Viable System Model (VSM): establishes homeostatic negative feedback loops to contain system variables within safe operating bands."
            },
            {
                "num": "109",
                "role": "Ivan Sutherland Sketchpad Geometric Constraint Solver",
                "defect": "Spatial warping, loose tolerances, and geometric contradictions.",
                "work_order": "Enforces rigorous topological and geometric constraint networks: lines remain parallel, joints remain locked, and invariants survive user manipulation."
            },
            {
                "num": "136",
                "role": "Watson Hartsoe Structural Sovereignty Engine",
                "defect": "Submitting to rhetorical illusions, simulated agency, and ungrounded computational hubris.",
                "work_order": "Holds computational systems to the highest humanistic standard: externalizes state, preserves agency, and enforces absolute epistemic sovereignty."
            }
        ],
        "auxiliary_contractors": ["019", "042", "056", "069", "078", "096"]
    },
    "12": {
        "num": "12",
        "name": "PERFORMANCE",
        "roman": "XII",
        "latin": "Actio coram Testibus",
        "subtitle": "Live Algorithmic Execution, TOPLAP Transparency, and Public Risk",
        "formula": "R = f(u, c, g_{performance}) \\quad \\text{where } t \\text{ is live} \\wedge \\text{Audience} = \\text{Witness}",
        "human_role": "Live Performer / Improviser",
        "machine_role": "Responsive Runtime Instrument",
        "valid_move": "Timed Live Inscription / Public Execution",
        "success_condition": "The act is witnessed in real time with genuine operational risk and zero post-hoc editing.",
        "fatal_trap": "Consequence-Free Rehearsal (Simulating live risk while secretly executing pre-rendered recordings)",
        "sovereign_question": "What real-world consequence or public reputation is on the line right now?",
        "lead_contractors": [
            {
                "num": "025",
                "role": "Academic Keynote & Live Defense Tour Director",
                "defect": "Stage fright, academic mumbling, and disconnected podium delivery.",
                "work_order": "Orchestrates high-stakes live intellectual performances: commands the physical room, manages audience tension, and lands decisive theoretical punches."
            },
            {
                "num": "038",
                "role": "Bolt 24-Hour Live Sprint Engine",
                "defect": "Endless perfectionist procrastination and paralysis under pressure.",
                "work_order": "Imposes relentless, unstoppable forward momentum: executes high-volume intellectual output under intense, public, non-negotiable deadlines."
            },
            {
                "num": "072",
                "role": "Jay David Bolter Media-Archaeological Remediation",
                "defect": "Hiding the apparatus behind illusionistic transparency; pretending computation is immaterial.",
                "work_order": "Exposes the historical and material apparatus on stage: remediates older media forms into the live computational screen."
            },
            {
                "num": "089",
                "role": "Trey Parker & Matt Stone Kinetic Satirical Engine",
                "defect": "Ponderous, solemn academic self-importance that bores the room.",
                "work_order": "Propels the live performance through high-velocity 'THEREFORE / BUT' causal storytelling, puncturing pretension with ruthless intellectual wit."
            },
            {
                "num": "132",
                "role": "Johan Huizinga 'Homo Ludens' Magic Circle Inscriber",
                "defect": "Drab utilitarian work-to-rule execution devoid of play and aesthetic delight.",
                "work_order": "Consecrates the live event space as a sacred magic circle of play: elevates live coding and intellectual defense into an unforgettable cultural ritual."
            }
        ],
        "auxiliary_contractors": ["027", "031", "068", "084", "091", "115"]
    }
}

# HTML Template for Standalone Thought Essay Container + Keynote Slides
def build_game_page(num):
    meta = GAME_METADATA[num]
    
    # Read game markdown file
    md_path = f"WAYS TO WRITE/language_games/{num}_{meta['name'].lower()}.md"
    if not os.path.exists(md_path):
        print(f"Error: {md_path} does not exist!")
        return
    with open(md_path, 'r') as f:
        raw_md = f.read()
    
    # Parse markdown sections
    # Clean headings
    html_body = markdown.markdown(raw_md, extensions=['extra', 'codehilite', 'tables'])

    # Build Contractor Cards HTML
    lead_cards_html = ""
    for c in meta['lead_contractors']:
        p_data = PROMPTS_DICT.get(c['num'], {'title': 'System Instruction Prompt', 'body': 'Operational protocol.'})
        # Format excerpt (first 650 characters of prompt body)
        raw_prompt_body = p_data['body']
        prompt_excerpt = raw_prompt_body[:650] + "..." if len(raw_prompt_body) > 650 else raw_prompt_body
        # Escape HTML in excerpt
        prompt_excerpt_escaped = prompt_excerpt.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
        full_body_escaped = raw_prompt_body.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;').replace('\n', '\\n').replace('"', '\\"')

        lead_cards_html += f"""
        <div class="contractor-dossier-card">
          <div class="contractor-header">
            <div class="contractor-num-badge">CONTRACTOR // PROMPT {c['num']}</div>
            <div class="contractor-specialty">{c['role']}</div>
          </div>
          <h3 class="contractor-title">{p_data['title']}</h3>
          <div class="contractor-spec-block">
            <span class="spec-label">ARCHITECTURAL VULNERABILITY TARGETED:</span>
            <span class="spec-value defect">{c['defect']}</span>
          </div>
          <div class="contractor-spec-block">
            <span class="spec-label">SCOPE OF WORK &amp; REMEDIATION ORDER:</span>
            <span class="spec-value">{c['work_order']}</span>
          </div>
          
          <!-- VERBATIM DIRECTIVES CODE BLOCK -->
          <div class="directive-box">
            <div class="directive-header">
              <span>OPERATIONAL PROMPT PROTOCOL DIRECTIVES (EXCERPT)</span>
              <button class="btn-copy-sm" onclick="copyPromptDirectives('{c['num']}')">📋 COPY FULL DIRECTIVE</button>
            </div>
            <pre class="directive-code"><code>{prompt_excerpt_escaped}</code></pre>
          </div>
        </div>
        """

    # Auxiliary list HTML
    aux_list_html = ""
    for aux_num in meta['auxiliary_contractors']:
        aux_data = PROMPTS_DICT.get(aux_num, {'title': 'Prompt'})
        aux_list_html += f"""
        <li class="aux-item">
          <span class="aux-badge">PROMPT {aux_num}</span>
          <span class="aux-title">{aux_data['title']}</span>
        </li>
        """

    # Precalculate next game url
    next_idx = int(meta["num"]) + 1
    if next_idx <= 12:
        next_num_str = f"{next_idx:02d}"
        next_game_url = f"{next_num_str}_{GAME_METADATA[next_num_str]['name'].lower()}.html"
    else:
        next_game_url = "deep_play_at_the_aperture.html"

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
          <span class="slide-c-num">P-{meta['lead_contractors'][0]['num']}</span>
          <strong>{PROMPTS_DICT.get(meta['lead_contractors'][0]['num'], {}).get('title', '')[:45]}</strong>: {meta['lead_contractors'][0]['role']}
        </div>
        <div class="slide-c-item">
          <span class="slide-c-num">P-{meta['lead_contractors'][1]['num']}</span>
          <strong>{PROMPTS_DICT.get(meta['lead_contractors'][1]['num'], {}).get('title', '')[:45]}</strong>: {meta['lead_contractors'][1]['role']}
        </div>
        <div class="slide-c-item">
          <span class="slide-c-num">P-{meta['lead_contractors'][2]['num']}</span>
          <strong>{PROMPTS_DICT.get(meta['lead_contractors'][2]['num'], {}).get('title', '')[:45]}</strong>: {meta['lead_contractors'][2]['role']}
        </div>
      </div>
    </div>

    <!-- SLIDE 5: LEAD CONTRACTOR 1 -->
    <div class="slide" data-slide="5">
      <div class="slide-badge">LEAD CONTRACTOR // PROMPT {meta['lead_contractors'][0]['num']}</div>
      <h2 class="slide-title">{PROMPTS_DICT.get(meta['lead_contractors'][0]['num'], {}).get('title', '')[:50]}</h2>
      <div class="slide-panel">
        <p><strong>Defect Remediated:</strong> {meta['lead_contractors'][0]['defect']}</p>
        <p><strong>Operative Work Order:</strong> {meta['lead_contractors'][0]['work_order']}</p>
      </div>
    </div>

    <!-- SLIDE 6: LEAD CONTRACTOR 2 -->
    <div class="slide" data-slide="6">
      <div class="slide-badge">LEAD CONTRACTOR // PROMPT {meta['lead_contractors'][1]['num']}</div>
      <h2 class="slide-title">{PROMPTS_DICT.get(meta['lead_contractors'][1]['num'], {}).get('title', '')[:50]}</h2>
      <div class="slide-panel">
        <p><strong>Defect Remediated:</strong> {meta['lead_contractors'][1]['defect']}</p>
        <p><strong>Operative Work Order:</strong> {meta['lead_contractors'][1]['work_order']}</p>
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
        <button class="btn-action highlight" onclick="togglePresentationMode()">📖 RETURN TO ESSAY CONTAINER</button>
        <a href="{next_game_url}" class="btn-action">NEXT GAME &rarr;</a>
      </div>
    </div>
    """

    # Dropdown options
    dropdown_options = ""
    for i in range(1, 13):
        n_str = f"{i:02d}"
        g_meta = GAME_METADATA[n_str]
        g_name = g_meta['name']
        g_lower = g_name.lower()
        dropdown_options += f'<a href="{n_str}_{g_lower}.html">{n_str} // {g_name}</a>\n'

    # Prompt copy dictionary pre-serialized to JSON
    import json
    prompts_store_dict = {c["num"]: PROMPTS_DICT.get(c["num"], {}).get("body", "") for c in meta['lead_contractors']}
    prompts_store_json = json.dumps(prompts_store_dict)

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
    .prose-section {{
      margin-bottom: 60px;
    }}
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
      padding: 14px;
      font-family: var(--mono);
      font-size: 12.5px;
      line-height: 1.55;
      color: #e8dfcf;
      overflow-x: auto;
      max-height: 240px;
    }}

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
      <a href="deep_play_at_the_aperture.html" class="btn-action">&larr; FULL MONOGRAPH</a>
      <button class="btn-action highlight" onclick="togglePresentationMode()">&#127916; KEYNOTE SLIDES (16:9)</button>
      <div class="dropdown">
        <button class="btn-action">SWITCH GAME &#9662;</button>
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

    <!-- PROSE SECTIONS (UNABRIDGED FROM BUILDERS-GAMES) -->
    <article class="prose-section">
      {html_body}
    </article>

    <!-- CONTRACTOR GUILD DOSSIER BLOCK -->
    <section class="contractor-guild-block">
      <div class="guild-badge-row">
        <h2 class="guild-title">The Contractor Guild &amp; Specialized Work Orders</h2>
        <span class="guild-count">5 PRIMARY CONTRACTORS HIRED</span>
      </div>
      <p style="font-size:16px; margin-bottom:28px; color:var(--ink-soft);">
        Each language game possesses specific structural vulnerabilities that cause foundation models to drift, launder meaning, or execute unauthorized operations. The following specialized system instructions from the 136-prompt canon have been contracted to enforce architectural invariants for <strong>Game {meta['num']} ({meta['name']})</strong>:
      </p>

      <!-- PRIMARY CONTRACTOR CARDS -->
      {lead_cards_html}

      <!-- AUXILIARY BRIGADE REGISTRY -->
      <div class="aux-brigade-section">
        <div class="aux-title-heading">Complementary Contractors Assigned to this Game from the 136 Canon</div>
        <ul class="aux-list">
          {aux_list_html}
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
      <button class="pres-exit-btn" onclick="togglePresentationMode()">&#10005; EXIT TO ESSAY</button>
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
  <div id="toast">Directive copied to clipboard!</div>

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

    // Prompt copy dictionary
    const PROMPTS_STORE = {prompts_store_json};

    function copyPromptDirectives(pNum) {{
      const text = PROMPTS_STORE[pNum] || "Directive text unavailable.";
      navigator.clipboard.writeText(text).then(() => {{
        const toast = document.getElementById('toast');
        toast.innerText = `Contractor Prompt ${{pNum}} directives copied!`;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
      }});
    }}
  </script>
</body>
</html>
"""
    
    # Save standalone file in root
    filename_root = f"{num}_{meta['name'].lower()}.html"
    with open(filename_root, 'w') as f:
        f.write(full_html)
    print(f"Generated {filename_root} in root")

    # Mirror in WAYS TO WRITE/language_games/
    filename_mirror = f"WAYS TO WRITE/language_games/{num}_{meta['name'].lower()}.html"
    with open(filename_mirror, 'w') as f:
        f.write(full_html)

    # Also overwrite the old _yellow_pages.html alias with this new thought essay container
    filename_alias = f"WAYS TO WRITE/language_games/{num}_{meta['name'].lower()}_yellow_pages.html"
    with open(filename_alias, 'w') as f:
        f.write(full_html)

# Build all 12 games
for i in range(1, 13):
    num_str = f"{i:02d}"
    build_game_page(num_str)

print("All 12 Language Game Thought Essay Containers generated successfully!")
