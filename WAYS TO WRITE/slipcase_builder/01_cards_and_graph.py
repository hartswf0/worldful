import os
import re
import glob
import json
import hashlib

base_dir = "/Users/gaia/WORLDFUL"
source_zettel_dir = os.path.join(base_dir, "WAYS TO WRITE", "zettels")
pkg_dir = os.path.join(base_dir, "slipcase")
md_dir = os.path.join(pkg_dir, "_MD")
slipcase_meta_dir = os.path.join(pkg_dir, "_SLIPCASE")

os.makedirs(pkg_dir, exist_ok=True)
os.makedirs(md_dir, exist_ok=True)
os.makedirs(slipcase_meta_dir, exist_ok=True)

# Memorable names mapping for all 44 zettels
NAMES_MAP = {
    "20260907-AGRE-1987-DEICTIC-REPRESENTATION": "DEICTIC-REPRESENTATION",
    "20260907-ANSCOMBE-1957-SHOPPING-LIST": "SHOPPING-LIST-DIRECTION-OF-FIT",
    "20260907-AUSLANDER-1999-LIVENESS-MEDIATIZATION": "LIVENESS-AND-MEDIATIZATION",
    "20260907-AUSTIN-1962-INFELICITY-DOCTRINE": "INFELICITY-DOCTRINE",
    "20260907-BAXANDALL-1972-COMMISSION-CONTRACT": "COMMISSION-CONTRACT-PERIOD-EYE",
    "20260907-BECKER-1982-ART-WORLDS-CONVENTIONS": "ART-WORLDS-AND-CONVENTIONS",
    "20260907-BELKIN-1982-ASK-HYPOTHESIS": "ANOMALOUS-STATE-OF-KNOWLEDGE",
    "20260907-BRATMAN-1987-BDI-PLANS": "BDI-PLANS-AND-PRACTICAL-REASON",
    "20260907-BRYANT-2002-FLUID-TEXT-REVISION": "FLUID-TEXT-AND-REVISION",
    "20260907-BUSH-1945-AS-WE-MAY-THINK": "MEMEX-TRAILS-AND-ASSOCIATION",
    "20260907-CAGE-1961-INDETERMINACY-CHANCE": "INDETERMINACY-AND-SILENCE",
    "20260907-CARDEW-1971-TREATISE-HANDBOOK": "GRAPHIC-SCORE-INTERPRETATION",
    "20260907-CLARK-1991-GROUNDING-IN-COMMUNICATION": "GROUNDING-AND-COMMON-GROUND",
    "20260907-DIJKSTRA-1968-GOTO-HARMFUL": "STRUCTURED-CONTROL-FLOW",
    "20260907-ELSTER-1979-ULYSSES-PRECOMMITMENT": "PRECOMMITMENT-AND-CONSTRAINTS",
    "20260907-ENO-1996-GENERATIVE-RULES": "GENERATIVE-MUSIC-SYSTEMS",
    "20260907-FIKES-1971-STRIPS-PLANNING": "STRIPS-MEANS-ENDS-PLANNING",
    "20260907-GARFINKEL-1967-BREACHING-EXPERIMENTS": "BREACHING-BACKGROUND-EXPECTANCIES",
    "20260907-GAVER-1999-CULTURAL-PROBES": "CULTURAL-PROBES-AND-AMBIGUITY",
    "20260907-GENETTE-1982-PALIMPSESTS-HYPERTEXT": "PALIMPSESTS-AND-TRANSTEXTUALITY",
    "20260907-GOFFMAN-1959-DRAMATURGY-FRONT-STAGE": "DRAMATURGICAL-FRONT-STAGE",
    "20260907-GOODMAN-1968-ALLOGRAPHIC-SCORE": "ALLOGRAPHIC-NOTATION-IDENTITY",
    "20260907-GRICE-1975-LOGIC-CONVERSATION": "COOPERATIVE-MAXIMS-IMPLICATURE",
    "20260907-HARTSOE-2026-LISTENER-WITH-ACTUATORS": "LISTENER-WITH-ACTUATORS",
    "20260907-HARTSOE-2026-THE-KNIFE-SCHEMA": "THE-KNIFE-DIMENSIONAL-CUT",
    "20260907-HARTSOE-2026-THE-LEVER-APERTURE": "THE-LEVER-AND-APERTURE",
    "20260907-HARTSOE-2026-THE-POINTING-HAND": "THE-POINTING-HAND-INDEXICALITY",
    "20260907-HUTCHINS-1995-DISTRIBUTED-NAV-COGNITION": "DISTRIBUTED-COGNITION-TOOLS",
    "20260907-KAY-1993-OBJECT-MESSAGING-BIOLOGY": "OBJECT-MESSAGING-BIOLOGY",
    "20260907-KENDON-2004-GESTURE-UTTERANCE": "GESTURE-AS-VISIBLE-ACTION",
    "20260907-KNUTH-1984-LITERATE-PROGRAMMING": "LITERATE-PROGRAMMING-WEB",
    "20260907-LANDIN-1966-NEXT-700-ISWIM": "NEXT-700-LANGUAGES-ISWIM",
    "20260907-LATOUR-1996-ARAMIS-NEGOTIATION": "ARAMIS-ACTOR-NETWORK-DEATH",
    "20260907-MCGANN-1983-SOCIAL-TEXT-EDIT": "SOCIAL-TEXTUAL-APPARATUS",
    "20260907-MCNEILL-1992-GROWTH-POINT-GESTURE": "GESTURAL-GROWTH-POINTS",
    "20260907-PEREC-1969-LIPOGRAM-DISPARITION": "LIPOGRAMMATIC-EXCLUSION",
    "20260907-QUENEAU-1960-OULIPO-CLINAMEN": "OULIPO-POTENTIAL-LITERATURE",
    "20260907-SACKS-1974-TURN-TAKING-SYSTEMATICS": "CONVERSATIONAL-TURN-TAKING",
    "20260907-SALTON-1975-VECTOR-SPACE-MODEL": "VECTOR-SPACE-RETRIEVAL",
    "20260907-SCHECHNER-1988-RESTORED-BEHAVIOR": "RESTORED-BEHAVIOR-RITUAL",
    "20260907-SEARLE-1975-ILLOCUTIONARY-TAXONOMY": "ILLOCUTIONARY-FORCE-TAXONOMY",
    "20260907-SENGERS-2006-INTERPRETIVE-FLEXIBILITY": "INTERPRETIVE-FLEXIBILITY-DESIGN",
    "20260907-SUCHMAN-1987-SITUATED-ACTIONS": "SITUATED-ACTIONS-VS-PLANS",
    "20260907-WINOGRAD-1986-COMMITMENT-MACHINE": "COMMITMENT-MACHINES-LANGUAGE"
}

