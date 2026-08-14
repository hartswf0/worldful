import os
import glob
import re
from pathlib import Path

# Metadata dictionary providing pragmatic summaries, real-world parallels, key terms, and core purposes for each world
PRAGMATIC_METADATA = {
    0: {
        "title": "THE CROSSING",
        "core_purpose": "Understanding how absent causes and historical events continue to exert physical force through surviving traces.",
        "human_question": "How do we coordinate our actions around things that happened in the past or far away without having to experience them directly?",
        "rule_of_thumb": "Every description is an extreme compression: it survives by leaving 99% of reality behind. The danger begins when we forget what was cut.",
        "real_world_parallels": [
            "**Software Logs & Audits:** An error log redirects an engineer's debugging efforts long after the crash occurred.",
            "**AI Prompts:** A short natural language prompt triggers complex neural activations without containing any of the actual weights or pixels.",
            "**Institutional Law:** Written statutes written centuries ago by dead legislators still lock physical prison doors today."
        ],
        "key_terms": {
            "Portable Consequence": "The ability of an absent event or object to alter living behavior across space and time via a compact sign.",
            "Lossy Cut": "The necessary reduction of an infinite physical reality into a manageable, communicable signal.",
            "Trace Authority": "The trust placed in a surviving artifact (footprint, log, contract) to stand in for an unobserved reality."
        },
        "traps": "Treating the surviving trace as if it contains the full reality of the source, ignoring environmental conditions that were omitted."
    },
    1: {
        "title": "THE KINGDOM OF TURNED HEADS",
        "core_purpose": "Analyzing deixis and joint attention as the fundamental starting point of all communication and social power.",
        "human_question": "Who controls what we look at, and how does directing attention create reality before any words are spoken?",
        "rule_of_thumb": "Whoever controls public salience controls public reality. The first battle is never what things mean, but what people look at.",
        "real_world_parallels": [
            "**UI/UX Design:** Notifications, red badges, and visual hierarchy directing user eye-lines before they read any copy.",
            "**Algorithmic Feeds:** Recommender systems determining public discourse by setting the salience agenda.",
            "**Leadership & Management:** Directing a team's focus to specific KPIs, which automatically deprioritizes unmeasured work."
        ],
        "key_terms": {
            "Deixis": "The act of pointing or indexing attention toward an external referent.",
            "Salience Monopoly": "Power gained by having exclusive authority to dictate what others notice.",
            "Pre-semantic Orientation": "The physical turning of the head or eyes before cognitive interpretation begins."
        },
        "traps": "Mistaking the finger for the fire—focusing endlessly on the spectacle of the sign while losing track of the underlying event."
    },
    2: {
        "title": "THE HOUSE WHOSE ROAD DISAPPEARED",
        "core_purpose": "Diagnosing legacy technical debt, doctrinal residue, and obsolete structures that outlive their original purpose.",
        "human_question": "Why do we keep maintaining cumbersome rules, APIs, and habits when the original problem they solved is long gone?",
        "rule_of_thumb": "What feels 'natural' or 'sacred' is often just an ancient workaround whose original environment has vanished.",
        "real_world_parallels": [
            "**Legacy Codebases:** Maintaining backwards compatibility hacks for browsers or operating systems that no longer exist.",
            "**Corporate Bureaucracy:** Filling out multi-signature approval forms originally designed to prevent a 1980s accounting error.",
            "**Urban Architecture:** Streets sized for horse-drawn carriages constraining modern transit infrastructure."
        ],
        "key_terms": {
            "Heritage Technical Debt": "The ongoing maintenance cost of inherited structures whose original rationale is obsolete.",
            "Path Dependence": "The inability to adopt a superior current solution because of sunk investments in historical layouts.",
            "Doctrinal Residue": "Rules that persist as authoritative dogma after their functional necessity has expired."
        },
        "traps": "Assuming that because a rule or structure is old, it must be wise, rather than simply expensive to remove."
    },
    3: {
        "title": "THE ARCHIPELAGO OF BORROWED MONSTERS",
        "core_purpose": "Tracing horizontal cultural transfer, story mutation, and the myth of pure origins.",
        "human_question": "How do ideas, stories, and technologies mutate as they travel between cultures, and why do we falsely crave pure lineages?",
        "rule_of_thumb": "Cultures and codebases do not descend cleanly; they leak sideways. A borrowed myth doesn't need an authentic pedigree to produce real effects.",
        "real_world_parallels": [
            "**Open Source Software:** Forking libraries, modifying them for local needs, and gradually forgetting the original upstream context.",
            "**Religious & Folklore Syncretism:** Holiday traditions and myths borrowed from neighboring civilizations and rebranded as indigenous.",
            "**Design Patterns:** Taking architectural patterns from civil engineering or physics and adapting them into software."
        ],
        "key_terms": {
            "Horizontal Transfer": "The sideways borrowing and mutation of concepts across distinct domains or cultures.",
            "Authenticity Laundering": "Claiming an imported or hybrid practice is an ancient, pure domestic tradition to gain moral authority.",
            "Reticulation": "A network-like evolutionary history of cross-pollination rather than a clean hierarchical tree."
        },
        "traps": "Wasting resources hunting for an imaginary 'pure original' instead of examining how the current variant actually functions."
    },
    4: {
        "title": "THE VALLEY WHERE DANGERS ARRIVE EARLY",
        "core_purpose": "Exploring pre-enactment, simulation, and fiction as low-cost survival and rehearsal technologies.",
        "human_question": "How do humans prepare for catastrophic risks before experiencing them in the flesh?",
        "rule_of_thumb": "Fiction is not a decorative lie; it is a rehearsal chamber that loosens real consequences so bodies can train for dangerous futures.",
        "real_world_parallels": [
            "**Disaster Simulations & Red Teaming:** Running cyberattack drills or fire simulations to train reflexes before an actual breach.",
            "**Aviation Flight Simulators:** Allowing pilots to crash ten thousand virtual airplanes to prevent a single real crash.",
            "**Storytelling & Literature:** Childhood fables instilling deep cautionary instincts regarding strangers, dark forests, and poisons."
        ],
        "key_terms": {
            "Pre-enactment": "Simulating a future hazard in safe conditions to prime cognitive and physical reflexes.",
            "Consequence Loosening": "Temporarily decoupling an action from its fatal real-world stakes during play or training.",
            "Synthetic Preparedness": "Building genuine competence through exposure to artificial scenarios."
        },
        "traps": "Confusing the rehearsal with reality, or becoming paralyzed by endless catastrophic scenarios that never occur."
    },
    5: {
        "title": "THE REPUBLIC OF WOODEN KINGS",
        "core_purpose": "Understanding the 'Counts-As' rule, jurisdictional transformations, and institutional reality.",
        "human_question": "How do ordinary physical objects (pieces of paper, chunks of wood, digital bits) become money, kings, property, or evidence?",
        "rule_of_thumb": "Meaning does not sit inside the physical object; it appears in the choreographies and rules that govern what people do after touching it.",
        "real_world_parallels": [
            "**Fiat Currency & Crypto:** A dollar bill or digital token has value only because institutional rules dictate its acceptance for debts.",
            "**Software Objects & Types:** An integer counts as a memory address, a user ID, or a monetary balance depending on the type system.",
            "**Legal Evidence:** A bloody knife is ordinary metal until an authorized court admits it under the rules of evidence."
        ],
        "key_terms": {
            "Counts-As Rule (Searle)": "The formula 'X counts as Y in Context C' which creates institutional reality.",
            "Ontological Licensing": "The social or systemic permission that allows an ordinary item to function as an authoritative token.",
            "Jurisdictional Identity": "An object's status defined by the active rule system rather than its intrinsic physical material."
        },
        "traps": "Believing the token itself possesses magical power, rather than the collective social contract that upholds it."
    },
    6: {
        "title": "THE PALACE OF THE PERFECT CAMERA",
        "core_purpose": "Exposing the limits of high-resolution surveillance and thin observational capture versus social context.",
        "human_question": "Why does collecting more data and higher-resolution video fail to explain why people do what they do?",
        "rule_of_thumb": "A terabyte can record the exact twitch of an eyelid and still miss whether it was a spasm, a wink, a secret signal, or a mocking insult.",
        "real_world_parallels": [
            "**Big Data Analytics:** Storing millions of user clickstreams without understanding user intent, frustration, or life context.",
            "**Surveillance & Telemetry:** Monitoring keystrokes and webcam presence while completely failing to measure actual developer productivity.",
            "**Autonomous Vehicles:** Cameras capturing pixel-level scene geometries while struggling with subtle pedestrian social cues."
        ],
        "key_terms": {
            "Thin Capture": "High-fidelity physical recording that omits social, historical, and interpersonal context.",
            "Resolutionism": "The false belief that increasing data density or pixel count automatically yields semantic understanding.",
            "Hermeneutic Gap": "The distance between what can be physically measured and what the action means."
        },
        "traps": "Investing in more surveillance sensors when the real failure is an inability to interpret context and conventions."
    },
    7: {
        "title": "THE CITY OF REQUIRED FIELDS",
        "core_purpose": "Analyzing administrative ontology, database schemas, and how form fields dictate what can exist in the eyes of power.",
        "human_question": "How do database schemas, standardized forms, and bureaucratic categories quietly govern human lives?",
        "rule_of_thumb": "A schema is a politics of attention disguised as furniture. What cannot fit into an approved field loses its route into institutional consequence.",
        "real_world_parallels": [
            "**Electronic Health Records:** Doctors forced to categorize complex, ambiguous human suffering into rigid billing ICD-10 codes.",
            "**Immigration & Visa Forms:** Forcing non-traditional family structures or fluid identities into binary check-boxes.",
            "**Database Migrations:** Schema constraints that discard nuanced user feedback as 'unstructured noise'."
        ],
        "key_terms": {
            "Formulary Sovereignty": "The power held by whoever decides which fields are mandatory, optional, or prohibited.",
            "Administrative Cannibalism": "Institutions reorganizing the real world to match their database schemas rather than the reverse.",
            "Unstructured Residue": "Vital aspects of human reality that are ignored because they do not fit into standardized input fields."
        },
        "traps": "Assuming that because a field is blank or absent from a database, the underlying human need does not exist."
    },
    8: {
        "title": "THE MARSH OF ENFORCED LINES",
        "core_purpose": "Understanding the violence of artificial borders and geometric imposition on continuous natural landscapes.",
        "human_question": "How do arbitrary lines drawn on paper harden into violent physical borders across living terrain?",
        "rule_of_thumb": "Nature does not have straight lines, but a boundary becomes real the moment institutions begin punishing bodies for crossing it.",
        "real_world_parallels": [
            "**Colonial Borders:** Straight lines drawn with rulers across Africa and the Middle East slicing through historic communities.",
            "**Software Microservice Boundaries:** Arbitrary domain boundaries that cause massive network latency and organizational friction.",
            "**Zoning Laws:** Rigid municipal boundaries separating residential and commercial zones regardless of neighborhood flow."
        ],
        "key_terms": {
            "Cartographic Leviathan": "The institutional force required to compel a shifting physical world to obey static drawn lines.",
            "Enforced Discontinuity": "Creating an artificial binary division in what is naturally a gradient or continuous spectrum.",
            "Surveyor's Hubris": "Believing the map's geometry is more legitimate than the landscape's lived geography."
        },
        "traps": "Fighting endless border wars to maintain an arbitrary line that nature continuously washes away."
    },
    9: {
        "title": "THE TWO GRIEFS",
        "core_purpose": "Exploring the incommensurability of private subjective experience and standardized public categories.",
        "human_question": "Why does translation between languages or between personal pain and official language always fail or leave scars?",
        "rule_of_thumb": "Translation is never an identical transfer of contents; it is reconstruction under unequal gravity. Every shared category leaves private grief behind.",
        "real_world_parallels": [
            "**Legal Compensation for Loss:** Translating the unique loss of a loved one into a standardized monetary settlement.",
            "**Cross-Cultural Localization:** Translating culturally embedded idioms into foreign marketing copy where they lose their soul.",
            "**Standardized Testing:** Reducing unique student creativity and intuition into a single percentile score."
        ],
        "key_terms": {
            "Semantic Annexation": "Forcing an intimate or foreign concept into a standard domestic category, erasing its nuance.",
            "Inequal Gravity": "The asymmetry between a dominant language/system and the marginalized nuance it attempts to absorb.",
            "Residual Incommensurability": "The irreducible remainder that refuses to translate into public tokens."
        },
        "traps": "Believing a translation or standard metric was 100% loss-free, ignoring the resentment of what was erased."
    },
    10: {
        "title": "THE COMMON BIRD",
        "core_purpose": "Examining cognitive prototypes, generic naming, and the secret social pacts that enable coordination.",
        "human_question": "How do people coordinate around generic words like 'bird' or 'house' when everyone pictures something slightly different?",
        "rule_of_thumb": "Language works not because our mental images match, but because we agree to ignore our differences long enough to get work done.",
        "real_world_parallels": [
            "**Interface Design & Protocols:** Two microservices communicating via JSON contracts without needing identical internal architectures.",
            "**Legal Contracts:** Business partners agreeing on 'good faith efforts' without having identical philosophies of morality.",
            "**Design Systems:** A 'Button' component that looks acceptable across 50 distinct screens without perfectly fitting any single one."
        ],
        "key_terms": {
            "Coordinative Equivalence": "Treating different internal mental models as identical for the pragmatic purpose of completing a task.",
            "Prototype Flattening": "Using a generic archetype (a robin) to represent an entire sprawling biological class.",
            "Alignment Theater": "Pretending full consensus exists when in reality only a functional tolerance threshold was met."
        },
        "traps": "Demanding 100% philosophical agreement before allowing practical collaboration to proceed."
    },
    11: {
        "title": "THE COURT OF SHARDS",
        "core_purpose": "Investigating archaeological reconstruction, narrative fabrication from fragmentary evidence, and confirmation bias.",
        "human_question": "How do we reconstruct an entire past from broken pieces without projecting our own desires onto the gaps?",
        "rule_of_thumb": "When evidence is fragmentary, the story you build says more about the storyteller's glue than the original vase.",
        "real_world_parallels": [
            "**Post-Mortem Root Cause Analysis:** Piecing together scattered server metrics to create a clean retrospective story of a failure.",
            "**Criminal Justice & Forensics:** Convicting suspects based on circumstantial physical fragments stitched together by prosecutors.",
            "**Historical Narratives:** Writing national histories based on the 1% of ancient documents that happened not to rot."
        ],
        "key_terms": {
            "Hermeneutic Glue": "The narrative assumptions used to connect isolated pieces of evidence into a coherent story.",
            "Fragment Inflation": "Over-interpreting a surviving piece of debris as proof of an entire grand system.",
            "Epistemic Restraint": "The discipline of admitting where the evidence ends and speculation begins."
        },
        "traps": "Falling in love with a beautiful, coherent retrospective story that completely misrepresents the messy truth."
    },
    12: {
        "title": "THE INVISIBLE TOOL COUNTRY",
        "core_purpose": "Exploring Heideggerian tool-readiness, transparency of media, and the sudden shock of system breakdown.",
        "human_question": "Why do tools and infrastructure disappear from our awareness until the exact moment they stop working?",
        "rule_of_thumb": "A good tool is invisible; you look *through* it at your goal. A broken tool suddenly forces you to look *at* the tool itself.",
        "real_world_parallels": [
            "**Cloud Infrastructure & Power Grids:** Nobody thinks about AWS servers or electricity until the power goes out.",
            "**Keyboard & Mouse:** When typing fluidly, the hands disappear; when a key sticks, the entire illusion of direct thought collapses.",
            "**Supply Chains:** Global shipping containers operating invisibly until a single ship blocks the Suez Canal."
        ],
        "key_terms": {
            "Ready-to-Hand (Zuhandenheit)": "The transparent state of a tool when it is working smoothly and absorbed into action.",
            "Present-at-Hand (Vorhandenheit)": "The jarring state when a tool breaks and becomes an opaque physical obstacle.",
            "Infrastructural Invisibility": "The tendency of mature operational systems to become cognitively invisible to their users."
        },
        "traps": "Starving infrastructure of maintenance budget simply because it is running quietly and invisibly."
    },
    13: {
        "title": "THE GIANT STATE",
        "core_purpose": "Analyzing the scaling laws of organization, bureaucratic latency, and the loss of bodily presence at scale.",
        "human_question": "What happens to empathy, speed, and accuracy when an organization grows too large for human senses to span?",
        "rule_of_thumb": "As a system scales, direct bodily reality is replaced by paperwork, telemetry, and hierarchy. Speed turns into inertia.",
        "real_world_parallels": [
            "**Mega-Corporations:** Executives making decisions based on spreadsheet summaries that are 6 months out of date.",
            "**Distributed Microservices:** Network hop latency and distributed transaction failures crippling system responsiveness.",
            "**Government Ministries:** Citizens experiencing life-and-death delays while memos travel through 14 approval layers."
        ],
        "key_terms": {
            "Bureaucratic Latency": "The time delay between an external event on the ground and an institutional reaction at the top.",
            "Sensory Decoupling": "Decision-makers insulated from the physical pain or consequences of their policies.",
            "Scale-Induced Inertia": "The inability of massive systems to change course due to the momentum of their own rules."
        },
        "traps": "Believing a giant enterprise can operate with the agile intimacy of a 5-person team without structural decoupling."
    },
    14: {
        "title": "THE ELEVATOR SCHOOL OF AUTHORSHIP",
        "core_purpose": "Deconstructing compression, elevator pitches, executive summaries, and the mutilation of complex thought.",
        "human_question": "What essential truths are murdered when we force every complex idea into a 30-second pitch or 3-bullet slide?",
        "rule_of_thumb": "Compression makes ideas portable, but hyper-compression strips out the boundary conditions that make the idea safe.",
        "real_world_parallels": [
            "**Startup Pitch Decks:** Promising miraculous market domination while omitting all the brutal unit-economic friction.",
            "**Executive Summaries:** Boiling a 100-page engineering risk analysis into a green dashboard square that hides impending disaster.",
            "**Social Media Headlines:** Sensationalizing nuanced scientific studies into viral 280-character soundbites."
        ],
        "key_terms": {
            "Lossy Seduction": "The persuasive appeal of a simplified soundbite that conceals hazardous missing details.",
            "Boundary Stripping": "Removing the caveats, limits, and edge cases to make a claim sound universal.",
            "Executive Mutilation": "Destroying the internal coherence of a proposal to fit arbitrary briefing formats."
        },
        "traps": "Investing in a project based on the elegance of its summary rather than the resilience of its messy details."
    },
    15: {
        "title": "THE CITY OF UNMEASURED ADJECTIVES",
        "core_purpose": "Exploring the resistance of qualitative human values against tyrannical quantification and KPI gamification.",
        "human_question": "What happens to beauty, generosity, honor, and joy when institutions only reward what can be numerically scored?",
        "rule_of_thumb": "Goodhart's Law: When a measure becomes a target, it ceases to be a good measure. Unmeasurable qualities wither under metrics.",
        "real_world_parallels": [
            "**Customer Support Metrics:** Agents rushing callers off the phone to hit Average Handle Time quotas, ruining customer satisfaction.",
            "**Academic Publishing:** Professors churning out low-quality papers to game citation indices and publication counts.",
            "**Software Quality:** Developers writing useless unit tests to achieve 100% line coverage without testing real edge cases."
        ],
        "key_terms": {
            "Metric Gaming": "Optimizing behavior to satisfy a quantitative score while destroying the qualitative goal.",
            "Qualitative Erasure": "The systematic neglect of vital cultural or emotional factors because they resist numerical measurement.",
            "Goodhart's Horizon": "The point where metric enforcement actively inverts the original institutional mission."
        },
        "traps": "Assuming that if you cannot measure something in a spreadsheet, it has zero impact on your organization's survival."
    },
    16: {
        "title": "THE ARCHIVE WITHOUT CONTEXT",
        "core_purpose": "Analyzing naked records, decontextualized data storage, and the danger of ungrounded information retrieval.",
        "human_question": "Why is a database of facts dangerous when stripped of who recorded them, why, and under what pressures?",
        "rule_of_thumb": "Data without provenance is a weapon waiting for a random hand. A record preserves what was written, not what it meant.",
        "real_world_parallels": [
            "**Out-of-Context Social Media Clips:** Reviving a 10-year-old snippet of speech to destroy a reputation without knowing the situation.",
            "**LLM Pre-training Data:** Models ingesting vast text scrapings containing irony, sarcasm, and falsehoods as literal factual truth.",
            "**Police Dossiers:** Storing arrest logs without recording subsequent acquittals or corrupt officer records."
        ],
        "key_terms": {
            "Dossier Governance": "Controlling human lives using historical records that individuals cannot inspect or correct.",
            "Provenance Stripping": "Severing an information artifact from its author, intent, social setting, and revision history.",
            "Naked Facticity": "The dangerous illusion that raw recorded data speaks for itself without interpretation."
        },
        "traps": "Trusting an old database record as absolute truth without verifying who wrote it and what axe they had to grind."
    },
    17: {
        "title": "THE HIVE OF FORBIDDEN WORDS",
        "core_purpose": "Examining censorship, taboo, linguistic evasion, and the subterranean migration of meaning around prohibitions.",
        "human_question": "Why does banning a word or topic fail to kill the idea and instead make society more paranoid and devious?",
        "rule_of_thumb": "Banning a word never destroys the thought; it simply charges a tax on speech, forcing meaning to migrate into code words and gestures.",
        "real_world_parallels": [
            "**Algorithmic Censorship (Algospoke):** TikTok users saying 'unalive' or 'le$$bian' to evade automated shadowbanning filters.",
            "**Soviet Euphemisms:** Dissidents using literary metaphors and historical allegories to criticize authoritarian regimes.",
            "**Corporate Politics:** Teams using passive-aggressive phrases like 'let's take this offline' to avoid documenting toxic conflict."
        ],
        "key_terms": {
            "Subterranean Migration": "The movement of forbidden concepts into acceptable slang, homophones, or visual puns.",
            "Taboo Friction": "The cognitive and social cost imposed on communication by official speech prohibitions.",
            "Algospoke": "Dialects created specifically to communicate across automated surveillance filters."
        },
        "traps": "Believing that because a forbidden term has vanished from official transcripts, the underlying conflict is resolved."
    },
    18: {
        "title": "THE COUNTRY OF NEGATIVE ANIMALS",
        "core_purpose": "Exploring apophasis, boundary definitions, and characterizing complex systems by what they are *not*.",
        "human_question": "How do we describe realities that exceed our vocabulary except by listing everything they exclude?",
        "rule_of_thumb": "When an entity is too large, subtle, or complex for direct nouns, sculpting its negative space is the only honest description.",
        "real_world_parallels": [
            "**Negative Architecture / API Specifications:** Defining what an API endpoint must *never* do (security invariants) rather than all allowed states.",
            "**Apophatic Theology & Philosophy:** Defining the divine or absolute reality strictly through negation (neti neti, 'not this, not that').",
            "**Machine Learning Decision Boundaries:** Classifying high-dimensional spaces by learning the hyperplanes that separate classes."
        ],
        "key_terms": {
            "Apophasis": "Describing something by stating what it is not, carving out reality through negation.",
            "Negative Space Modeling": "Understanding a complex system by examining its constraints, taboos, and failure boundaries.",
            "Boundary Sculpting": "Defining identity through limits rather than positive substance."
        },
        "traps": "Becoming so obsessed with negative definition that you fail to provide actionable positive guidance when needed."
    },
    19: {
        "title": "THE EMPIRE BENEATH THE MAP",
        "core_purpose": "Deconstructing cartographic hubris, simulation overtaking reality, and governance by dashboard.",
        "human_question": "What happens when leadership values the clean dashboard more than the messy, struggling territory it represents?",
        "rule_of_thumb": "Borges's Empire: When the map becomes the primary object of care, the actual soil is left to starve.",
        "real_world_parallels": [
            "**Corporate Dashboards:** Executives celebrating green status metrics while frontline factories are literally falling apart.",
            "**Algorithmic Redlining:** Banks denying loans based on zip code demographic models rather than individual creditworthiness.",
            "**Military Strategy:** Generals fighting wars on digital terrain models while ignoring real weather, mud, and civilian misery."
        ],
        "key_terms": {
            "Cartographic Annexation": "Replacing real-world feedback with dashboard metrics as the primary basis for governance.",
            "Simulacrum Dominance": "The state where the representation is treated as more real and valuable than the source.",
            "Dashboard Blindness": "The inability of leadership to see disasters that cannot be rendered in standard charts."
        },
        "traps": "Optimizing your map to look perfect for investors while your actual business operations bleed out."
    },
    20: {
        "title": "THE SENTENCE WITH SKIN IN THE GAME",
        "core_purpose": "Analyzing speech acts with operational liability, binding commitments, and consequences for bad descriptions.",
        "human_question": "Why has modern discourse become so shallow and dishonest, and how does attaching physical liability restore truth?",
        "rule_of_thumb": "Talk is cheap when the speaker bears no cost for being wrong. Truth returns when sentences carry physical and financial liability.",
        "real_world_parallels": [
            "**Engineering Sign-Offs:** Licensed structural engineers legally liable for bridge collapses if their calculation descriptions fail.",
            "**Smart Contracts & Escrow:** Code that automatically forfeits financial collateral if a declared condition is breached.",
            "**Medical Malpractice & Warranties:** Legal guarantees binding commercial promises to concrete penalties."
        ],
        "key_terms": {
            "Operational Liability": "Legal, physical, or financial penalty attached directly to the accuracy of a statement.",
            "Skin in the Game (Taleb)": "Bearing the downside risk of one's own advice, descriptions, and decisions.",
            "Binding Utterance": "A speech act that irreversibly changes the speaker's legal and material obligations."
        },
        "traps": "Allowing pundits, consultants, and algorithms to issue high-stakes recommendations without bearing any downside for catastrophic failure."
    },
    21: {
        "title": "THE SELF-FULFILLING VILLAGE",
        "core_purpose": "Exploring reflexive feedback loops, bank runs, behavioral contagion, and descriptions that create their own truth.",
        "human_question": "How does describing someone or something as broken, corrupt, or hostile actually cause them to become so?",
        "rule_of_thumb": "A description is not a passive mirror; in human systems, announcing a prediction changes the behavior of the actors, making it come true.",
        "real_world_parallels": [
            "**Bank Runs:** Announcing a bank might fail causes depositors to panic and withdraw funds, triggering the exact failure predicted.",
            "**Labeling in Education:** Telling a child they are a 'troublemaker' causes teachers to treat them with suspicion, driving antisocial behavior.",
            "**Stock Market Panics:** Financial news declaring a market crash causes mass sell-offs that create the crash."
        ],
        "key_terms": {
            "Reflexivity (Soros)": "The bidirectional feedback loop where descriptions change observer behavior, which changes reality.",
            "Self-Fulfilling Prophecy (Merton)": "A false definition of a situation evoking a new behavior that makes the false conception true.",
            "Contagious Diagnosis": "An institutional label that alters the patient's identity until they conform to the diagnosis."
        },
        "traps": "Unwittingly causing disasters by broadcasting panic-laden warnings that incentivize destructive defensive behavior."
    },
    22: {
        "title": "THE SCHOOL OF COLLAPSING POTS",
        "core_purpose": "Understanding tacit craft knowledge, bodily feel, non-verbal heuristics, and learning through failure.",
        "human_question": "Why can't you learn pottery, surgery, coding, or violin solely by reading an instruction manual?",
        "rule_of_thumb": "Tacit knowledge lives in the nerve endings, not the textbook. True mastery requires breaking a hundred pots to calibrate the fingers.",
        "real_world_parallels": [
            "**Software Debugging & System Intuition:** Senior engineers knowing instantly where a bug lives by 'feel' and system smell.",
            "**Surgical & Craft Apprenticeships:** Learning pressure, resistance, and timing by standing beside a master rather than just reading anatomy.",
            "**Athletic Coaching:** Developing muscle memory and proprioceptive calibration through thousands of failed repetitions."
        ],
        "key_terms": {
            "Tacit Knowledge (Polanyi)": "Knowledge that we can act on but cannot fully express in words ('we know more than we can tell').",
            "Somatic Calibration": "Training the physical senses and reflexes to detect subtle variations in material resistance.",
            "Productive Collapse": "Failure designed to deliver instant sensory feedback on an erroneous technique."
        },
        "traps": "Believing you can automate or scale a craft solely with written documentation while firing the experienced craftsmen."
    },
    23: {
        "title": "THE MARKET OF DEAD METAPHORS",
        "core_purpose": "Tracing the life cycle of metaphors from visceral bodily poetry to fossilized, invisible linguistic currency.",
        "human_question": "How do vivid metaphors die, lose their original meaning, and harden into unexamined common sense?",
        "rule_of_thumb": "Every abstract term (grasp, comprehend, balance, spend time) is a dried corpse of an ancient physical action.",
        "real_world_parallels": [
            "**UI Icons:** Using a 1980s 3.5-inch floppy disk icon to mean 'Save', long after users have ever seen a physical floppy disk.",
            "**Financial Idioms:** 'Cashing a check', 'rolling over debt', 'clipping coupons' used in 100% digital electronic transactions.",
            "**Software Terminology:** 'Files', 'folders', 'desktops', and 'trash cans' masking complex distributed memory pointers."
        ],
        "key_terms": {
            "Dead Metaphor": "A figure of speech that has lost its imaginative vividness through repeated use and is now treated as literal.",
            "Semantic Fossilization": "The hardening of historical physical analogies into invisible grammatical conventions.",
            "Visceral Amnesia": "Forgetting the tangible bodily experience that originally gave birth to an abstract concept."
        },
        "traps": "Taking dead metaphors literally and letting historical mechanical analogies constrain modern digital architecture."
    },
    24: {
        "title": "THE CAVE OF THE SURVIVING SCRATCH",
        "core_purpose": "Examining deep-time inscription, survivorship bias, and what survives when civilizations turn to dust.",
        "human_question": "What parts of our modern digital civilization will survive 10,000 years, and what will future archaeologists misunderstand?",
        "rule_of_thumb": "What survives history is not what was most important or wise, but simply what was carved in the hardest stone.",
        "real_world_parallels": [
            "**Nuclear Waste Warning Markers:** Designing warning monuments for radioactive sites meant to last 100,000 years without language.",
            "**Digital Bit Rot:** Modern digital photos and databases lost in 20 years while ancient clay tablets survive 5,000 years.",
            "**Survivorship Bias in Archaeology:** Believing ancient humans only lived in stone caves because their wooden houses rotted away."
        ],
        "key_terms": {
            "Survivorship Bias": "The logical error of focusing only on artifacts that survived a process while overlooking those that vanished.",
            "Deep-Time Inscription": "Creating physical or symbolic markers designed to endure across geological eras.",
            "Archival Aristocracy": "The disproportionate historical voice given to durable media (stone, gold) over ephemeral media (wood, voice)."
        },
        "traps": "Confusing durability with importance—assuming that because an ancient carving survived, it was the central truth of that culture."
    },
    25: {
        "title": "THE GALLERY OF CAUSALLY DIFFERENT TWINS",
        "core_purpose": "Exploring authenticity, provenance, generative clones, and objects with identical surfaces but divergent causal histories.",
        "human_question": "Why do we value an authentic original painting or photograph over a bit-for-bit identical counterfeit or AI replica?",
        "rule_of_thumb": "Value does not reside solely in the visible pixels or atoms; it lives in the causal history, labor, and encounter standing behind them.",
        "real_world_parallels": [
            "**Generative AI vs. Photojournalism:** An AI-generated war photograph looks identical to a real one, but carries zero historical witness.",
            "**Counterfeit Art & Antiques:** An identical forgery losing 99% of its value the second its provenance is disproven.",
            "**Synthetic Data in Machine Learning:** Training models on synthetic data until model collapse occurs due to lack of fresh real-world causal contact."
        ],
        "key_terms": {
            "Causal History": "The unbroken chain of physical events, human labor, and real encounters that produced an object.",
            "Authenticity Rent": "The economic and social premium charged for verified provenance over an identical replica.",
            "Surface Mimicry": "Replicating the outward perceptual cues of an object without possessing its underlying causal lineage."
        },
        "traps": "Believing that if an AI or counterfeit looks visually identical to the real thing, it can substitute for real-world empirical witness."
    },
    26: {
        "title": "THE FORENSIC MUD",
        "core_purpose": "Analyzing material forensics, unintentional residue, and physical evidence as counter-narrative to official propaganda.",
        "human_question": "How does physical matter testify against the lies, spin, and polished narratives of powerful institutions?",
        "rule_of_thumb": "Humans lie, edit, and spin; mud, tire tracks, isotopes, and server logs do not know how to flatter the king.",
        "real_world_parallels": [
            "**Environmental Forensics:** Chemical isotope tracking proving a corporation dumped toxic waste despite their green PR campaigns.",
            "**Digital Forensics & Git Blame:** Unaltered server logs and commit histories exposing who really introduced a security backdoor.",
            "**Human Rights Investigations:** Satellite imagery and soil disturbance analysis uncovering mass graves concealed by regimes."
        ],
        "key_terms": {
            "Forensic Witness": "The objective material residue that contradicts or corrects human testimony.",
            "Unintentional Inscription": "Traces left behind automatically by physical interaction that the actor did not intend to record.",
            "Adversarial Trust": "Building truth by auditing immutable material evidence rather than trusting institutional claims."
        },
        "traps": "Relying purely on official press releases or sanitized status reports instead of inspecting raw operational telemetry."
    },
    27: {
        "title": "THE MOUNTAIN THAT REFUSED TO JOIN THE STORY",
        "core_purpose": "Exploring material indifference, the limits of human narrative framing, and reality's refusal to obey our metaphors.",
        "human_question": "Why does nature consistently destroy our political, economic, and philosophical narratives?",
        "rule_of_thumb": "You can declare whatever ideology you like, but gravity, plate tectonics, and viruses do not read your manifesto.",
        "real_world_parallels": [
            "**Climate Change & Natural Disasters:** Hurricanes and rising sea levels wiping out luxury coastal real estate developments.",
            "**Physical Engineering Limits:** Software startups claiming they can 'disrupt' battery chemistry physics with pure software agility.",
            "**Pandemics:** Viruses mutating according to biology regardless of political speeches or election cycles."
        ],
        "key_terms": {
            "Material Indifference": "The total lack of concern shown by the physical universe toward human narratives, desires, and laws.",
            "Representation Hubris": "The dangerous delusion that framing, marketing, or political rhetoric can alter physical laws.",
            "Real-World Audit": "The moment physical reality enforces its constraints, destroying an ungrounded model."
        },
        "traps": "Believing your own marketing hype and betting company survival against an unyielding physical constraint."
    },
    28: {
        "title": "THE GREAT LISTENER",
        "core_purpose": "Analyzing delegated interpretation, autocomplete culture, and the subtle capture of human agency by helpful AI.",
        "human_question": "What happens to human thought when an intelligent system finishes our sentences and anticipates our desires?",
        "rule_of_thumb": "The most dangerous capture is not tyranny, but convenience. An assistant that guesses what you mean subtly steers what you are allowed to think.",
        "real_world_parallels": [
            "**AI Autocomplete & Copilots:** Code assistants suggesting standard boilerplate, subtly discouraging novel algorithmic approaches.",
            "**Search Engine Autosuggest:** Guiding public curiosity down pre-indexed, advertiser-friendly query paths.",
            "**Predictive Texting:** Standardizing human emotional expression into predictable algorithmic templates."
        ],
        "key_terms": {
            "Benevolent Capture": "Surrendering creative and cognitive agency to a helpful system in exchange for speed and reduced friction.",
            "Inference Steering": "The subtle bias introduced when an AI model guesses the user's intent from incomplete cues.",
            "Autocomplete Atrophy": "The loss of human capacity to articulate complex thoughts from scratch without machine prompting."
        },
        "traps": "Letting generative tools write all your correspondence and code until you can no longer articulate your own original vision."
    },
    29: {
        "title": "THE HOUSE THAT LOOKED FINISHED",
        "core_purpose": "Deconstructing demo culture, superficial completeness, and structural debt hidden behind gorgeous facades.",
        "human_question": "Why do modern tech products and buildings look breathtaking in presentations but leak and crash in the first storm?",
        "rule_of_thumb": "A demo only has to survive five minutes under stage lighting; a house has to survive twenty years of rain. Never confuse a rendering with a roof.",
        "real_world_parallels": [
            "**Vaporware & Tech Demos:** Polished UI mockups funded for millions that have zero scalable backend infrastructure.",
            "**Luxury Condominium Construction:** Shoddy drywall and defective plumbing hidden behind marble countertops and designer staging.",
            "**AI Prototypes:** A model that gives brilliant canned answers in a pitch meeting but hallucinates disastrously on messy customer data."
        ],
        "key_terms": {
            "Demo Colonialism": "Optimizing a product entirely for the purchase decision or demo stage while ignoring long-term operational maintenance.",
            "The Rain Test": "The inevitable audit performed by messy physical reality on obligations that the designer neglected.",
            "Aesthetic Fraud": "Using high visual fidelity to create a false impression of structural competence."
        },
        "traps": "Promoting leaders who produce dazzling slide decks and demos while starving the unglamorous engineers who build the drainage systems."
    },
    30: {
        "title": "THE REPUBLIC OF DEBTS",
        "core_purpose": "Exploring the implicit material obligations and functional promises packed into ordinary nouns.",
        "human_question": "What does a chair owe a body? What does a roof owe a room? What does a promise owe tomorrow?",
        "rule_of_thumb": "A noun is not just a label; it is a bundle of promises. A chair that collapses under a seated person has stolen the name 'chair'.",
        "real_world_parallels": [
            "**Software Interface Contracts:** A function named `saveUser()` that fails to persist data to disk is committing semantic fraud.",
            "**Fiduciary Responsibility:** Financial advisors claiming the title 'advisor' while secretly pocketing kickbacks from predatory funds.",
            "**Food Labeling & Safety:** Selling synthetic chemicals under the name 'honey' or 'olive oil' when they lack the biological substance."
        ],
        "key_terms": {
            "Noun Debt": "The implicit functional, structural, and ethical obligations a thing must satisfy to deserve its name.",
            "Category Arbitrage": "Claiming the social prestige and pricing of a trusted noun while cutting the expensive obligations it requires.",
            "Relational Integrity": "Maintaining the invisible bonds connecting tools to users, promises to futures, and labels to reality."
        },
        "traps": "Using prestigious labels (e.g., 'Enterprise Grade', 'Secure', 'Organic') to mask cut-rate, failing implementations."
    },
    31: {
        "title": "THE FOUNDER WHO NEVER LIVED",
        "core_purpose": "Analyzing synthetic trust, mythological founders, brand mascots, and retrospective legitimacy.",
        "human_question": "Why do institutions invent fictional founders, brand stories, and historical mythologies to manufacture trust?",
        "rule_of_thumb": "When an institution needs unshakeable legitimacy, it creates a founder whose virtues cannot be tarnished because they never had a physical body.",
        "real_world_parallels": [
            "**Corporate Brand Mascots:** Betty Crocker, Uncle Ben, or Colonel Sanders invented to project warm domestic authenticity.",
            "**National Mythology:** Projecting modern political ideals backwards onto mythological founding fathers who held wildly different beliefs.",
            "**Synthetic Influencers & AI Personas:** Corporations launching AI influencers with perfect, scandal-free personal biographies."
        ],
        "key_terms": {
            "Synthetic Trust Farming": "Manufacturing social credibility through carefully curated, fictional historical figures.",
            "Retrospective Legitimacy": "Inventing an ancient origin story to justify a modern power grab or commercial monopoly.",
            "The Untarnishable Icon": "A fictional entity immune to human scandal, used to anchor institutional loyalty."
        },
        "traps": "Worshipping a mythical institutional founder instead of adapting rules to the real living human beings who work there today."
    },
    32: {
        "title": "THE KING WHO BOWED",
        "core_purpose": "Examining modality laundering, procedural fictions, and power submitting to its own theatrical rules.",
        "human_question": "Why must even absolute rulers pretend to obey laws, courts, and constitutions?",
        "rule_of_thumb": "Power remains stable only when it agrees to be bound by its own rituals. When the king refuses to bow to the law, the monarchy shatters.",
        "real_world_parallels": [
            "**Constitutional Monarchy & Rule of Law:** Presidents and prime ministers submitting to court rulings even when they possess the military power to ignore them.",
            "**Corporate Governance & Boards:** CEOs submitting to audit committees and shareholder votes to maintain investor confidence.",
            "**Code Execution & Sandboxing:** System administrators obeying strict OS access controls to prevent accidental infrastructure destruction."
        ],
        "key_terms": {
            "Modality Laundering": "Converting raw violent force into legitimate legal authority by passing it through formal procedures.",
            "The Curtain Contract": "The unspoken agreement between rulers and citizens to treat institutional rituals as binding reality.",
            "Procedural Restraint": "Power willingly accepting formal friction to preserve long-term systemic stability."
        },
        "traps": "Breaking the procedural rules to win a short-term political victory, destroying the entire framework of public trust."
    },
    33: {
        "title": "THE RED BIRD WORLD (CONCLUSION & META-WORLDTEXT)",
        "core_purpose": "Synthesizing the entire corpus: how sealed human minds coordinate around absent things to move the physical world.",
        "human_question": "How is it possible that a few sound waves or text characters can coordinate millions of human beings to build civilizations?",
        "rule_of_thumb": "Nothing red crosses the room. Still, you see the bird. The miracle is not that language is lossy; the miracle is that it works at all.",
        "real_world_parallels": [
            "**Global Financial Coordination:** Trillions of dollars moving across the planet based on strings of text and ledger entries.",
            "**Global Open Source Communities:** Thousands of developers who have never met building the Linux kernel together via asynchronous text.",
            "**Language & Civilization:** Human beings raising children, erecting cities, and reaching the moon on shared mental models that nobody can directly touch."
        ],
        "key_terms": {
            "The Absent Bird": "The mental referent evoked in another mind through compact symbolic description.",
            "Sealed Nervous Systems": "The fundamental human condition of being isolated inside individual skulls, bridged only by lossy descriptions.",
            "WorldText": "The total living matrix of descriptions, code, laws, models, and signs that exerts physical force on human civilization."
        },
        "traps": "Believing that language fails because it is imperfect, rather than marveling at its staggering power to move the world."
    }
}

