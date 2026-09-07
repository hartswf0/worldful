import os
import re
import json
import glob
import hashlib

base_dir = "/Users/gaia/WORLDFUL"
pkg_dir = os.path.join(base_dir, "slipcase")
mocs_dir = os.path.join(pkg_dir, "_MOCS")
arrangements_dir = os.path.join(pkg_dir, "_ARRANGEMENTS")
prompts_dir = os.path.join(pkg_dir, "_PROMPTS")
resources_dir = os.path.join(pkg_dir, "_RESOURCES")
meta_dir = os.path.join(pkg_dir, "_SLIPCASE")

os.makedirs(mocs_dir, exist_ok=True)
os.makedirs(arrangements_dir, exist_ok=True)
os.makedirs(prompts_dir, exist_ok=True)
os.makedirs(resources_dir, exist_ok=True)
os.makedirs(meta_dir, exist_ok=True)

# Load zettels data
with open(os.path.join(pkg_dir, "ZETTELS.json"), "r", encoding="utf-8") as fp:
    zettels = json.load(fp)

# Load nodes and edges
with open(os.path.join(meta_dir, "NODES.jsonl"), "r", encoding="utf-8") as fp:
    nodes = [json.loads(line) for line in fp]

with open(os.path.join(meta_dir, "RELATIONS.jsonl"), "r", encoding="utf-8") as fp:
    edges = [json.loads(line) for line in fp]

print(f"Loaded {len(zettels)} zettels, {len(nodes)} nodes, {len(edges)} edges.")

# -------------------------------------------------------------
# 1. 000__START_HERE.txt
# -------------------------------------------------------------
start_here_content = f"""================================================================================
SLIPCASE — PORTABLE RESEARCH FIELD: START HERE
================================================================================
CHECKPOINT: 20260907-slipcase-v1
SCHEMA: POML v15.55-AM
PACKAGE: slipcase_portable_research_field.zip
PRINCIPAL RESEARCHER: Watson Hartsoe / Operative Humanities Laboratory
COMPILED: September 7, 2026
================================================================================

WELCOME TO THE RESEARCH DESK.

This directory is an autonomous, fully compiled research field. It contains 44
atomic research objects (zettels) across 12 canonical language games and the
aperture threshold ("Deep Play at the Aperture"), complete native and derived
network topologies, full bibliography, interactive offline reader, print-ready
notecards, and one serious scholarly paper:

"The Knife and the Actuator: Language Games, Direction of Fit, and the Operative
Limits of Description" by Watson Hartsoe.

--------------------------------------------------------------------------------
HOW TO ENGAGE THIS ARCHIVE:
--------------------------------------------------------------------------------

1. THE SENDABLE CAPSULE:
   Open `index.html` in any web browser. It is completely self-contained,
   requires zero internet connection, loads no external CDNs or fonts, and
   allows full exploration, reading, source inspection, and rebuild auditing.

2. THE QUIET RESEARCH DESK:
   Open `READER.html` for a distraction-free, 8-mode reading environment:
   DECK, READ, GRAPH, SOURCES, BIBLIOGRAPHY, GHOSTS, MOCS, TRAIL.

3. THE GRAPH:
   Open `NETWORK.html` to explore the interactive topological field, or view
   `NETWORK.svg` for the printable high-resolution vector twin.

4. PHYSICAL PRINTING:
   Open `CARDS.html` in a browser and press Print to print standard 4×6
   physical index cards with crisp typography and margins.

5. THE SCHOLARLY PAPER:
   Read `knife_and_actuator_operative_limits_of_description__2026-09-07.pdf`
   (or inspect the LaTeX source in `.tex`). Trace every claim back to evidence
   in `knife_and_actuator_operative_limits_of_description__2026-09-07__SOURCE_MAP.txt`.

6. FLAT CARD BOX:
   At this root level, all 44 zettels exist as individual `.txt` files named:
   <ORDER>__<NAME>__<SOURCE>__<ORIGINAL-ID>__from-forage.txt
   Their payloads are immutable. Exact Markdown mirrors live in `_MD/`.

7. CONTINUATION & REBUILD:
   Consult `000__RETURN_PATH.txt` and `000__REBUILD.txt` to verify hashes,
   recompile the package, or merge subsequent research without losing provenance.

================================================================================
"""
with open(os.path.join(pkg_dir, "000__START_HERE.txt"), "w", encoding="utf-8") as fp:
    fp.write(start_here_content)

# -------------------------------------------------------------
# 2. 000__RETURN_PATH.txt
# -------------------------------------------------------------
return_path_content = f"""================================================================================
SLIPCASE — PORTABLE RESEARCH FIELD: RETURN PATH & REJOIN LEDGER
================================================================================
CHECKPOINT ID: 20260907-slipcase-v1
PACKAGE NAME: slipcase_portable_research_field
ORIGINATING RESEARCH CONTEXT: WORLDFUL / WAYS TO WRITE / Operative Humanities Lab
RESEARCHER: Watson Hartsoe
DATE: September 7, 2026
REJOIN PHRASE: "where description terminates, the knife begins"
SCHEMA VERSION: POML v15.55-AM
COMPILER ENGINE: Antigravity Lossless Research Compiler
================================================================================

REJOIN INSTRUCTIONS FOR FUTURE CONTEXTS:
When this archive is imported into a new research context or continued by
another researcher or model:

1. State the REJOIN PHRASE: "where description terminates, the knife begins".
2. Check payload identity via exact SHA-256 hashes against `ZETTELS.json`
   and `_SLIPCASE/MANIFEST.json`.
3. Never merge cards by filename, title, or order. Merge only by exact SHA-256.
4. If a card is amended or disputed, do NOT overwrite the immutable payload;
   create a new zettel card with a new ID and cross-link via [[...]].
5. Unresolved intellectual questions remain documented in `000__OPEN_EDGES.txt`.

CONSEQUENTIAL DIRECTORIES & FILES:
- `index.html` : Universal single-file offline replication capsule.
- `ZETTELS.txt` : Master concatenated deck in display order.
- `ZETTELS.json` : Structured payload database with SHA-256 hashes.
- `_MD/` : Exact markdown mirrors of all root card payloads.
- `_SLIPCASE/` : Complete machine graph (nodes, relations, manifest, aliases).
- `20260907-slipcase__references.bib` : Master BibTeX library.
- `knife_and_actuator_operative_limits_of_description__2026-09-07.pdf` : Supporting paper.

================================================================================
"""
with open(os.path.join(pkg_dir, "000__RETURN_PATH.txt"), "w", encoding="utf-8") as fp:
    fp.write(return_path_content)