files = sorted(glob.glob(os.path.join(source_zettel_dir, "*.md")))
print(f"Discovered {len(files)} zettels in source directory.")

zettels_data = []

def extract_section(text, sec_name, next_names):
    pattern = rf"^{sec_name}:\s*\n(.*?)(?=\n\n(?:" + "|".join(next_names) + rf"):\s*\n|\Z)"
    m = re.search(pattern, text, re.DOTALL | re.MULTILINE)
    return m.group(1).strip() if m else ""

sections_order = [
    "ID", "TITLE", "SOURCE", "PASSAGE", "RESEARCH OBJECT", "LOCAL MOVE",
    "SOURCE TERMS", "WHAT BECAME STRANGE", "QUESTION", "DEEPER QUESTION",
    "MECHANISM", "FORMAL SHIFT", "SOURCE FORMALISM", "OUR FORMALIZATION",
    "TENSION", "MISSING", "BOUNDARY", "CITATION TRAIL", "TEST",
    "PLATFORM", "LINKS", "BIBTEX"
]

for idx, fpath in enumerate(files, 1):
    with open(fpath, "r", encoding="utf-8") as fp:
        raw = fp.read().strip()
    
    # Extract exact payload
    payload = raw
    if payload.startswith("```text"):
        payload = payload[7:].strip()
    if payload.endswith("```"):
        payload = payload[:-3].strip()
    
    # Payload hash
    payload_sha256 = hashlib.sha256(payload.encode("utf-8")).hexdigest()
    
    # ID
    id_m = re.search(r"^ID:\s*([^\n]+)", payload, re.MULTILINE)
    zid = id_m.group(1).strip() if id_m else f"NOID-{idx:03d}"
    
    # Title
    title = extract_section(payload, "TITLE", sections_order[2:])
    
    # Source
    source_str = extract_section(payload, "SOURCE", sections_order[3:])
    
    # Passage
    passage = extract_section(payload, "PASSAGE", sections_order[4:])
    
    # Research Object
    research_obj = extract_section(payload, "RESEARCH OBJECT", sections_order[5:])
    
    # Mechanism
    mechanism = extract_section(payload, "MECHANISM", sections_order[11:])
    
    # Platform
    platform_raw = extract_section(payload, "PLATFORM", sections_order[20:])
    p_links = re.findall(r"\[\[(.*?)\]\]", platform_raw)
    platform = p_links[0].strip() if p_links else "unassigned"
    
    # Links
    links_raw = extract_section(payload, "LINKS", sections_order[21:])
    out_links = [l.strip() for l in re.findall(r"\[\[(.*?)\]\]", links_raw)]
    
    # BibTeX
    bibtex_m = re.search(r"^BIBTEX:\s*\n(.*)", payload, re.DOTALL | re.MULTILINE)
    bibtex = bibtex_m.group(1).strip() if bibtex_m else ""
    citekey_m = re.search(r"@\w+\s*\{\s*([^,\s]+)", bibtex)
    citekey = citekey_m.group(1).strip() if citekey_m else "sourceunknown"
    
    memorable_name = NAMES_MAP.get(zid, "ZETTEL-" + zid)
    
    # Card filename
    filename = f"{idx:03d}__{memorable_name}__{citekey}__{zid}__from-forage.txt"
    md_filename = f"{idx:03d}__{memorable_name}__{citekey}__{zid}__from-forage.md"
    
    card_info = {
        "order": idx,
        "id": zid,
        "name": memorable_name,
        "citekey": citekey,
        "filename": filename,
        "md_filename": md_filename,
        "origin": "forage",
        "title": title,
        "source": source_str,
        "passage": passage,
        "research_object": research_obj,
        "mechanism": mechanism,
        "platform": platform,
        "links": out_links,
        "bibtex": bibtex,
        "sha256": payload_sha256,
        "payload": payload,
        "byte_length": len(payload.encode("utf-8")),
        "line_count": len(payload.splitlines())
    }
    zettels_data.append(card_info)