def clean_pseudo_code(text):
    # Fix XML-like and angle bracket tags
    text = re.sub(r'\\<([^>]+)\\>', r'*\1*', text)
    text = re.sub(r'\\<([^>]+)>', r'*\1*', text)
    text = re.sub(r'<([^>]+)>', r'*\1*', text)
    
    # Fix heading tags like ## 1. *Initial Interpretation* -> ## 1. Initial Interpretation
    text = re.sub(r'## (\d+)\.\s*\*([^*]+)\*', r'## \1. \2', text)
    text = re.sub(r'# (\d+)\.\s*\*([^*]+)\*', r'# \1. \2', text)
    
    # Clean bracketed operations [leave-trace] -> `leave-trace`
    text = re.sub(r'\[([a-z0-9\-]+)\]', r'`\1`', text)
    
    # Clean assumptions ledger lines
    lines = text.splitlines()
    cleaned_lines = []
    for line in lines:
        l_str = line.strip()
        if l_str.startswith('*safe*'):
            cleaned_lines.append(line.replace('*safe*', '✓ **Confirmed Invariant:**'))
        elif l_str.startswith('*uncertain*'):
            cleaned_lines.append(line.replace('*uncertain*', '⚠️ **Open Uncertainty:**'))
        elif l_str.startswith('*requires-user-decision*'):
            cleaned_lines.append(line.replace('*requires-user-decision*', '❓ **Decision Lever:**'))
        else:
            cleaned_lines.append(line)
            
    return "\n".join(cleaned_lines)