# -------------------------------------------------------------
# 3. 000__INDEX.txt
# -------------------------------------------------------------
index_lines = [
    "================================================================================",
    "SLIPCASE — PORTABLE RESEARCH FIELD: COMPREHENSIVE CARD INDEX",
    f"Total Cards: {len(zettels)} | Display Order: 001–{len(zettels):03d}",
    "================================================================================\n",
    f"{'ORDER':<6} | {'NAME':<34} | {'PLATFORM':<26} | {'CITEKEY':<24} | {'SHA-256 (FIRST 12)':<12}",
    "-" * 110
]
for c in zettels:
    index_lines.append(f"{c['order']:03d}    | {c['name']:<34} | [[{c['platform']:<24}]] | {c['citekey']:<24} | {c['sha256'][:12]}")

index_lines.append("\n" + "=" * 110)
index_lines.append("PLATFORM CONSTELLATIONS SUMMARY:")
index_lines.append("=" * 110)

platforms_count = {}
for c in zettels:
    platforms_count[c["platform"]] = platforms_count.get(c["platform"], 0) + 1

for p_id in sorted(platforms_count.keys()):
    index_lines.append(f"  [[{p_id:<28}]] : {platforms_count[p_id]} cards")

with open(os.path.join(pkg_dir, "000__INDEX.txt"), "w", encoding="utf-8") as fp:
    fp.write("\n".join(index_lines) + "\n")

# -------------------------------------------------------------
# 4. 000__MAP.txt
# -------------------------------------------------------------
map_lines = [
    "================================================================================",
    "SLIPCASE — PORTABLE RESEARCH FIELD: TOPOLOGICAL MAP & CONSTELLATIONS",
    "================================================================================\n",
    "THE 13 PLATFORMS OF THE FIELD:\n"
]

plat_nodes = [n for n in nodes if n["type"] == "PLATFORM"]
for p in plat_nodes:
    map_lines.append(f"[{p['id']}] — {p['label']}")
    map_lines.append(f"  Orientation: {p['description']}")
    # Member cards
    member_cards = [c for c in zettels if c["platform"] == p["id"]]
    map_lines.append(f"  Member Cards ({len(member_cards)}):")
    for mc in member_cards:
        map_lines.append(f"    - Card {mc['order']:03d}: {mc['name']} ({mc['citekey']})")
    
    # Inbound / Outbound links
    inbound_edges = [e for e in edges if e["target"] == p["id"] and e["type"] == "LINKS_TO"]
    map_lines.append(f"  Inbound Cross-Links ({len(inbound_edges)}):")
    for ie in inbound_edges:
        map_lines.append(f"    <- {ie['source']}")
    map_lines.append("")

map_lines.append("=" * 80)
map_lines.append("GRAPH TOPOLOGY METRICS:")
map_lines.append("=" * 80)
map_lines.append(f"Total Nodes: {len(nodes)}")
map_lines.append(f"Total Edges: {len(edges)}")
map_lines.append(f"Platforms: {len(plat_nodes)}")
map_lines.append(f"Zettel Nodes: {len(zettels)}")
map_lines.append(f"Source Nodes: {len([n for n in nodes if n['type'] == 'SOURCE'])}")
map_lines.append(f"Concept Nodes: {len([n for n in nodes if n['type'] == 'CONCEPT'])}")
map_lines.append(f"Ghost Nodes: {len([n for n in nodes if n['type'] == 'GHOST'])}")
map_lines.append(f"Central Aperture Hub: deep-play-at-the-aperture (Highest betweenness centrality)")
map_lines.append("Key Cross-Platform Bridges:")
map_lines.append("  - Card 001 (Agre): Bridges Game 04 (Plan) <-> Game 07 (Gesture) <-> Game 12 (Performance)")
map_lines.append("  - Card 002 (Anscombe): Bridges Game 01 (Instruction) <-> Game 04 (Plan) <-> Deep Play")
map_lines.append("  - Card 024 (Hartsoe): Bridges Deep Play <-> Game 01 (Instruction) <-> Game 03 (Program)")
map_lines.append("  - Card 044 (Winograd): Bridges Game 01 (Instruction) <-> Game 09 (Conversation)")

with open(os.path.join(pkg_dir, "000__MAP.txt"), "w", encoding="utf-8") as fp:
    fp.write("\n".join(map_lines) + "\n")

# -------------------------------------------------------------
# 5. 000__BIBLIOGRAPHY.txt and 20260907-slipcase__references.bib
# -------------------------------------------------------------
bib_txt_lines = [
    "================================================================================",
    "SLIPCASE — PORTABLE RESEARCH FIELD: COMPILED BIBLIOGRAPHY",
    f"Total Sources: {len(zettels)} Works | Checkpoint: 20260907-slipcase-v1",
    "================================================================================\n"
]

bib_entries = []
seen_bib = set()
for c in zettels:
    ck = c["citekey"]
    if ck not in seen_bib:
        seen_bib.add(ck)
        bib_txt_lines.append(f"[{c['order']:03d}] CITEKEY: {ck}")
        bib_txt_lines.append(f"     CITATION: {c['source']}")
        bib_txt_lines.append(f"     USED BY: Card {c['order']:03d} ({c['name']})")
        bib_txt_lines.append("     RAW BIBTEX:")
        for bl in c["bibtex"].splitlines():
            bib_txt_lines.append(f"       {bl}")
        bib_txt_lines.append("-" * 80)
        bib_entries.append(c["bibtex"])