print(f"Processed {len(zettels_data)} card objects.")

# 1. Write individual root .txt cards
for card in zettels_data:
    txt_path = os.path.join(pkg_dir, card["filename"])
    with open(txt_path, "w", encoding="utf-8") as fp:
        fp.write(card["payload"] + "\n")
print(f"Wrote 44 root .txt cards in {pkg_dir}")

# 2. Write exact _MD mirrors
for card in zettels_data:
    md_path = os.path.join(md_dir, card["md_filename"])
    with open(md_path, "w", encoding="utf-8") as fp:
        fp.write(card["payload"] + "\n")
print(f"Wrote 44 _MD mirrors in {md_dir}")

# 3. Write ZETTELS.txt
zettels_txt_path = os.path.join(pkg_dir, "ZETTELS.txt")
with open(zettels_txt_path, "w", encoding="utf-8") as fp:
    fp.write("================================================================================\n")
    fp.write("SLIPCASE — PORTABLE RESEARCH FIELD: MASTER ZETTEL DECK\n")
    fp.write(f"Package: slipcase | Deck Size: {len(zettels_data)} Cards | Date: 2026-09-07\n")
    fp.write("================================================================================\n\n")
    for card in zettels_data:
        fp.write("================================================================================\n")
        fp.write(f"CARD {card['order']:03d} / {len(zettels_data):03d} : {card['filename']}\n")
        fp.write(f"ORIGINAL ID: {card['id']} | PLATFORM: [[{card['platform']}]] | CITEKEY: {card['citekey']}\n")
        fp.write(f"SHA-256: {card['sha256']}\n")
        fp.write("================================================================================\n")
        fp.write(card["payload"])
        fp.write("\n\n")
print(f"Wrote master deck: {zettels_txt_path}")

# 4. Write ZETTELS.json and ZETTELS.jsonl
zettels_json_path = os.path.join(pkg_dir, "ZETTELS.json")
with open(zettels_json_path, "w", encoding="utf-8") as fp:
    json.dump(zettels_data, fp, indent=2)

zettels_jsonl_path = os.path.join(pkg_dir, "ZETTELS.jsonl")
with open(zettels_jsonl_path, "w", encoding="utf-8") as fp:
    for card in zettels_data:
        fp.write(json.dumps(card) + "\n")