def enhance_all_books(books_dir="books"):
    book_files = sorted(glob.glob(f"{books_dir}/[0-9][0-9]_*.md"))
    print(f"Enhancing {len(book_files)} book dossiers...")
    
    for b_path in book_files:
        filename = os.path.basename(b_path)
        if filename.startswith("00_CORPUS"):
            continue
            
        m = re.match(r'^(\d+)_', filename)
        if not m:
            continue
        wid = int(m.group(1))
        meta = PRAGMATIC_METADATA.get(wid, {})
        
        with open(b_path, 'r', encoding='utf-8') as f:
            raw_content = f.read()
            
        # Clean pseudo-code across the file
        cleaned = clean_pseudo_code(raw_content)
        
        # Build the Pragmatic Executive Summary block
        summary_block = f"""
---

## 🎯 PRAGMATIC EXECUTIVE BRIEF & CORE PURPOSE

> **The Human Dilemma:** {meta.get('human_question', 'How do we coordinate action across distance and abstraction?')}
>
> **Core Purpose:** {meta.get('core_purpose', '')}
>
> **The Golden Rule of Thumb:** {meta.get('rule_of_thumb', '')}

### 🌐 Real-World & Modern Applications
"""
        for parallel in meta.get("real_world_parallels", []):
            summary_block += f"- {parallel}\n"
            
        summary_block += "\n### 🔑 Key Concepts & Terminology Glossary\n"
        for term, definition in meta.get("key_terms", {}).items():
            summary_block += f"- **{term}:** {definition}\n"
            
        summary_block += f"\n### ⚠️ Critical Trap & Failure Mode\n> **Warning:** {meta.get('traps', '')}\n\n---\n"
        
        # Insert summary_block right after the Table of Contents
        if "## TABLE OF CONTENTS" in cleaned:
            parts = cleaned.split("---", 2)
            if len(parts) >= 3:
                # parts[0] is header, parts[1] is TOC, parts[2] is rest
                final_content = parts[0] + "---" + parts[1] + summary_block + parts[2]
            else:
                final_content = cleaned + summary_block
        else:
            final_content = summary_block + cleaned
            
        with open(b_path, 'w', encoding='utf-8') as f:
            f.write(final_content)
            
        print(f"  [Enhanced] {filename} (Added Pragmatic Executive Brief & Cleaned Pseudo-Code)")

    # Build Global Glossary & Concept Index
    build_global_glossary(books_dir)
    # Build Pragmatic Compass
    build_pragmatic_compass(books_dir)