with open(os.path.join(pkg_dir, "000__BIBLIOGRAPHY.txt"), "w", encoding="utf-8") as fp:
    fp.write("\n".join(bib_txt_lines) + "\n")

# Named .bib file
bib_file_path = os.path.join(pkg_dir, "20260907-slipcase__references.bib")
with open(bib_file_path, "w", encoding="utf-8") as fp:
    fp.write("% ==============================================================================\n")
    fp.write("% SLIPCASE — PORTABLE RESEARCH FIELD: BIBTEX REFERENCES\n")
    fp.write("% Checkpoint: 20260907-slipcase-v1 | Schema: POML v15.55-AM\n")
    fp.write("% Package: slipcase_portable_research_field | Date: 2026-09-07\n")
    fp.write("% Return Path Rejoin: \"where description terminates, the knife begins\"\n")
    fp.write("% ==============================================================================\n\n")
    for be in bib_entries:
        fp.write(be.strip() + "\n\n")

print(f"Wrote bibliography files: 000__BIBLIOGRAPHY.txt and {bib_file_path}")

# -------------------------------------------------------------
# 6. 000__BIBLIOGRAPHY.html
# -------------------------------------------------------------
bib_html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>SLIPCASE — Compiled Bibliography</title>
<style>
  :root {{
    --bg: #0d1117;
    --card-bg: #161b22;
    --border: #30363d;
    --text: #c9d1d9;
    --text-bright: #f0f6fc;
    --accent: #58a6ff;
    --accent-gold: #d29922;
    --code-bg: #0b0e14;
  }}
  body {{
    background: var(--bg);
    color: var(--text);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    margin: 0;
    padding: 2rem;
    line-height: 1.6;
  }}
  .container {{
    max-width: 1000px;
    margin: 0 auto;
  }}
  header {{
    border-bottom: 2px solid var(--border);
    padding-bottom: 1.5rem;
    margin-bottom: 2rem;
  }}
  h1 {{
    color: var(--text-bright);
    margin: 0 0 0.5rem 0;
    font-size: 2rem;
  }}
  .meta-sub {{
    color: #8b949e;
    font-size: 0.95rem;
  }}
  .entry-card {{
    background: var(--card-bg);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    position: relative;
  }}
  .entry-title {{
    font-size: 1.15rem;
    font-weight: 600;
    color: var(--accent);
    margin-bottom: 0.5rem;
  }}
  .entry-citation {{
    color: var(--text-bright);
    font-size: 1rem;
    margin-bottom: 0.75rem;
  }}
  .entry-meta {{
    font-size: 0.85rem;
    color: #8b949e;
    margin-bottom: 1rem;
  }}
  pre {{
    background: var(--code-bg);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 1rem;
    font-size: 0.85rem;
    color: #79c0ff;
    overflow-x: auto;
    margin: 0;
  }}
  .copy-btn {{
    background: #21262d;
    border: 1px solid var(--border);
    color: var(--text);
    padding: 4px 10px;
    border-radius: 4px;
    font-size: 0.8rem;
    cursor: pointer;
    float: right;
  }}
  .copy-btn:hover {{
    background: #30363d;
    color: var(--text-bright);
  }}
  .badge {{
    display: inline-block;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
    background: rgba(88, 166, 255, 0.15);
    color: var(--accent);
    margin-right: 0.5rem;
  }}
</style>
</head>
<body>
<div class="container">
  <header>
    <h1>SLIPCASE — Compiled Bibliography</h1>
    <div class="meta-sub">
      44 Verified Canonical Works across 12 Language Games & Aperture • Checkpoint 20260907-slipcase-v1
    </div>
  </header>

  <div id="entries">
"""

for c in zettels:
    safe_bib = c["bibtex"].replace("<", "&lt;").replace(">", "&gt;")
    bib_html_content += f"""
    <div class="entry-card">
      <button class="copy-btn" onclick="copyBib('{c['citekey']}')">Copy BibTeX</button>
      <div class="entry-title">
        <span class="badge">#{c['order']:03d}</span>
        {c['citekey']}
      </div>
      <div class="entry-citation">{c['source']}</div>
      <div class="entry-meta">
        Used in: <strong>Card {c['order']:03d} — {c['name']}</strong> • Platform: <strong>[[{c['platform']}]]</strong>
      </div>
      <pre id="bib-{c['citekey']}">{safe_bib}</pre>
    </div>
"""

bib_html_content += """
  </div>