print(f"Wrote ZETTELS.json and ZETTELS.jsonl")

# 5. Build Graph Nodes & Edges
nodes = []
edges = []

# Platform definitions
platforms = [
    {"id": "deep-play-at-the-aperture", "name": "Deep Play at the Aperture", "description": "The threshold of translation, transduction, and dimensional reduction between symbolic description and actuator force."},
    {"id": "game-01-instruction", "name": "Game 01: Instruction", "description": "Commands, directives, illocutionary force, and the direction of fit from world to token."},
    {"id": "game-02-score", "name": "Game 02: Score", "description": "Notation, indeterminacy, graphic scores, and allographic execution."},
    {"id": "game-03-program", "name": "Game 03: Program", "description": "Structured control flow, cellular messaging, literate programming, and algorithmic formalisms."},
    {"id": "game-04-plan", "name": "Game 04: Plan", "description": "Situated action, deictic representations, BDI architectures, and reactive survival."},
    {"id": "game-05-query", "name": "Game 05: Query", "description": "Associative indexing, memex trails, vector space retrieval, and anomalous states of knowledge."},
    {"id": "game-06-probe", "name": "Game 06: Probe", "description": "Breaching experiments, cultural probes, ambiguous provocation, and background expectancies."},
    {"id": "game-07-gesture", "name": "Game 07: Gesture", "description": "Visible bodily action, growth points, indexical pointing, and distributed maritime cognition."},
    {"id": "game-08-commission", "name": "Game 08: Commission", "description": "Client-patron contracts, conventions of art worlds, and actor-network negotiations."},
    {"id": "game-09-conversation", "name": "Game 09: Conversation", "description": "Systematics of turn-taking, cooperative maxims, implicature, and common ground repair."},
    {"id": "game-10-edit", "name": "Game 10: Edit", "description": "Fluid text revision, hypertextual palimpsests, and social textual criticism."},
    {"id": "game-11-constraint", "name": "Game 11: Constraint", "description": "Oulipian potential literature, lipograms, clinamen deviations, and Ulysses precommitments."},
    {"id": "game-12-performance", "name": "Game 12: Performance", "description": "Dramaturgical front stage, restored twice-behaved behavior, and mediatized liveness."}
]

for p in platforms:
    nodes.append({
        "id": p["id"],
        "type": "PLATFORM",
        "label": p["name"],
        "description": p["description"]
    })

# Add Zettel nodes
for card in zettels_data:
    nodes.append({
        "id": card["id"],
        "type": "ZETTEL",
        "label": card["title"],
        "order": card["order"],
        "name": card["name"],
        "citekey": card["citekey"],
        "filename": card["filename"],
        "sha256": card["sha256"],
        "platform": card["platform"]
    })

# Concepts
concepts = [
    {"id": "concept-direction-of-fit", "label": "Direction of Fit", "description": "The fundamental asymmetry between word-to-world (assertive report) and world-to-word (directive actuation)."},
    {"id": "concept-the-knife", "label": "The Knife & Dimensional Cut", "description": "The dimensional collapse occurring when infinite symbolic text is executed through physical or cybernetic actuators."},
    {"id": "concept-deictic-representation", "label": "Deictic Representation", "description": "Indexical-functional coupling to the environment without global internal world models."},
    {"id": "concept-ekphrastic-illusion", "label": "Ekphrastic Illusion", "description": "The conflation of vivid narrative description with causal mechanical compliance."},
    {"id": "concept-speech-acts", "label": "Speech Act Felicity", "description": "Conditions under which performative utterances succeed or misfire."},
    {"id": "concept-situated-action", "label": "Situated Action", "description": "Ad hoc, reflexive action in dynamic environments where plans are retrospective accounts."},
    {"id": "concept-allographic-score", "label": "Allographic Score", "description": "Notation systems that identify a work through compliance rather than physical provenance."},
    {"id": "concept-palimpsest-fluid-text", "label": "Fluid Text & Palimpsest", "description": "Textual materiality as an ongoing sequence of social revisions and traces."},
    {"id": "concept-conversational-grounding", "label": "Conversational Grounding", "description": "The collaborative establishment of mutual belief through least collaborative effort."},
    {"id": "concept-oulipian-constraint", "label": "Oulipian Constraint & Clinamen", "description": "Systematic voluntary restrictions producing generative combinatorial freedom."},
    {"id": "concept-restored-behavior", "label": "Restored Twice-Behaved Behavior", "description": "The theatrical and ritual repetition of actions independent of their causal origin."},
    {"id": "concept-breaching-experiment", "label": "Ethnomethodological Breaching", "description": "Deliberate violation of implicit social expectancies to reveal institutional scaffolding."}
]