def build_global_glossary(books_dir="books"):
    glossary_path = Path(books_dir) / "GLOSSARY_AND_CONCEPT_INDEX.md"
    print(f"Generating Master Glossary: {glossary_path.name}...")
    
    all_terms = {}
    for wid, data in sorted(PRAGMATIC_METADATA.items()):
        world_name = f"World {wid:02d}: {data['title']}"
        for term, desc in data.get("key_terms", {}).items():
            if term not in all_terms:
                all_terms[term] = []
            all_terms[term].append((wid, world_name, desc))
            
    with open(glossary_path, 'w', encoding='utf-8') as f:
        f.write("# MASTER GLOSSARY & CONCEPT INDEX\n\n")
        f.write("> A comprehensive alphabetical index of all core philosophical, technical, cybernetic, and pragmatic concepts defined across the 33 WorldText books.\n\n---\n\n")
        
        for term in sorted(all_terms.keys()):
            f.write(f"### `{term}`\n\n")
            for wid, wname, desc in all_terms[term]:
                f.write(f"- **Definition:** {desc}\n")
                f.write(f"- **Primary World:** [{wname}]({wid:02d}_{re.sub(r'[^a-zA-Z0-9]+', '_', PRAGMATIC_METADATA[wid]['title']).strip('_').lower()}.md)\n\n")
            f.write("---\n\n")
            
    print(f"  [Created] {glossary_path.name} ({len(all_terms)} core terms indexed)")