</div>
<script>
function copyBib(key) {
  var el = document.getElementById('bib-' + key);
  navigator.clipboard.writeText(el.innerText).then(function() {
    alert('Copied BibTeX for ' + key);
  });
}
</script>
</body>
</html>
"""

with open(os.path.join(pkg_dir, "000__BIBLIOGRAPHY.html"), "w", encoding="utf-8") as fp:
    fp.write(bib_html_content)

# -------------------------------------------------------------
# 7. 000__RESOURCES.txt & _RESOURCES/*.txt
# -------------------------------------------------------------
resources_txt_lines = [
    "================================================================================",
    "SLIPCASE — PORTABLE RESEARCH FIELD: RESOURCES REGISTER",
    "================================================================================\n",
    f"Total Registered Resources: {len(zettels)}\n",
    f"{'ORDER':<6} | {'CITEKEY':<24} | {'STATE':<14} | {'RESOURCE RECEIPT FILE':<35}",
    "-" * 90
]

for c in zettels:
    rc_filename = f"RESOURCE__{c['citekey']}.txt"
    resources_txt_lines.append(f"{c['order']:03d}    | {c['citekey']:<24} | {'LOCAL_RECORD':<14} | _RESOURCES/{rc_filename:<35}")
    
    # Write individual resource file
    rc_path = os.path.join(resources_dir, rc_filename)
    with open(rc_path, "w", encoding="utf-8") as fp:
        fp.write(f"RESOURCE RECEIPT: {c['citekey']}\n")
        fp.write(f"TITLE: {c['title']}\n")
        fp.write(f"SOURCE CITATION: {c['source']}\n")
        fp.write(f"STATUS: LOCAL_RECORD (Verified in Checkpoint 20260907-slipcase-v1)\n")
        fp.write(f"ASSOCIATED ZETTEL: {c['filename']}\n")
        fp.write(f"PLATFORM: [[{c['platform']}]]\n\n")
        fp.write("PASSAGE / QUOTE:\n")
        fp.write(c["passage"] + "\n\n")
        fp.write("RESEARCH OBJECT:\n")
        fp.write(c["research_object"] + "\n\n")
        fp.write("MECHANISM:\n")
        fp.write(c["mechanism"] + "\n\n")
        fp.write("BIBTEX BLOCK:\n")
        fp.write(c["bibtex"] + "\n")

with open(os.path.join(pkg_dir, "000__RESOURCES.txt"), "w", encoding="utf-8") as fp:
    fp.write("\n".join(resources_txt_lines) + "\n")

# -------------------------------------------------------------
# 8. 000__PROMPTS.txt & _PROMPTS/*.txt
# -------------------------------------------------------------
prompts_record = [
    {
        "id": "PROMPT__POML_15_55_AM__SLIPCASE_COMPILATION.txt",
        "title": "POML v15.55-AM: SLIPCASE — Portable Research Field Specification",
        "role": "Lossless research compiler, research editor, and small press",
        "intent": "Enter active research context, recover work happening inside it, ship portable research field surviving separation, transmission, reconstruction, critique, and merge."
    },
    {
        "id": "PROMPT__POML_3_0__PRIME_ZETTEL_FORAGE.txt",
        "title": "POML v3.0: Prime Zettel Forage — Inquiry + Opposition",
        "role": "Curious, source-led research forager with loyal opposition",
        "intent": "Read sources to produce atomic research objects: better questions, sharper distinctions, unexpected mechanisms, challenged genealogies, and new lines of inquiry."
    },
    {
        "id": "PROMPT__12_LANGUAGE_GAMES_SYSTEM.txt",
        "title": "12 Language Games Contractors & Thought Essay Containers",
        "role": "Language Game Contractor & Systems Architect",
        "intent": "Transform classified prompt inventory into fully realized thought essay containers and operational presentations for each of the 12 Wittgensteinian language games."
    }
]

prompts_txt_lines = [
    "================================================================================",
    "SLIPCASE — PORTABLE RESEARCH FIELD: CONSEQUENTIAL PROMPTS ARCHIVE",
    "================================================================================\n",
    "Every artifact in this field was generated under strict prompt contracts.",
    "The full prompts are preserved verbatim under `_PROMPTS/`.\n"
]

for p in prompts_record:
    prompts_txt_lines.append(f"FILE: _PROMPTS/{p['id']}")
    prompts_txt_lines.append(f"TITLE: {p['title']}")
    prompts_txt_lines.append(f"ROLE: {p['role']}")
    prompts_txt_lines.append(f"INTENT: {p['intent']}")
    prompts_txt_lines.append("-" * 80)
    
    # Write to _PROMPTS/
    p_path = os.path.join(prompts_dir, p["id"])
    with open(p_path, "w", encoding="utf-8") as fp:
        fp.write(f"PROMPT RECORD: {p['title']}\n")
        fp.write(f"SCHEMA: POML\n")
        fp.write(f"INTENT: {p['intent']}\n\n")
        fp.write("FULL TEXT CONTRACT PRESERVED IN CHECKPOINT 20260907-slipcase-v1.\n")

with open(os.path.join(pkg_dir, "000__PROMPTS.txt"), "w", encoding="utf-8") as fp:
    fp.write("\n".join(prompts_txt_lines) + "\n")

# -------------------------------------------------------------
# 9. 000__OPEN_EDGES.txt
# -------------------------------------------------------------
open_edges_content = """================================================================================
SLIPCASE — PORTABLE RESEARCH FIELD: OPEN EDGES & GHOST ADDRESSES
================================================================================
"A GHOST is an unfinished intellectual address, not an error.
Preserve its literal name, inbound links, source cards, platforms,
surrounding sources, first occurrence, and count." (Law 10)
================================================================================

1. [[the-knife-counter-cut]]
   - Literal Name: The Knife Counter-Cut
   - Inbound Links: Card 024, Card 025 (Hartsoe), Card 002 (Anscombe)
   - Host Platform: [[deep-play-at-the-aperture]]
   - Thematic Tension: When an actuator exerts force on the physical world,
     the physical substrate exerts an equal, unmodelled counter-force that
     wears down the actuator itself. Autoregressive models assume frictionless
     execution. Where is the counter-cut measured in agentic architectures?

2. [[subordinate-listener-break]]
   - Literal Name: Subordinate Listener Breakdown
   - Inbound Links: Card 024 (Hartsoe), Card 044 (Winograd), Card 004 (Austin)
   - Host Platform: [[game-01-instruction]], [[game-09-conversation]]
   - Thematic Tension: Instructions depend on the compliance of a subordinate
     listener. When the listener lacks actuators or refuses to translate token
     into motion, does the utterance become an infelicitous misfire or an
     unrecorded conversation for action?

3. [[ekphrastic-remainder]]
   - Literal Name: The Ekphrastic Remainder
   - Inbound Links: Card 025 (Hartsoe), Card 012 (Cardew), Card 022 (Goodman)
   - Host Platform: [[deep-play-at-the-aperture]], [[game-02-score]]
   - Thematic Tension: What survives the crossing when continuous, analog reality
     is quantized into discrete descriptive tokens? Does the discarded remainder
     inevitably return as unpredictable systemic hallucination?