for c in concepts:
    nodes.append({
        "id": c["id"],
        "type": "CONCEPT",
        "label": c["label"],
        "description": c["description"]
    })

# Ghosts (Open intellectual addresses)
ghosts = [
    {"id": "ghost-knife-counter-cut", "label": "[[the-knife-counter-cut]]", "description": "The unmodelled physical friction and blade wear produced on the tool during actuation."},
    {"id": "ghost-subordinate-listener-break", "label": "[[subordinate-listener-break]]", "description": "The point of breakdown when a passive receiver refuses or fails to translate instruction into force."},
    {"id": "ghost-ekphrastic-remainder", "label": "[[ekphrastic-remainder]]", "description": "What is discarded when a continuous physical state is digitized into descriptive tokens."},
    {"id": "ghost-incomputable-friction", "label": "[[incomputable-friction]]", "description": "The substrate resistance that prevents closed-loop formal convergence in dynamic environments."},
    {"id": "ghost-aperture-threshold", "label": "[[aperture-threshold]]", "description": "The boundary condition where symbolic communication becomes mechanical impedance."}
]

for g in ghosts:
    nodes.append({
        "id": g["id"],
        "type": "GHOST",
        "label": g["label"],
        "description": g["description"]
    })

# Prompts
prompts = [
    {"id": "prompt-poml-15-55-am", "type": "PROMPT", "label": "POML v15.55-AM Slipcase Assembly Prompt", "description": "Lossless compiler specification for portable research field assembly."},
    {"id": "prompt-poml-3-0", "type": "PROMPT", "label": "POML v3.0 Prime Zettel Forage Prompt", "description": "Inquiry and opposition forage instructions across 12 language games."},
    {"id": "prompt-12-games-contractors", "type": "PROMPT", "label": "12 Language Games Contractors Instruction", "description": "Yellow pages and thought essay containers prompt architecture."}
]
for pr in prompts:
    nodes.append(pr)

# Sources & Resources
sources_seen = {}
for card in zettels_data:
    ck = card["citekey"]
    if ck not in sources_seen:
        sources_seen[ck] = {
            "id": f"source-{ck}",
            "type": "SOURCE",
            "citekey": ck,
            "label": card["source"].split("—")[0].strip() if "—" in card["source"] else ck,
            "citation": card["source"],
            "bibtex": card["bibtex"]
        }
        nodes.append(sources_seen[ck])
        
        # Resource node
        nodes.append({
            "id": f"resource-{ck}",
            "type": "RESOURCE",
            "citekey": ck,
            "label": f"RESOURCE: {ck}",
            "state": "LOCAL_RECORD",
            "source_id": f"source-{ck}"
        })

# Edges
for card in zettels_data:
    zid = card["id"]
    plat = card["platform"]
    
    # MEMBER_OF platform
    edges.append({
        "source": zid,
        "target": plat,
        "type": "MEMBER_OF",
        "literal": f"[[{plat}]]"
    })
    
    # LINKS_TO platforms/targets
    for target in card["links"]:
        edges.append({
            "source": zid,
            "target": target,
            "type": "LINKS_TO",
            "literal": f"[[{target}]]"
        })
        # Derived BACKLINK
        edges.append({
            "source": target,
            "target": zid,
            "type": "BACKLINK",
            "literal": f"backlink from {card['name']}"
        })
    
    # USES_SOURCE
    edges.append({
        "source": zid,
        "target": f"source-{card['citekey']}",
        "type": "USES_SOURCE",
        "literal": card["citekey"]
    })