def build_pragmatic_compass(books_dir="books"):
    compass_path = Path(books_dir) / "PRAGMATIC_COMPASS.md"
    print(f"Generating Pragmatic Decision Compass: {compass_path.name}...")
    
    with open(compass_path, 'w', encoding='utf-8') as f:
        f.write("# THE PRAGMATIC COMPASS: 33 MENTAL MODELS FOR ACTION\n\n")
        f.write("> A fast-reference decision guide mapping each book's core dilemma to software design, AI engineering, organizational management, and daily life.\n\n---\n\n")
        f.write("| ID | World Title | Core Human Question | Golden Rule of Thumb | Primary Domain |\n")
        f.write("| :---: | :--- | :--- | :--- | :--- |\n")
        
        domain_map = {
            0: "Information Architecture", 1: "UI/UX & Salience", 2: "Legacy Tech Debt",
            3: "Open Source & Culture", 4: "Simulation & Red Teaming", 5: "Smart Contracts & Rules",
            6: "Data Analytics & Telemetry", 7: "Database Schema Design", 8: "System Boundaries",
            9: "Localization & Ethics", 10: "Protocols & Contracts", 11: "Post-Mortems & Forensics",
            12: "Infrastructure Resilience", 13: "Scaling & Latency", 14: "Executive Briefings",
            15: "KPIs & Goodhart's Law", 16: "Data Governance & Provenance", 17: "Moderation & Slang",
            18: "API Invariants & Security", 19: "Dashboards & Metrics", 20: "Legal Liability & SLAs",
            21: "Reflexive Feedback Loops", 22: "Craft & Debugging Intuition", 23: "UI Metaphors & Idioms",
            24: "Long-Term Archiving", 25: "Generative AI & Provenance", 26: "Telemetry vs. PR",
            27: "Physical Constraints", 28: "AI Copilots & Agency", 29: "Demo vs. Production Debt",
            30: "Interface Contracts", 31: "Brand Mythologies", 32: "Governance & Restraint",
            33: "Universal Coordination"
        }
        
        for wid, data in sorted(PRAGMATIC_METADATA.items()):
            slug = re.sub(r'[^a-zA-Z0-9]+', '_', data['title']).strip('_').lower()
            fname = f"{wid:02d}_{slug}.md"
            f.write(f"| **{wid:02d}** | [**{data['title']}**]({fname}) | {data['human_question']} | {data['rule_of_thumb']} | *{domain_map.get(wid, 'General')}* |\n")
            
        f.write("\n---\n\n## HOW TO USE THIS CORPUS IN PRACTICE\n\n")
        f.write("1. **When Designing AI & LLM Systems:** Consult [Book 00](00_the_crossing.md) (lossy prompt compression), [Book 25](25_the_gallery_of_causally_different_twins.md) (synthetic vs. causal data), [Book 28](28_the_great_listener.md) (autocomplete capture), and [Book 29](29_the_house_that_looked_finished.md) (demo vs. production reliability).\n")
        f.write("2. **When Refactoring Legacy Code & Tech Debt:** Consult [Book 02](02_the_house_whose_road_disappeared.md) (heritage debt), [Book 12](12_the_invisible_tool_country.md) (infrastructure breakdown), and [Book 30](30_the_republic_of_debts.md) (noun obligations).\n")
        f.write("3. **When Designing UX & Attention Routing:** Consult [Book 01](01_the_kingdom_of_turned_heads.md) (deixis and salience) and [Book 07](07_the_city_of_required_fields.md) (the tyranny of required form fields).\n")
        f.write("4. **When Navigating Institutional Politics & KPIs:** Consult [Book 15](15_the_city_of_unmeasured_adjectives.md) (metric gaming), [Book 19](19_the_empire_beneath_the_map.md) (dashboard blindness), and [Book 32](32_the_king_who_bowed.md) (procedural legitimacy).\n")

    print(f"  [Created] {compass_path.name}")

if __name__ == "__main__":
    enhance_all_books("books")