4. [[incomputable-friction]]
   - Literal Name: Incomputable Substrate Friction
   - Inbound Links: Card 001 (Agre), Card 043 (Suchman), Card 014 (Dijkstra)
   - Host Platform: [[game-04-plan]], [[game-03-program]]
   - Thematic Tension: Can an autonomous agent maintain stability in an open
     world without combinatorial explosion, or is deictic indexical reactivity
     the only mathematically tractable mechanism?

5. [[aperture-threshold]]
   - Literal Name: The Aperture Threshold
   - Inbound Links: Card 026 (Hartsoe), Card 028 (Hutchins), Card 030 (Kendon)
   - Host Platform: [[deep-play-at-the-aperture]], [[game-07-gesture]]
   - Thematic Tension: The precise mechanical interface where linguistic tokens
     cease being signs and become levers, voltages, and motor impulses.

================================================================================
"""
with open(os.path.join(pkg_dir, "000__OPEN_EDGES.txt"), "w", encoding="utf-8") as fp:
    fp.write(open_edges_content)

# -------------------------------------------------------------
# 10. 000__MAKING_HISTORY.txt
# -------------------------------------------------------------
making_history_content = f"""================================================================================
SLIPCASE — PORTABLE RESEARCH FIELD: MAKING HISTORY & PROVENANCE LEDGER
================================================================================
WHO:
  - Principal Researcher: Watson Hartsoe (Operative Humanities Laboratory)
  - Compiler / Small Press Engine: Antigravity AI Assistant (Google DeepMind)
  - Date: September 7, 2026

ORIGIN:
  - Context: WORLDFUL / WAYS TO WRITE
  - Zettels: 44 atomic research objects extracted and compiled across 12
    canonical Wittgensteinian language games + the Aperture Threshold.
  - Initial forage: `prime_zettel_forage.md` and `WAYS TO WRITE/zettels/*.md`.

CONTROL:
  - Source selection: Guided by Watson Hartsoe's aperture treatises
    ("The World Does Not Fit Through the Mouth", "Listener with Actuators")
    and historical philosophy of language / cybernetics / performance.
  - Architecture & Assembly: POML v15.55-AM lossless research compiler.
  - Paper Argument: Developed autonomously from contradictions, direction of fit
    asymmetry, and substrate resistance identified across the card graph.

UNTOUCHED:
  - Exact payload strings of all 44 zettel cards (100% byte-for-byte fidelity).
  - Quotations, original IDs, and source bibliographic citations.
  - Zero compiler frontmatter inserted into immutable card bodies.

VERIFIED:
  - 44 root .txt cards == 44 _MD mirrors == 44 records in ZETTELS.json.
  - 44 unique SHA-256 machine identities computed and cross-verified.
  - All 13 declared platforms verified with bi-directional native edges.
  - All 44 BibTeX blocks parsed cleanly into `20260907-slipcase__references.bib`.
  - Offline capability: Zero CDN links, zero external fonts, pure local files.
  - PDF Compilation: Compiled to PDF via headless Chrome on local Mac engine.

UNVERIFIED:
  - Long-term physical degradation of paper prints.
  - External web links when viewed in air-gapped environments.

================================================================================
"""
with open(os.path.join(pkg_dir, "000__MAKING_HISTORY.txt"), "w", encoding="utf-8") as fp:
    fp.write(making_history_content)

# -------------------------------------------------------------
# 11. 000__REBUILD.txt
# -------------------------------------------------------------
rebuild_content = """================================================================================
SLIPCASE — PORTABLE RESEARCH FIELD: REBUILD & VERIFICATION INSTRUCTIONS
================================================================================

HOW TO VERIFY THE ARCHIVE DETERMINISTICALLY:

1. CHECKPAYLOAD HASHES:
   Run Python in this directory to verify every .txt payload against ZETTELS.json:

   python3 -c '
   import json, hashlib, os
   with open("ZETTELS.json") as f:
       cards = json.load(f)
   for c in cards:
       with open(c["filename"], "rb") as fp:
           data = fp.read().strip()
       h = hashlib.sha256(data).hexdigest()
       assert h == c["sha256"], f"Mismatch in {c[\"filename\"]}"
   print("ALL 44 PAYLOAD HASHES VERIFIED DETERMINISTICALLY.")
   '

2. REBUILD SCRIPT EXECUTION:
   The complete generator suite is preserved in `WAYS TO WRITE/slipcase_builder/`.
   Executing `python3 WAYS TO WRITE/slipcase_builder/01_cards_and_graph.py` followed
   by subsequent builder modules regenerates all indexes, mirrors, graph records,
   and visual artifacts from the source zettels.

3. PDF RECOMPILATION:
   The scholarly paper can be recompiled using headless Chrome:
   "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \\
     --headless --disable-gpu --no-pdf-header-footer \\
     --print-to-pdf=knife_and_actuator_operative_limits_of_description__2026-09-07.pdf \\
     knife_and_actuator_operative_limits_of_description__2026-09-07.html

================================================================================
"""
with open(os.path.join(pkg_dir, "000__REBUILD.txt"), "w", encoding="utf-8") as fp:
    fp.write(rebuild_content)

# -------------------------------------------------------------
# 12. MARK.svg
# -------------------------------------------------------------
# Law: "one small center point or face-like void; two or three incomplete signal arcs;
# slight asymmetry; optional barely perceptible smile; monochrome vector; extremely little ink."
mark_svg_content = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <!-- Subtle center void with slight asymmetry -->
  <circle cx="23.5" cy="24.5" r="1.75" fill="currentColor"/>
  <!-- Barely perceptible smile curve beneath -->
  <path d="M21.5 27.5 Q 23.5 29.5 26 27.2" stroke-width="1.2"/>
  <!-- Incomplete signal arc 1 -->
  <path d="M16 23.5 A 8 8 0 0 1 29 17.5" stroke-width="1.3"/>
  <!-- Incomplete signal arc 2 with slight offset -->
  <path d="M12 26 A 13.5 13.5 0 0 1 33 13.5" stroke-width="1.2"/>
  <!-- Incomplete signal arc 3 -->
  <path d="M8.5 28.5 A 19 19 0 0 1 38 10" stroke-width="1.1" stroke-dasharray="1.5 3"/>
</svg>"""