# Connect zettels to concepts based on thematic matching
concept_rules = [
    ("concept-direction-of-fit", ["anscombe", "searle", "austin", "winograd", "hartsoe"]),
    ("concept-the-knife", ["hartsoe", "agre", "suchman", "fikes"]),
    ("concept-deictic-representation", ["agre", "chapman", "hutchins", "suchman", "hartsoe"]),
    ("concept-ekphrastic-illusion", ["hartsoe", "cardew", "goodman", "belkin"]),
    ("concept-speech-acts", ["austin", "searle", "winograd", "grice", "clark"]),
    ("concept-situated-action", ["suchman", "agre", "bratman", "garfinkel"]),
    ("concept-allographic-score", ["goodman", "cardew", "cage", "eno"]),
    ("concept-palimpsest-fluid-text", ["bryant", "genette", "mcgann"]),
    ("concept-conversational-grounding", ["clark", "sacks", "grice"]),
    ("concept-oulipian-constraint", ["perec", "queneau", "elster"]),
    ("concept-restored-behavior", ["schechner", "goffman", "auslander"]),
    ("concept-breaching-experiment", ["garfinkel", "gaver", "sengers"])
]

for c_id, keywords in concept_rules:
    for card in zettels_data:
        text_match = (card["id"] + " " + card["title"] + " " + card["citekey"]).lower()
        if any(kw in text_match for kw in keywords):
            edges.append({
                "source": card["id"],
                "target": c_id,
                "type": "WIKILINKS_TO",
                "literal": f"associated with {c_id}"
            })
            edges.append({
                "source": c_id,
                "target": card["id"],
                "type": "BACKLINK",
                "literal": f"backlink from {card['name']}"
            })

# Connect ghosts to related platforms
ghost_connections = [
    ("ghost-knife-counter-cut", "deep-play-at-the-aperture"),
    ("ghost-knife-counter-cut", "game-01-instruction"),
    ("ghost-subordinate-listener-break", "game-01-instruction"),
    ("ghost-subordinate-listener-break", "game-09-conversation"),
    ("ghost-ekphrastic-remainder", "deep-play-at-the-aperture"),
    ("ghost-ekphrastic-remainder", "game-02-score"),
    ("ghost-incomputable-friction", "game-04-plan"),
    ("ghost-incomputable-friction", "game-03-program"),
    ("ghost-aperture-threshold", "deep-play-at-the-aperture"),
    ("ghost-aperture-threshold", "game-07-gesture")
]

for g_id, target_plat in ghost_connections:
    edges.append({
        "source": g_id,
        "target": target_plat,
        "type": "LINKS_TO",
        "literal": f"[[{target_plat}]]"
    })
    edges.append({
        "source": target_plat,
        "target": g_id,
        "type": "BACKLINK",
        "literal": f"open ghost on {target_plat}"
    })

print(f"Graph constructed: {len(nodes)} nodes, {len(edges)} edges.")

# Write _SLIPCASE/ files
nodes_path = os.path.join(slipcase_meta_dir, "NODES.jsonl")
with open(nodes_path, "w", encoding="utf-8") as fp:
    for n in nodes:
        fp.write(json.dumps(n) + "\n")

relations_path = os.path.join(slipcase_meta_dir, "RELATIONS.jsonl")
with open(relations_path, "w", encoding="utf-8") as fp:
    for e in edges:
        fp.write(json.dumps(e) + "\n")

resources_jsonl_path = os.path.join(slipcase_meta_dir, "RESOURCES.jsonl")
with open(resources_jsonl_path, "w", encoding="utf-8") as fp:
    for n in nodes:
        if n["type"] == "RESOURCE":
            fp.write(json.dumps(n) + "\n")

appearances_path = os.path.join(slipcase_meta_dir, "APPEARANCES.jsonl")
with open(appearances_path, "w", encoding="utf-8") as fp:
    for card in zettels_data:
        app = {
            "zettel_id": card["id"],
            "filename": card["filename"],
            "root_txt": f"slipcase/{card['filename']}",
            "md_mirror": f"slipcase/_MD/{card['md_filename']}",
            "platform": card["platform"],
            "order": card["order"]
        }
        fp.write(json.dumps(app) + "\n")

aliases_path = os.path.join(slipcase_meta_dir, "ALIASES.json")
aliases = {}
for card in zettels_data:
    aliases[card["id"]] = card["filename"]
    aliases[card["name"]] = card["id"]
    aliases[card["citekey"]] = f"source-{card['citekey']}"
with open(aliases_path, "w", encoding="utf-8") as fp:
    json.dump(aliases, fp, indent=2)

print("Finished 01_cards_and_graph.py successfully!")