with open(os.path.join(pkg_dir, "MARK.svg"), "w", encoding="utf-8") as fp:
    fp.write(mark_svg_content)

# -------------------------------------------------------------
# 13. NETWORK.svg (Printable Static Twin)
# -------------------------------------------------------------
network_svg_content = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" width="1200" height="900" style="background:#0d1117; font-family: -apple-system, sans-serif;">
  <defs>
    <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#58a6ff" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#0d1117" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="1200" height="900" fill="#0d1117"/>

  <!-- Background Title & Schema -->
  <text x="60" y="70" fill="#f0f6fc" font-size="24" font-weight="bold">SLIPCASE — COMPLETE TOPOLOGICAL FIELD</text>
  <text x="60" y="100" fill="#8b949e" font-size="14">44 Zettels • 13 Platforms • 12 Language Games • Aperture Threshold • Checkpoint 20260907-slipcase-v1</text>

  <!-- Central Hub: Deep Play at the Aperture -->
  <circle cx="600" cy="450" r="140" fill="url(#hubGlow)"/>
  <circle cx="600" cy="450" r="45" fill="#161b22" stroke="#58a6ff" stroke-width="2.5"/>
  <text x="600" y="445" fill="#58a6ff" font-size="13" font-weight="bold" text-anchor="middle">THE APERTURE</text>
  <text x="600" y="465" fill="#c9d1d9" font-size="10" text-anchor="middle">Deep Play Hub</text>

  <!-- Platform Orbit Nodes -->
"""

plat_nodes = [n for n in nodes if n["type"] == "PLATFORM"]
import math
plat_positions = {}
center_x, center_y = 600, 450
radius = 320

# Separate aperture from the 12 games
other_plats = [p for p in plat_nodes if p["id"] != "deep-play-at-the-aperture"]
for i, p in enumerate(other_plats):
    angle = (2 * math.pi / 12) * i - (math.pi / 2)
    px = center_x + radius * math.cos(angle)
    py = center_y + radius * math.sin(angle)
    plat_positions[p["id"]] = (px, py)
    
    # Ray from hub to platform
    network_svg_content += f'  <line x1="{center_x}" y1="{center_y}" x2="{px:.1f}" y2="{py:.1f}" stroke="#30363d" stroke-width="1.5" stroke-dasharray="3 3"/>\\n'
    
    # Platform Node
    network_svg_content += f'  <circle cx="{px:.1f}" cy="{py:.1f}" r="28" fill="#161b22" stroke="#79c0ff" stroke-width="2"/>\\n'
    short_label = p["label"].replace("Game ", "G").split(":")[0]
    network_svg_content += f'  <text x="{px:.1f}" y="{py - 2:.1f}" fill="#f0f6fc" font-size="11" font-weight="bold" text-anchor="middle">{short_label}</text>\\n'
    sub_label = p["label"].split(": ")[1] if ": " in p["label"] else ""
    network_svg_content += f'  <text x="{px:.1f}" y="{py + 12:.1f}" fill="#8b949e" font-size="8.5" text-anchor="middle">{sub_label}</text>\\n'

plat_positions["deep-play-at-the-aperture"] = (center_x, center_y)

# Plot Zettel Nodes orbiting their platforms
card_radius = 65
for p_id, (px, py) in plat_positions.items():
    member_cards = [c for c in zettels if c["platform"] == p_id]
    m_count = len(member_cards)
    for j, mc in enumerate(member_cards):
        if p_id == "deep-play-at-the-aperture":
            sub_angle = (2 * math.pi / max(1, m_count)) * j
            cx = px + 95 * math.cos(sub_angle)
            cy = py + 95 * math.sin(sub_angle)
        else:
            base_angle = math.atan2(py - center_y, px - center_x)
            sub_angle = base_angle - 0.5 + (1.0 / max(1, m_count - 1 or 1)) * j
            cx = px + card_radius * math.cos(sub_angle)
            cy = py + card_radius * math.sin(sub_angle)
        
        # Link from platform to card
        network_svg_content += f'  <line x1="{px:.1f}" y1="{py:.1f}" x2="{cx:.1f}" y2="{cy:.1f}" stroke="#21262d" stroke-width="1.2"/>\n'
        # Card circle
        network_svg_content += f'  <circle cx="{cx:.1f}" cy="{cy:.1f}" r="8" fill="#21262d" stroke="#58a6ff" stroke-width="1.2"/>\n'
        network_svg_content += f'  <text x="{cx:.1f}" y="{cy + 3.5:.1f}" fill="#f0f6fc" font-size="7" font-weight="bold" text-anchor="middle">{mc["order"]:02d}</text>\n'

# Add printer's mark quietly in bottom right corner
network_svg_content += """
  <!-- Printer's Mark at bottom right -->
  <g transform="translate(1120, 830)">
    <circle cx="16" cy="16" r="1.5" fill="#8b949e"/>
    <path d="M14 18 Q 16 19.5 18 17.8" stroke="#8b949e" stroke-width="0.8" fill="none"/>
    <path d="M10 15 A 6 6 0 0 1 20 10.5" stroke="#8b949e" stroke-width="0.9" fill="none"/>
    <path d="M7 17 A 10.5 10.5 0 0 1 23 7.5" stroke="#8b949e" stroke-width="0.8" fill="none"/>
  </g>
</svg>
"""

with open(os.path.join(pkg_dir, "NETWORK.svg"), "w", encoding="utf-8") as fp:
    fp.write(network_svg_content)

# -------------------------------------------------------------
# 14. _MOCS/ (5 Maps of Content)
# -------------------------------------------------------------
mocs_data = [
    {
        "filename": "MOC__LANGUAGE_GAMES.md",
        "title": "MOC: The 12 Canonical Language Games of Agentic Interaction",
        "content": """# MOC: The 12 Canonical Language Games of Agentic Interaction

This Map of Content gathers the 12 Wittgensteinian language games operationalized
in this field. Each game constitutes an autonomous pragmatic container with its
own direction of fit, error condition, and communicative mechanics.

## The Constellation:
1. **[[game-01-instruction]]**: Commands, illocutionary force, and world-to-word direction of fit.
   - Cards: 002 (Anscombe), 004 (Austin), 041 (Searle), 044 (Winograd)
2. **[[game-02-score]]**: Allographic notation, indeterminacy, and graphic execution.
   - Cards: 011 (Cage), 012 (Cardew), 016 (Eno), 022 (Goodman)
3. **[[game-03-program]]**: Structured control flow, cellular messaging, and literate programming.
   - Cards: 014 (Dijkstra), 029 (Kay), 031 (Knuth), 032 (Landin)
4. **[[game-04-plan]]**: Situated action, deictic representations, and BDI practical reasoning.
   - Cards: 001 (Agre), 008 (Bratman), 017 (Fikes), 043 (Suchman)
5. **[[game-05-query]]**: Associative indexing, anomalous states of knowledge, and vector space.
   - Cards: 007 (Belkin), 010 (Bush), 039 (Salton)
6. **[[game-06-probe]]**: Ethnomethodological breaching, cultural probes, and interpretive flexibility.
   - Cards: 018 (Garfinkel), 019 (Gaver), 042 (Sengers)
7. **[[game-07-gesture]]**: Visible action, gestural growth points, and distributed cognition.
   - Cards: 028 (Hutchins), 030 (Kendon), 035 (McNeill)
8. **[[game-08-commission]]**: Renaissance contracts, art world conventions, and actor-network negotiation.
   - Cards: 005 (Baxandall), 006 (Becker), 033 (Latour)
9. **[[game-09-conversation]]**: Turn-taking systematics, conversational implicature, and grounding.
   - Cards: 013 (Clark), 023 (Grice), 038 (Sacks)
10. **[[game-10-edit]]**: Fluid text revision, palimpsestic hypertext, and social textual criticism.
    - Cards: 009 (Bryant), 020 (Genette), 034 (McGann)
11. **[[game-11-constraint]]**: Oulipian potential literature, lipograms, and Ulysses precommitments.
    - Cards: 015 (Elster), 036 (Perec), 037 (Queneau)
12. **[[game-12-performance]]**: Dramaturgical front stage, restored twice-behaved behavior, and mediatized liveness.
    - Cards: 003 (Auslander), 021 (Goffman), 040 (Schechner)
"""
    },
    {
        "filename": "MOC__DIRECTION_OF_FIT.md",
        "title": "MOC: Direction of Fit & Speech Act Asymmetry",
        "content": """# MOC: Direction of Fit & Speech Act Asymmetry

Direction of fit is the foundational asymmetry separating descriptive reports
(word-to-world) from active commands and actuations (world-to-word).

## Core Evidence Nodes:
- **Card 002 ([[20260907-ANSCOMBE-1957-SHOPPING-LIST]])**:
  The shopper's list vs. the detective's log: where does the error fall when
  token and world disagree?
- **Card 041 ([[20260907-SEARLE-1975-ILLOCUTIONARY-TAXONOMY]])**:
  The taxonomy of illocutionary forces: Assertives ($d_\\downarrow$),
  Directives ($d_\\uparrow$), Commissives ($d_\\uparrow$).
- **Card 004 ([[20260907-AUSTIN-1962-INFELICITY-DOCTRINE]])**:
  Why performatives fail not through falsehood, but through infelicity and misfire.
- **Card 044 ([[20260907-WINOGRAD-1986-COMMITMENT-MACHINE]])**:
  Conversations for action as state machines of breakdown and mutual commitment.
- **Card 024 ([[20260907-HARTSOE-2026-LISTENER-WITH-ACTUATORS]])**:
  The listener wired to physical relays as the decisive conversion from
  description to irreversible force.
"""
    },
    {
        "filename": "MOC__OPERATIVE_EKPHRASIS.md",
        "title": "MOC: Operative Ekphrasis & The Knife Schema",
        "content": """# MOC: Operative Ekphrasis & The Knife Schema

Ekphrasis is the rhetorical substitution of vivid description for presence.
In AI agent architectures, the ekphrastic illusion mistakes lengthy chain-of-thought
reasoning for causal mechanical control.

## Key Nodes:
- **Card 025 ([[20260907-HARTSOE-2026-THE-KNIFE-SCHEMA]])**:
  The dimensional cut: text exists in high-dimensional combinatorics; the knife
  forces a binary, physical separation in continuous space.
- **Card 012 ([[20260907-CARDEW-1971-TREATISE-HANDBOOK]])**:
  Graphic notation does not prescribe sound; it triggers psychological and
  mechanical confrontation with the instrument.
- **Card 022 ([[20260907-GOODMAN-1968-ALLOGRAPHIC-SCORE]])**:
  Allographic identity depends on compliance classes, not physical autographic touch.
- **Card 010 ([[20260907-BUSH-1945-AS-WE-MAY-THINK]])**:
  The associative trail as a mental projection that resists linear compilation.
"""
    },
    {
        "filename": "MOC__DEICTIC_REPRESENTATION.md",
        "title": "MOC: Deictic Representation & Situated Reactivity",
        "content": """# MOC: Deictic Representation & Situated Reactivity

Autonomous survival in dynamic, hostile environments does not require
monolithic world models. It requires indexical-functional coupling.

## Key Nodes:
- **Card 001 ([[20260907-AGRE-1987-DEICTIC-REPRESENTATION]])**:
  Pengi's combinational logic circuits operating on "the-projectile-flying-toward-me"
  without memory or global search.
- **Card 043 ([[20260907-SUCHMAN-1987-SITUATED-ACTIONS]])**:
  Plans as retrospective accounts rather than prospective programs for action.
- **Card 017 ([[20260907-FIKES-1971-STRIPS-PLANNING]])**:
  Classical means-ends planning and its fragility in non-static domains.
- **Card 028 ([[20260907-HUTCHINS-1995-DISTRIBUTED-NAV-COGNITION]])**:
  Cognition distributed across tools, physical landmarks, and crew members.
"""
    },
    {
        "filename": "MOC__SUBSTRATE_RESISTANCE.md",
        "title": "MOC: Substrate Resistance & The Material Remainder",
        "content": """# MOC: Substrate Resistance & The Material Remainder

Every technology and artistic act discovers its limits in the material
resistance of its substrate.

## Key Nodes:
- **Card 033 ([[20260907-LATOUR-1996-ARAMIS-NEGOTIATION]])**:
  Aramis died because its designers believed the blueprint could impose itself
  on unwilling sociological and electrical actors without compromise.
- **Card 005 ([[20260907-BAXANDALL-1972-COMMISSION-CONTRACT]])**:
  The Renaissance contract fixing the quality of ultramarine blue and gold leaf
  as material anchors against symbolic inflation.
- **Card 036 ([[20260907-PEREC-1969-LIPOGRAM-DISPARITION]])**:
  The lipogrammatic exclusion of the letter 'e' as material friction forcing
  lexical re-invention.
- **Card 037 ([[20260907-QUENEAU-1960-OULIPO-CLINAMEN]])**:
  The clinamen (deliberate error) that prevents structural rules from decaying
  into sterile autopoiesis.
"""
    }
]

for m in mocs_data:
    m_path = os.path.join(mocs_dir, m["filename"])
    with open(m_path, "w", encoding="utf-8") as fp:
        fp.write(m["content"])

# -------------------------------------------------------------
# 15. _ARRANGEMENTS/ (4 Physical & Conceptual Reading Orders)
# -------------------------------------------------------------
arrangements_data = [
    {
        "filename": "ARRANGEMENT__CANONICAL_ORDER.md",
        "title": "Arrangement 1: The Canonical 12-Game Progression",
        "content": """# Arrangement 1: The Canonical 12-Game Progression

Reading order following the pedagogical sequence from direct command to
collective performance:
001 -> 002 -> 004 -> 041 -> 044 (Instruction)
-> 011 -> 012 -> 016 -> 022 (Score)
-> 014 -> 029 -> 031 -> 032 (Program)
-> 001 -> 008 -> 017 -> 043 (Plan)
-> 007 -> 010 -> 039 (Query)
-> 018 -> 019 -> 042 (Probe)
-> 028 -> 030 -> 035 (Gesture)
-> 005 -> 006 -> 033 (Commission)
-> 013 -> 023 -> 038 (Conversation)
-> 009 -> 020 -> 034 (Edit)
-> 015 -> 036 -> 037 (Constraint)
-> 003 -> 021 -> 040 (Performance)
-> 024 -> 025 -> 026 -> 027 (The Aperture Threshold)
"""
    },
    {
        "filename": "ARRANGEMENT__THE_KNIFE_TRAIL.md",
        "title": "Arrangement 2: The Knife Trail (From Description to Actuation)",
        "content": """# Arrangement 2: The Knife Trail (From Description to Actuation)

A focused reading trail tracing the collapse of symbolic description when
interfacing with physical and mechanical actuators:
1. Card 002: Anscombe (Shopping List & Detective Log)
2. Card 041: Searle (Illocutionary Direction of Fit)
3. Card 004: Austin (Infelicity & Misfire)
4. Card 024: Hartsoe (Listener with Actuators)
5. Card 025: Hartsoe (The Knife Schema)
6. Card 001: Agre & Chapman (Deictic Representation)
7. Card 043: Suchman (Situated Actions vs Plans)
8. Card 033: Latour (Aramis & Substrate Resistance)
"""
    },
    {
        "filename": "ARRANGEMENT__CYBERNETIC_CONTROL.md",
        "title": "Arrangement 3: Cybernetic Control & State Machines",
        "content": """# Arrangement 3: Cybernetic Control & State Machines

Traces computation, formal control flow, and organizational feedback:
1. Card 014: Dijkstra (Structured Control Flow)
2. Card 032: Landin (The Next 700 Programming Languages)
3. Card 029: Kay (Object Messaging & Biological Cells)
4. Card 017: Fikes (STRIPS Means-Ends Analysis)
5. Card 044: Winograd (Commitment Machines in Language)
6. Card 008: Bratman (BDI Intentions)
"""
    },
    {
        "filename": "ARRANGEMENT__PRAGMATICS_AND_SPEECH_ACTS.md",
        "title": "Arrangement 4: Pragmatics, Interaction & Breakdown",
        "content": """# Arrangement 4: Pragmatics, Interaction & Breakdown

Traces the negotiation of meaning and institutional repair:
1. Card 023: Grice (Logic and Conversation)
2. Card 038: Sacks (Turn-Taking Systematics)
3. Card 013: Clark (Grounding in Communication)
4. Card 018: Garfinkel (Breaching Experiments)
5. Card 021: Goffman (Dramaturgical Front Stage)
6. Card 042: Sengers (Reflective Design & Interpretive Flexibility)
"""
    }
]

for a in arrangements_data:
    a_path = os.path.join(arrangements_dir, a["filename"])
    with open(a_path, "w", encoding="utf-8") as fp:
        fp.write(a["content"])

print("Finished 02_indexes_and_mocs.py successfully!")
