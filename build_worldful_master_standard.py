import json
import os
import re
from pathlib import Path

from update_readable_book import CHAPTERS
from enhance_books import PRAGMATIC_METADATA
from synthesize_master_edition import extract_lineage, extract_b_specs
from build_infinite_scroll_reader import coordinates

roman_numerals = ["0", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", 
                  "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX",
                  "XXI", "XXII", "XXIII", "XXIV", "XXV", "XXVI", "XXVII", "XXVIII", "XXIX", "XXX",
                  "XXXI", "XXXII", "XXXIII"]

# Master Glossary
glossary_dict = {}
for wid, data in PRAGMATIC_METADATA.items():
    for term, definition in data.get("key_terms", {}).items():
        key = term.strip().lower()
        glossary_dict[key] = {
            "name": term,
            "definition": definition,
            "world_id": wid,
            "world_title": data["title"],
            "category": "Core Invariant"
        }

for wid, cdata in CHAPTERS.items():
    for term in cdata.get("terms", []):
        key = term.strip().lower()
        if key not in glossary_dict:
            glossary_dict[key] = {
                "name": term,
                "definition": f"Operational principle formulated in World {wid:02d}: {cdata['title']}.",
                "world_id": wid,
                "world_title": cdata["title"],
                "category": "Field Principle"
            }

chapters_data = []

for wid in range(34):
    cdata = CHAPTERS[wid]
    img_path = f"readable_book/assets/images/plate_{wid:02d}.png"
    has_img = os.path.exists(img_path)
    
    grounded, literature, code_math = extract_lineage(wid)
    skeleton, assumptions, operational, change_test = extract_b_specs(wid)
    
    # Fluid prose without repetitive headings
    fluid_prose = f"""{cdata['scene'].strip()}

{cdata['mechanism'].strip()}

{cdata['parasite'].strip()}

{cdata['modern'].strip()}

> **{cdata['invariant'].strip()}**
"""

    meta = PRAGMATIC_METADATA.get(wid, {})
    coord_info = coordinates[wid] if wid < len(coordinates) else ("ELEV. 1000m", "LAT 34°N", "FIELD STATION")

    yaml_spec = f"""# FORMAL STATE MACHINE
Theory_Skeleton:
  {skeleton.replace(chr(10), chr(10)+'  ')}

Operational_Execution_Flow:
  {operational.replace(chr(10), chr(10)+'  ')}

Invariant_Validation_Test:
  {change_test.replace(chr(10), chr(10)+'  ')}
"""

    chapters_data.append({
        "id": wid,
        "roman": roman_numerals[wid],
        "title": cdata["title"],
        "subtitle": cdata["subtitle"],
        "invariant": cdata["invariant"],
        "prose": fluid_prose,
        "terms": cdata.get("terms", []),
        "has_img": has_img,
        "img_src": img_path,
        "coords": coord_info,
        "thinkers": literature,
        "ancestry": grounded,
        "computational": code_math,
        "yaml_spec": yaml_spec,
        "core_problem": meta.get("core_problem", ""),
        "decision_rule": meta.get("decision_rule", "")
    })

chapters_json = json.dumps(chapters_data, ensure_ascii=False)
glossary_json = json.dumps(glossary_dict, ensure_ascii=False)

favicon_svg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%23ebe6da'/%3E%3Ccircle cx='16' cy='16' r='14' fill='none' stroke='%239e2318' stroke-width='1.5' stroke-dasharray='3,2'/%3E%3Cpath d='M10 22 C14 14 20 12 24 10 C22 15 18 20 12 23 Z' fill='%239e2318'/%3E%3Ccircle cx='22' cy='11' r='1' fill='%23211d18'/%3E%3C/svg%3E"

html_code = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<title>WORLDFUL PRESS — Atlas, Archive, Field Station</title>
<link rel="icon" type="image/svg+xml" href="{favicon_svg}">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;600&family=Courier+Prime:ital,wght@0,400;0,700;1,400&family=IBM+Plex+Mono:ital,wght@0,400;0,500;0,700;1,400&family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;1,6..72,400&family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400&display=swap" rel="stylesheet">

<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>

<style>
  :root {{
    --paper:    #ebe6da;
    --paper-hi: #f3efe5;
    --paper-lo: #ddd5c4;
    --scrap:    #dcd2ba;
    --ink:      #211d18;
    --ink-soft: #57503f;
    --ink-faint:#8a8170;
    --red:      #9e2318;
    --tape:     rgba(199,178,132,.55);
    --hair:     rgba(33,29,24,.25);
    --hair-faint: rgba(33,29,24,.12);
    
    --display: "Playfair Display", "Didot", "Bodoni MT", Georgia, serif;
    --serif:   "Newsreader", "Georgia", "Times New Roman", serif;
    --mono:    "IBM Plex Mono", "Courier Prime", ui-monospace, monospace;
    --hand:    "Caveat", cursive, sans-serif;
  }}

  * {{ margin:0; padding:0; box-sizing:border-box; }}
  html {{ background:#b6ac9b; scroll-behavior:smooth; }}
  body {{
    font-family:var(--serif);
    color:var(--ink);
    background:var(--paper);
    min-height:100vh;
    overflow-x:hidden;
    -webkit-font-smoothing:antialiased;
  }}

  /* Grain + Vignette Texture */
  body::after {{
    content:""; position:fixed; inset:0; z-index:70; pointer-events:none; opacity:.45; mix-blend-mode:multiply;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='matrix' values='0 0 0 0 0.45 0 0 0 0 0.42 0 0 0 0 0.36 0 0 0 0.26 0'/></filter><rect width='220' height='220' filter='url(%23n)'/></svg>");
  }}
  body::before {{
    content:""; position:fixed; inset:0; z-index:69; pointer-events:none;
    background:radial-gradient(120% 120% at 50% 40%,transparent 55%,rgba(60,50,35,.15) 100%);
  }}

  /* Scrollbar */
  ::-webkit-scrollbar {{ width: 6px; height: 6px; }}
  ::-webkit-scrollbar-track {{ background: var(--paper); border-left: 1px solid var(--hair-faint); }}
  ::-webkit-scrollbar-thumb {{ background: var(--ink-faint); border-radius: 2px; }}
  ::-webkit-scrollbar-thumb:hover {{ background: var(--red); }}

  #progress-line {{
    position: fixed;
    top: 0; left: 0;
    height: 3px;
    background: var(--red);
    width: 0%;
    z-index: 1000;
    transition: width 0.1s ease-out;
  }}

  .sheet {{
    position:relative;
    max-width:1480px;
    margin:0 auto;
    background:radial-gradient(90% 60% at 70% 8%,rgba(255,255,255,.35),transparent 60%),var(--paper);
    box-shadow:0 0 60px rgba(40,32,20,.35);
    padding-bottom:3rem;
    min-height:100vh;
  }}

  /* ---------- Archival Photo Treatment ---------- */
  .ph {{ position:relative; overflow:hidden; background:var(--paper-lo); }}
  .ph img {{
    display:block; width:100%; height:100%; object-fit:cover;
    mix-blend-mode:multiply;
    filter:grayscale(1) sepia(.28) contrast(1.04) brightness(1.02);
  }}
  .ph::after {{
    content:""; position:absolute; inset:0; pointer-events:none;
    background:radial-gradient(120% 120% at 50% 45%,transparent 60%,rgba(48,38,22,.25) 100%);
  }}
  .mapimg img {{
    filter:grayscale(1) sepia(.5) contrast(.95) brightness(1.06);
    mix-blend-mode:multiply;
  }}
  .frame {{
    background:#f0ebde; padding:9px 9px 10px;
    box-shadow:3px 5px 12px rgba(40,32,18,.35);
  }}
  .tape {{
    position:absolute; width:84px; height:24px; background:var(--tape);
    box-shadow:0 1px 2px rgba(60,45,20,.25); z-index:5; mix-blend-mode:multiply;
  }}
  .torn {{ filter:drop-shadow(2px 3px 4px rgba(40,32,18,.26)); }}
  .torn-clip {{
    clip-path:polygon(2% 3%,9% 0,22% 2%,37% 0,52% 3%,66% 1%,81% 3%,93% 0,100% 5%,99% 22%,100% 41%,98% 58%,100% 74%,98% 90%,94% 100%,79% 98%,63% 100%,48% 97%,31% 100%,16% 98%,4% 100%,0 88%,2% 71%,0 52%,2% 33%,0 15%);
  }}

  /* ---------- Marginalia ---------- */
  .marginalia {{ position:absolute; inset:0; pointer-events:none; z-index:6; }}
  .m-vert {{
    position:absolute; font-family:var(--mono); font-size:.6rem; letter-spacing:.28em; color:var(--ink-soft);
    writing-mode:vertical-rl; transform:rotate(180deg);
  }}
  .m-vert.coord {{ left:1.1rem; top:6rem; }}
  .m-vert.archive {{ left:1.1rem; bottom:14rem; }}
  .cross {{ position:absolute; width:24px; height:24px; }}
  .cross::before,.cross::after {{ content:""; position:absolute; background:var(--ink-soft); }}
  .cross::before {{ left:50%; top:0; width:1px; height:100%; }}
  .cross::after {{ top:50%; left:0; height:1px; width:100%; }}
  .cross i {{ position:absolute; inset:5px; border:1px solid var(--ink-soft); border-radius:50%; }}
  .cross.tl {{ left:2rem; top:4.6rem; }}
  .cross.bl {{ left:2rem; bottom:20rem; }}
  .plus {{ position:absolute; color:var(--red); font-family:var(--mono); font-size:1.1rem; }}
  .plus.p1 {{ right:24%; top:6.5%; }}
  .plus.p2 {{ right:2%; bottom:24%; }}

  /* ---------- Header ---------- */
  header.site-header {{
    position:sticky; top:0; z-index:100;
    display:flex; align-items:center; justify-content:space-between;
    gap:1.6rem; padding:1.2rem 3.2rem 1.2rem 5rem;
    background:rgba(235, 230, 218, 0.96);
    border-bottom:1px solid var(--hair);
    backdrop-filter:blur(8px);
  }}
  .brand-block {{ text-decoration:none; color:inherit; cursor:pointer; }}
  .brand-block .name {{ font-family:var(--mono); font-size:.72rem; font-weight:700; letter-spacing:.22em; white-space:nowrap; }}
  .brand-block .sub {{ font-family:var(--mono); font-size:.55rem; letter-spacing:.22em; color:var(--ink-soft); margin-top:.35rem; white-space:nowrap; }}
  
  nav.main-nav-bar {{ display:flex; gap:2.8rem; }}
  nav.main-nav-bar a {{
    font-family:var(--mono); font-size:.66rem; letter-spacing:.24em; color:var(--ink); text-decoration:none;
    position:relative; padding-bottom:.3rem; white-space:nowrap; cursor:pointer; font-weight:600;
  }}
  nav.main-nav-bar a::after {{
    content:""; position:absolute; left:0; bottom:0; height:1px; width:0; background:var(--red); transition:width .25s ease;
  }}
  nav.main-nav-bar a.active::after, nav.main-nav-bar a:hover::after {{ width:100%; }}
  nav.main-nav-bar a.active, nav.main-nav-bar a:hover {{ color:var(--red); }}

  .search-button {{
    display:flex; align-items:center; gap:.5rem; font-family:var(--mono); font-size:.64rem; letter-spacing:.2em;
    color:var(--ink); background:none; border:none; cursor:pointer;
  }}
  .search-button .dot {{ width:6px; height:6px; border-radius:50%; background:var(--red); margin-left:.4rem; }}

  /* ============ VIEW ROUTER SECTIONS ============ */
  .view-panel-tab {{ display:none; position:relative; z-index:10; }}
  .view-panel-tab.active {{ display:block; }}

  /* ---------- Hero ---------- */
  .hero {{
    position:relative; z-index:10; padding:2rem 3.2rem 1rem 5rem; min-height:680px;
  }}
  .hero-left {{ position:relative; z-index:8; max-width:620px; padding-left:7.5rem; }}
  h1.main-masthead {{
    font-family:var(--display); font-weight:500; font-size:clamp(3.6rem,10.5vw,10rem);
    letter-spacing:.04em; line-height:.94; text-shadow:0 0 1px rgba(33,29,24,.45);
  }}
  .tick {{ width:34px; height:3px; background:var(--red); margin:1.7rem 0 1.2rem; }}
  .thesis {{ font-family:var(--mono); font-size:clamp(.9rem,1.6vw,1.3rem); letter-spacing:.32em; line-height:1.75; font-weight:600; max-width:34ch; }}
  .lede {{ font-size:1.2rem; line-height:1.55; margin-top:1.9rem; max-width:22ch; }}
  .cta {{
    display:inline-flex; align-items:center; gap:1.3rem; margin-top:2.3rem; padding:1rem 1.9rem;
    border:1.5px solid var(--red); color:var(--red); font-family:var(--mono); font-size:.76rem; letter-spacing:.3em;
    text-decoration:none; background:rgba(255,255,255,.14); cursor:pointer; font-weight:700; transition:background .25s,color .25s;
  }}
  .cta svg line,.cta svg path {{ stroke:currentColor; }}
  .cta:hover,.cta:focus-visible {{ background:var(--red); color:var(--paper-hi); }}

  .piece {{ position:absolute; }}

  /* Moai Strip (Torn) */
  .moai-strip {{ left:-.6rem; top:9rem; width:180px; height:340px; z-index:4; transform:rotate(-.6deg); }}
  .moai-strip .ph {{ width:100%; height:100%; }}
  .moai-strip .cap {{
    position:absolute; left:0; right:0; bottom:-1.5rem; font-family:var(--mono); font-size:.5rem;
    letter-spacing:.22em; color:var(--ink-faint);
  }}

  /* Map scrap behind left column */
  .map-left {{ left:3rem; top:27rem; width:250px; height:190px; z-index:2; opacity:.9; transform:rotate(1.2deg); }}
  .map-left .ph {{ width:100%; height:100%; }}

  /* Bird Specimen Photo */
  .bird {{ left:53%; top:5.6rem; width:190px; z-index:9; transform:rotate(1.6deg); }}
  .bird .ph {{ height:170px; }}
  .bird .tape {{ left:50%; top:-12px; transform:translateX(-50%) rotate(-3deg); }}
  .bird .cap {{ font-family:var(--mono); font-size:.5rem; letter-spacing:.2em; color:var(--ink-soft); padding-top:.5rem; text-align:center; }}

  /* Field Note */
  .fieldnote {{
    left:52.5%; top:21rem; width:220px; z-index:8; transform:rotate(-.8deg);
    background:linear-gradient(160deg,var(--paper-hi),#e7e0cf); padding:1.1rem 1.2rem 1rem;
    box-shadow:2px 4px 10px rgba(40,32,18,.3);
  }}
  .fieldnote .label {{ font-family:var(--mono); font-size:.55rem; letter-spacing:.26em; color:var(--ink-soft); }}
  .fieldnote .hand {{ font-family:var(--hand); font-size:1.15rem; line-height:1.45; margin-top:.7rem; color:#33302a; }}
  .fieldnote .dl {{ font-family:var(--mono); font-size:.53rem; letter-spacing:.26em; color:var(--ink-soft); margin-top:1rem; }}
  .fieldnote .dv {{ font-family:var(--hand); font-size:1.05rem; margin-top:.3rem; }}

  /* Valley Photo */
  .valley {{ left:71%; top:8.6rem; width:280px; z-index:7; transform:rotate(.7deg); }}
  .valley .ph {{ height:230px; }}
  .valley .tape {{ left:50%; top:-13px; transform:translateX(-50%) rotate(-2deg); }}
  .valley .cap {{ font-family:var(--mono); font-size:.5rem; letter-spacing:.2em; color:var(--ink-soft); padding-top:.55rem; display:flex; justify-content:space-between; }}

  /* Plate Card */
  .plate {{
    right:1.6rem; top:5.2rem; width:180px; z-index:6; background:linear-gradient(170deg,#efe9da,#e2dac6);
    padding:1rem; box-shadow:2px 3px 8px rgba(40,32,18,.28);
  }}
  .plate h4 {{ font-size:.9rem; font-weight:600; }}
  .plate .row {{ font-size:.66rem; letter-spacing:.06em; margin-top:.45rem; color:var(--ink-soft); }}
  .plate .scale {{ font-size:.58rem; margin-top:.8rem; color:var(--ink-soft); }}

  /* Right Map Strip */
  .map-strip {{ right:0; top:19rem; width:230px; height:330px; z-index:2; opacity:.95; }}
  .map-strip .ph {{ width:100%; height:100%; }}

  /* Circular Map Lens */
  .map-lens {{
    right:12rem; top:21rem; width:140px; height:140px; z-index:7; border-radius:50%; overflow:hidden;
    box-shadow:2px 3px 8px rgba(40,32,18,.3); border:1px solid var(--ink-faint);
  }}
  .map-lens .ph {{ width:100%; height:100%; }}
  .map-lens svg {{ position:absolute; inset:0; z-index:2; }}

  /* Station Data */
  .station {{
    right:2rem; top:41rem; z-index:6; font-family:var(--mono); font-size:.6rem; letter-spacing:.14em;
    color:var(--ink-soft); line-height:1.45;
  }}
  .station b {{ display:block; color:var(--ink); font-weight:400; margin-bottom:.5rem; }}
  .station div {{ margin-bottom:.5rem; }}

  /* Tracks Card */
  .tracks {{ left:11rem; top:37rem; width:300px; z-index:6; transform:rotate(-1.2deg); }}
  .tracks .inner {{ background:linear-gradient(150deg,#efe9d8,#ddd2b8); padding:1rem 1.3rem 1.2rem; }}
  .tracks .cols {{ display:flex; justify-content:space-between; gap:.8rem; }}
  .tracks .col {{ text-align:center; flex:1; }}
  .tracks .col span {{ font-family:var(--mono); font-size:.52rem; letter-spacing:.22em; color:var(--ink-soft); display:block; margin-bottom:.55rem; }}
  .tracks svg {{ height:52px; display:block; margin:0 auto; }}

  /* Stamp */
  .stamp {{ left:25rem; top:40rem; width:145px; z-index:7; transform:rotate(-8deg); }}
  .stamp svg {{ width:100%; display:block; opacity:.85; }}

  /* Language Scrap */
  .lang-scrap {{ left:6rem; top:44rem; width:220px; z-index:5; transform:rotate(1.4deg); }}
  .lang-scrap .inner {{
    background:linear-gradient(150deg,#e6dfcd,#d6cbb0); padding:1.15rem 1.4rem;
    font-size:.82rem; line-height:1.6; color:var(--ink-soft); text-align:center; font-style:italic;
  }}

  /* Dashed Route Lines */
  .route {{ position:absolute; inset:0; z-index:5; pointer-events:none; }}
  .route path {{ fill:none; stroke-width:1.6; stroke-dasharray:7 6; }}
  .route .dark {{ stroke:#3a352c; }}
  .route .redln {{ stroke:var(--red); }}
  @media (prefers-reduced-motion:no-preference){{
    .route path {{ animation:march 40s linear infinite; }}
    @keyframes march {{ to {{ stroke-dashoffset:-1000; }} }}
  }}

  /* ---------- Worlds 34-Card Grid ---------- */
  .worlds {{
    position:relative; z-index:10; margin:2rem 2.2rem 0; padding:2rem 1.2rem 0 3rem; border-top:1px solid var(--hair);
  }}
  .worlds-head {{ display:flex; align-items:baseline; gap:1.3rem; flex-wrap:wrap; }}
  .worlds-head h2 {{ font-family:var(--mono); font-size:1rem; letter-spacing:.32em; font-weight:700; }}
  .worlds-head .mark {{ color:var(--red); font-family:var(--mono); font-size:1.1rem; }}
  .worlds-head em {{ font-style:italic; font-size:.9rem; color:var(--ink-soft); }}
  .viewall {{
    margin-left:auto; font-family:var(--mono); font-size:.6rem; letter-spacing:.24em; color:var(--ink);
    text-decoration:none; display:flex; align-items:center; gap:.7rem; cursor:pointer;
  }}
  .viewall:hover {{ color:var(--red); }}

  .world-grid {{ display:grid; grid-template-columns:repeat(4,1fr); gap:1.6rem; margin-top:1.8rem; }}
  .world {{
    position:relative; border:1px solid var(--hair); text-decoration:none; color:var(--ink);
    background:linear-gradient(165deg,rgba(255,255,255,.35),rgba(255,255,255,0) 40%),var(--paper-hi);
    display:flex; flex-direction:column; transition:transform .3s ease,box-shadow .3s ease;
    cursor:pointer;
  }}
  .world:hover,.world:focus-visible {{ transform:translateY(-4px); box-shadow:0 10px 24px rgba(40,32,18,.2); }}
  .world .top {{ padding:1.4rem 1.3rem 1.1rem; }}
  .world .numeral {{ font-family:var(--display); font-size:2.8rem; line-height:1; font-weight:500; }}
  .world .num-tick {{ width:26px; height:2px; background:var(--red); margin:.65rem 0 .75rem; }}
  .world h3 {{ font-family:var(--mono); font-size:.7rem; letter-spacing:.18em; line-height:1.8; font-weight:700; max-width:20ch; }}
  .world .fig {{ margin-top:auto; position:relative; height:190px; }}
  .world .fig .ph {{ position:absolute; inset:0; }}
  .world .cap {{
    position:absolute; left:.8rem; bottom:.6rem; z-index:3; font-family:var(--mono); font-size:.48rem;
    letter-spacing:.2em; color:var(--paper-hi); text-shadow:0 1px 2px rgba(0,0,0,.6);
  }}

  /* ============ FULL MONOGRAPH READER MODAL ============ */
  #reader-overlay-view {{
    display:none; position:fixed; inset:0; z-index:200;
    background:var(--paper); overflow-y:auto;
  }}
  .reader-header-bar {{
    position:sticky; top:0; z-index:10;
    display:flex; justify-content:space-between; align-items:center;
    padding:12px 36px; background:rgba(235, 230, 218, 0.96);
    border-bottom:1px solid var(--hair); backdrop-filter:blur(8px);
  }}
  .reader-layout {{
    max-width:1440px; margin:0 auto;
    display:grid; grid-template-columns:260px 1fr;
    border-top:1px solid var(--hair);
    position:relative;
  }}
  .reader-nav-col {{
    border-right:1px solid var(--hair);
    height:calc(100vh - 54px); position:sticky; top:54px;
    overflow-y:auto; padding:12px; background:var(--paper);
  }}
  .reader-main-col {{
    padding:40px 60px 180px; background:var(--paper);
  }}

  .monograph-world-block {{
    padding-bottom:80px; margin-bottom:70px; border-bottom:1px solid var(--hair);
  }}
  .monograph-archival-header {{
    display:flex; justify-content:space-between; align-items:center;
    font-family:var(--mono); font-size:.68rem; letter-spacing:.2em; color:var(--ink-soft);
    text-transform:uppercase; border-bottom:1px dashed var(--hair); padding-bottom:8px; margin-bottom:16px;
  }}
  
  .monograph-hero-plate-box {{
    width:100%; margin:12px 0 24px; position:relative;
  }}
  .monograph-plate-image {{
    width:100%; max-width:960px; display:block;
    mix-blend-mode:multiply;
    -webkit-mask-image:radial-gradient(ellipse at center, rgba(0,0,0,1) 88%, rgba(0,0,0,0) 100%);
    mask-image:radial-gradient(ellipse at center, rgba(0,0,0,1) 88%, rgba(0,0,0,0) 100%);
    filter:contrast(106%) brightness(99%);
  }}

  .monograph-invariant-box {{
    background:var(--paper-hi); border-left:3px solid var(--red);
    padding:12px 18px; margin-bottom:28px; font-family:var(--mono); font-size:.82rem; line-height:1.55;
  }}
  .monograph-invariant-box strong {{
    color:var(--red); display:block; letter-spacing:.12em; font-size:.74rem; margin-bottom:3px;
  }}

  .monograph-prose-text {{
    max-width:800px; font-family:var(--serif); font-size:1.16rem; line-height:1.95; color:var(--ink);
    text-align:justify; hyphens:auto;
  }}
  .monograph-prose-text p {{ margin-bottom:22px; text-indent:1.8em; }}
  .monograph-prose-text p:first-of-type {{ text-indent:0; }}
  .monograph-prose-text blockquote {{
    border-left:3px solid var(--red); padding:14px 20px; background:var(--paper-hi);
    margin:28px 0; font-style:italic; font-size:1.18rem; text-indent:0;
  }}

  /* Inline Concept Chips / Hyperlinks */
  .concept-link {{
    color:var(--red); text-decoration:underline; text-decoration-style:dashed; cursor:pointer;
  }}
  .concept-link:hover {{
    background:var(--paper-hi); text-decoration-style:solid;
  }}

  /* ============ SLIDE-OUT MARGINALIA SIDE DRAWER ============ */
  #side-marginalia-drawer {{
    position:fixed; top:54px; right:-420px; width:400px; height:calc(100vh - 54px);
    background:var(--paper-hi); border-left:1px solid var(--red);
    box-shadow:-6px 0 28px rgba(33,29,24,.18); padding:24px; z-index:350;
    overflow-y:auto; transition:right .3s ease;
  }}
  #side-marginalia-drawer.open {{ right:0; }}

  /* ============ OTHER CONTENT PANELS ============ */
  .content-page-panel {{
    padding:3rem 5.4rem 5rem; max-width:1100px; margin:0 auto;
  }}
  .panel-title-h1 {{
    font-family:var(--display); font-size:3.2rem; font-weight:700; letter-spacing:.02em; margin-bottom:.8rem;
  }}
  .panel-intro-lede {{
    font-family:var(--serif); font-size:1.3rem; line-height:1.6; color:var(--ink-soft); margin-bottom:2.5rem;
  }}

  /* Search Modal */
  #search-modal-overlay {{
    display:none; position:fixed; inset:0; z-index:300;
    background:rgba(33,29,24,.65); backdrop-filter:blur(4px);
    align-items:flex-start; justify-content:center; padding-top:10vh;
  }}
  .search-box-modal {{
    background:var(--paper); border:1px solid var(--red);
    width:90%; max-width:680px; box-shadow:0 20px 50px rgba(0,0,0,.35); padding:24px;
  }}
  .search-input-field {{
    width:100%; background:var(--paper-hi); border:1px solid var(--ink-soft);
    padding:12px 16px; font-family:var(--mono); font-size:1rem; outline:none; color:var(--ink);
  }}

  /* Footer */
  footer {{
    position:relative; z-index:10; margin:3.2rem 2.2rem 0; padding:1.3rem 1rem 0 3rem; border-top:1px solid var(--hair);
    display:flex; justify-content:space-between; gap:1.5rem; flex-wrap:wrap;
    font-family:var(--mono); font-size:.54rem; letter-spacing:.2em; color:var(--ink-soft); line-height:1.8;
  }}

  @media (max-width:960px) {{
    .marginalia {{ display:none; }}
    header.site-header {{ padding:1.2rem 1.2rem; flex-wrap:wrap; }}
    nav.main-nav-bar {{ order:3; width:100%; gap:0; justify-content:space-between; border-top:1px solid var(--hair); padding-top:.8rem; }}
    .hero {{ display:flex; flex-direction:column; padding:1.6rem 1.2rem; min-height:0; }}
    .hero-left {{ padding-left:0; max-width:none; }}
    .world-grid {{ grid-template-columns:1fr; gap:1.4rem; }}
    .reader-nav-col {{ display:none; }}
    .reader-main-col {{ padding:20px 14px; }}
    #side-marginalia-drawer {{ width:100%; right:-100%; }}
  }}
</style>
</head>
<body>
<div class="sheet">
  <div id="progress-line"></div>

  <div class="marginalia" aria-hidden="true">
    <span class="m-vert coord">23.9847&#176; N</span>
    <span class="m-vert archive">ARCHIVE NO. WF-23-A</span>
    <span class="cross tl"><i></i></span>
    <span class="cross bl"><i></i></span>
    <span class="plus p1">+</span>
    <span class="plus p2">+</span>
  </div>

  <header class="site-header">
    <a class="brand-block" onclick="switchMainTab('worlds')">
      <div class="name">WORLDFUL PRESS</div>
      <div class="sub">ATLAS, ARCHIVE, FIELD STATION</div>
    </a>
    <nav class="main-nav-bar" aria-label="Primary">
      <a onclick="switchMainTab('worlds')" id="nav-worlds" class="active">WORLDS</a>
      <a onclick="switchMainTab('crossings')" id="nav-crossings">CROSSINGS</a>
      <a onclick="switchMainTab('traces')" id="nav-traces">TRACES</a>
      <a onclick="switchMainTab('index')" id="nav-index">INDEX</a>
      <a onclick="switchMainTab('about')" id="nav-about">ABOUT</a>
    </nav>
    <button class="search-button" type="button" onclick="openSearchModal()">
      <span>SEARCH</span>
      <svg width="14" height="14" viewBox="0 0 15 15" fill="none" stroke="#211d18" stroke-width="1.4">
        <circle cx="6.2" cy="6.2" r="4.6"/><line x1="9.8" y1="9.8" x2="14" y2="14"/>
      </svg>
      <span class="dot"></span>
    </button>
  </header>

  <!-- ==================== VIEW 1: WORLDS (HERO + 34 CARDS) ==================== -->
  <div id="tab-worlds-view" class="view-panel-tab active">

    <section class="hero">
      <svg class="route" viewBox="0 0 1400 780" preserveAspectRatio="none" aria-hidden="true">
        <path class="dark" d="M560 505 C 640 475 660 435 700 425 C 760 410 780 435 830 405 C 880 375 900 345 940 335"/>
        <path class="redln" d="M940 335 C 990 325 1010 350 1060 345 C 1110 340 1130 360 1180 375"/>
        <path class="redln" d="M120 630 C 135 570 105 530 135 480 C 160 440 145 390 130 350" opacity=".8"/>
      </svg>

      <div class="hero-left">
        <h1 class="main-masthead">WORLDFUL</h1>
        <div class="tick"></div>
        <p class="thesis">THE WORLD DOES NOT FIT THROUGH THE MOUTH</p>
        <p class="lede">The world is full of more than I can say. This is what crossed.</p>
        <a class="cta" onclick="openReaderAtWorld(0)">
          ENTER A WORLD
          <svg width="34" height="12" viewBox="0 0 34 12" fill="none" stroke-width="1.5">
            <line x1="0" y1="6" x2="31" y2="6"/><path d="M25 1 L 32 6 L 25 11" fill="none"/>
          </svg>
        </a>
      </div>

      <!-- Moai Strip -->
      <div class="piece moai-strip torn">
        <div class="ph torn-clip">
          <img src="readable_book/assets/images/plate_01.png" alt="Moai Stone Heads">
        </div>
        <div class="cap">FIG. 1 — TURNED HEADS</div>
      </div>

      <!-- Map Left -->
      <div class="piece map-left torn">
        <div class="ph mapimg torn-clip">
          <img src="readable_book/assets/images/plate_00.png" alt="Dufour Survey Map">
        </div>
      </div>

      <!-- Bird -->
      <div class="piece bird">
        <span class="tape"></span>
        <div class="frame">
          <div class="ph">
            <img src="readable_book/assets/images/plate_33.png" alt="Summer Tanager Specimen">
          </div>
          <div class="cap">SPECIMEN — PIRANGA RUBRA</div>
        </div>
      </div>

      <!-- Field Note -->
      <div class="piece fieldnote">
        <div class="label">FIELD NOTE</div>
        <div class="hand">Wind from the S.<br>Closed valley.<br>No names here.<br>Only crossings.</div>
        <div class="dl">DATE</div>
        <div class="dv">12. IV. 23</div>
      </div>

      <!-- Valley Photo -->
      <div class="piece valley">
        <span class="tape"></span>
        <div class="frame">
          <div class="ph">
            <img src="readable_book/assets/images/plate_27.png" alt="The Closed Valley">
          </div>
          <div class="cap"><span>THE CLOSED VALLEY</span><span>PL. 27</span></div>
        </div>
      </div>

      <!-- Plate Card -->
      <div class="piece plate">
        <h4>PLATE 27.</h4>
        <div class="row">S. LAT. 34&#176;&#8211;36&#176;</div>
        <div class="row">W. LONG. 68&#176;&#8211;70&#176;</div>
        <div class="scale">Scale 1 : 1,000,000<br>Kilometres</div>
      </div>

      <!-- Map Strip -->
      <div class="piece map-strip torn">
        <div class="ph mapimg torn-clip">
          <img src="readable_book/assets/images/plate_08.png" alt="Brienz Survey Strip">
        </div>
      </div>

      <!-- Map Lens -->
      <div class="piece map-lens" aria-hidden="true">
        <div class="ph mapimg">
          <img src="readable_book/assets/images/plate_08.png" alt="" style="object-position:30% 60%">
        </div>
        <svg viewBox="0 0 140 140" fill="none">
          <circle cx="70" cy="70" r="68" stroke="#8a8170" stroke-width="1.5"/>
          <path d="M18 96 C 46 80 74 88 102 64 C 116 53 126 50 134 44" stroke="#9e2318" stroke-width="1.5" stroke-dasharray="6 5"/>
          <circle cx="70" cy="70" r="2.5" fill="#9e2318"/>
        </svg>
      </div>

      <!-- Station Data -->
      <div class="piece station">
        <div><b>ELEV.</b>1738.2 m</div>
        <div><b>TEMP.</b>12.4 &#176;C</div>
        <div><b>WIND.</b>SSW 14 km/h</div>
        <div><b>AIR.</b>DRY</div>
      </div>

      <!-- Tracks Card -->
      <div class="piece tracks torn">
        <div class="inner torn-clip">
          <div class="cols">
            <div class="col"><span>RED DEER</span>
              <svg viewBox="0 0 60 56" fill="#211d18">
                <path d="M18 6 C 24 6 26 16 25 30 C 24.5 40 22 48 18 48 C 14 48 12 40 11.5 30 C 11 16 12 6 18 6 Z"/>
                <path d="M42 6 C 48 6 49 16 48.5 30 C 48 40 46 48 42 48 C 38 48 35.5 40 35 30 C 34 16 36 6 42 6 Z"/>
              </svg></div>
            <div class="col"><span>FOX</span>
              <svg viewBox="0 0 60 56" fill="#211d18">
                <ellipse cx="30" cy="40" rx="11" ry="9"/><ellipse cx="17" cy="24" rx="5" ry="7"/>
                <ellipse cx="43" cy="24" rx="5" ry="7"/><ellipse cx="26" cy="14" rx="4.6" ry="6.6"/>
                <ellipse cx="36" cy="14" rx="4.6" ry="6.6"/>
              </svg></div>
            <div class="col"><span>RAVEN</span>
              <svg viewBox="0 0 60 56" fill="none" stroke="#211d18" stroke-width="3" stroke-linecap="round">
                <line x1="30" y1="52" x2="30" y2="10"/><line x1="30" y1="26" x2="12" y2="8"/>
                <line x1="30" y1="26" x2="48" y2="8"/><line x1="30" y1="44" x2="40" y2="54"/>
              </svg></div>
          </div>
        </div>
      </div>

      <!-- Stamp -->
      <div class="piece stamp" aria-hidden="true">
        <svg viewBox="0 0 150 150">
          <defs>
            <path id="cT" d="M75,75 m-52,0 a52,52 0 1,1 104,0"/>
            <path id="cB" d="M75,75 m-52,0 a52,52 0 1,0 104,0"/>
          </defs>
          <circle cx="75" cy="75" r="66" fill="none" stroke="#9e2318" stroke-width="2.4"/>
          <circle cx="75" cy="75" r="40" fill="none" stroke="#9e2318" stroke-width="1.2"/>
          <text font-family="'Courier New',monospace" font-size="11" letter-spacing="3" fill="#9e2318">
            <textPath href="#cT" startOffset="8%">WORLDFUL PRESS</textPath></text>
          <text font-family="'Courier New',monospace" font-size="8.5" letter-spacing="2" fill="#9e2318">
            <textPath href="#cB" startOffset="12%">ATLAS &#183; ARCHIVE &#183; FIELD STATION</textPath></text>
          <text x="75" y="86" text-anchor="middle" font-family="Georgia,serif" font-size="30" fill="#9e2318">WF</text>
        </svg>
      </div>

      <!-- Language Scrap -->
      <div class="piece lang-scrap torn">
        <div class="inner torn-clip">language breaks<br>where the world<br>continues.</div>
      </div>
    </section>

    <!-- 34 WORLDS GRID -->
    <section class="worlds" id="worlds">
      <div class="worlds-head">
        <h2>WORLDS</h2><span class="mark">+</span>
        <em>Places imagined.&nbsp; Crossings remembered.</em>
        <a class="viewall" onclick="openReaderAtWorld(0)">VIEW ALL WORLDS &rarr;</a>
      </div>

      <div class="world-grid" id="world-34-cards-target">
        <!-- Injected via JS -->
      </div>
    </section>
  </div>

  <!-- ==================== VIEW 2: CROSSINGS ==================== -->
  <div id="tab-crossings-view" class="view-panel-tab">
    <div class="content-page-panel">
      <h1 class="panel-title-h1">THE FIVE CROSSINGS</h1>
      <p class="panel-intro-lede">How physical terrain passes through human mouths, marks, and systems of coordination.</p>
      
      <div style="display:grid; gap:24px; margin-top:30px;">
        <div style="background:var(--paper-hi); border-left:3px solid var(--red); padding:22px;">
          <h3 style="font-family:var(--mono); font-size:.95rem; color:var(--red); letter-spacing:.1em; margin-bottom:6px;">01. ENTER &bull; THE UNCOMPRESSED ENCOUNTER</h3>
          <p style="font-size:1.05rem; line-height:1.75;">The physical world sprawling in raw sensory resolution: wolf tracks in the switchgrass, mud temperature, wind velocity, and unmeasured friction.</p>
        </div>
        <div style="background:var(--paper-hi); border-left:3px solid var(--red); padding:22px;">
          <h3 style="font-family:var(--mono); font-size:.95rem; color:var(--red); letter-spacing:.1em; margin-bottom:6px;">02. OBSERVE &bull; MATERIAL RESISTANCE</h3>
          <p style="font-size:1.05rem; line-height:1.75;">The irreducible friction that resists flattery. Soil that refuses to obey the manifesto, isotopes in the bones, and tools that rust.</p>
        </div>
        <div style="background:var(--paper-hi); border-left:3px solid var(--red); padding:22px;">
          <h3 style="font-family:var(--mono); font-size:.95rem; color:var(--red); letter-spacing:.1em; margin-bottom:6px;">03. DESCRIBE &bull; THE LOSSY CUT</h3>
          <p style="font-size:1.05rem; line-height:1.75;">Selecting which single relation will travel while dropping ninety-nine percent of the terrain. Description travels only by what it leaves behind.</p>
        </div>
        <div style="background:var(--paper-hi); border-left:3px solid var(--red); padding:22px;">
          <h3 style="font-family:var(--mono); font-size:.95rem; color:var(--red); letter-spacing:.1em; margin-bottom:6px;">04. COMPRESS &bull; THE SIGN MACHINE</h3>
          <p style="font-size:1.05rem; line-height:1.75;">Transforming human bodily encounters into portable nouns, legal clauses, coordinate maps, database schemas, and model token weights.</p>
        </div>
        <div style="background:var(--paper-hi); border-left:3px solid var(--red); padding:22px;">
          <h3 style="font-family:var(--mono); font-size:.95rem; color:var(--red); letter-spacing:.1em; margin-bottom:6px;">05. RELEASE &bull; PORTABLE CONSEQUENCE</h3>
          <p style="font-size:1.05rem; line-height:1.75;">The microscopic trace traveling across centuries and borders to direct armies, build cathedrals, or crash financial markets.</p>
        </div>
      </div>
    </div>
  </div>

  <!-- ==================== VIEW 3: TRACES ==================== -->
  <div id="tab-traces-view" class="view-panel-tab">
    <div class="content-page-panel">
      <h1 class="panel-title-h1">MATERIAL TRACES</h1>
      <p class="panel-intro-lede">Physical residues that anchor symbolic claims to material reality.</p>
      
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:20px;">
        <div style="border:1px solid var(--hair); background:var(--paper-hi); padding:20px;">
          <h4 style="font-family:var(--mono); font-size:.85rem; color:var(--red); letter-spacing:.1em; margin-bottom:6px;">CANIS LUPUS TRACKS</h4>
          <p style="font-size:.95rem; line-height:1.65; color:var(--ink-soft);">Six wet commas in the switchgrass that redirected a child's trajectory over the pass before speech began.</p>
        </div>
        <div style="border:1px solid var(--hair); background:var(--paper-hi); padding:20px;">
          <h4 style="font-family:var(--mono); font-size:.85rem; color:var(--red); letter-spacing:.1em; margin-bottom:6px;">THE POINTING FINGER</h4>
          <p style="font-size:.95rem; line-height:1.65; color:var(--ink-soft);">The root of deixis. Whoever captures joint attention owns the interpretive horizon of the room.</p>
        </div>
        <div style="border:1px solid var(--hair); background:var(--paper-hi); padding:20px;">
          <h4 style="font-family:var(--mono); font-size:.85rem; color:var(--red); letter-spacing:.1em; margin-bottom:6px;">THE INVISIBLE HAMMER</h4>
          <p style="font-size:.95rem; line-height:1.65; color:var(--ink-soft);">A working tool remains phenomenologically transparent; only when the steel fractures do we notice the tool.</p>
        </div>
        <div style="border:1px solid var(--hair); background:var(--paper-hi); padding:20px;">
          <h4 style="font-family:var(--mono); font-size:.85rem; color:var(--red); letter-spacing:.1em; margin-bottom:6px;">FORENSIC ISOTOPES</h4>
          <p style="font-size:.95rem; line-height:1.65; color:var(--ink-soft);">Strontium ratios in the enamel that remember where the body actually drank, indifferent to the passport.</p>
        </div>
      </div>
    </div>
  </div>

  <!-- ==================== VIEW 4: INDEX ==================== -->
  <div id="tab-index-view" class="view-panel-tab">
    <div class="content-page-panel">
      <h1 class="panel-title-h1">MASTER CONCEPT INDEX</h1>
      <p class="panel-intro-lede">102 Defined Operational Invariants and Theoretical Lineages.</p>
      
      <input type="text" id="index-filter-input" placeholder="Filter terms (e.g. Deixis, Goodhart, Tacit Knowledge)..." 
             style="width:100%; background:var(--paper-hi); border:1px solid var(--ink-soft); padding:10px 14px; font-family:var(--mono); font-size:.95rem; margin-bottom:24px; outline:none;">
      
      <div id="index-cards-target" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(300px, 1fr)); gap:16px;">
        <!-- Injected via JS -->
      </div>
    </div>
  </div>

  <!-- ==================== VIEW 5: ABOUT ==================== -->
  <div id="tab-about-view" class="view-panel-tab">
    <div class="content-page-panel">
      <h1 class="panel-title-h1">ABOUT WORLDFUL</h1>
      <p class="panel-intro-lede">A Field Treatise on the Epistemic Tragedy of Description.</p>
      
      <div style="font-family:var(--serif); font-size:1.15rem; line-height:1.9; color:var(--ink);">
        <p style="margin-bottom:20px;">Human beings survive by converting vast physical realities into compact, portable tokens. A sentence keeps the wolf and drops the wind direction; keeps the danger and drops ten thousand blades of grass.</p>
        <p style="margin-bottom:20px;">The catastrophe begins when institutions forget that the sign was cut. They mistreat the dashboard for the territory, the legal definition for the human grief, and the database schema for the landscape.</p>
        <blockquote style="border-left:3px solid var(--red); padding:14px 20px; background:var(--paper-hi); margin:30px 0; font-style:italic;">
          "The world does not fit through the mouth. The world is full of more than I can say. This is what crossed."
        </blockquote>
      </div>
    </div>
  </div>

  <footer>
    <span>WORLDFUL PRESS &#183; ATLAS, ARCHIVE, FIELD STATION &#183; SHEET WF-23-A</span>
    <span>34 PLATES &bull; SURVEYED IV.23 &bull; THE ABSENT THING</span>
  </footer>
</div>

<!-- ==================== MONOGRAPH STREAM READER MODAL ==================== -->
<div id="reader-overlay-view">
  <div class="reader-header-bar">
    <div style="display:flex; align-items:center; gap:16px;">
      <button class="cta" onclick="closeReaderModal()" style="margin-top:0; padding:6px 14px; font-size:.65rem; min-width:0;">
        &larr; ATLAS FLOOR
      </button>
      <div style="font-family:var(--mono); font-size:.75rem; font-weight:700; color:var(--red);" id="reader-top-plate-label">
        PLATE 0 &bull; THE CROSSING
      </div>
    </div>
    <div style="font-family:var(--mono); font-size:.65rem; color:var(--ink-soft); letter-spacing:.2em;">
      TYPEWRITER FIELD MONOGRAPH
    </div>
  </div>

  <div class="reader-layout">
    <aside class="reader-nav-col" id="reader-nav-target">
      <!-- Injected via JS -->
    </aside>

    <main class="reader-main-col" id="reader-main-target">
      <!-- 34 Articles Injected via JS -->
    </main>
  </div>
</div>

<!-- ==================== SLIDE-OUT MARGINALIA SIDE DRAWER ==================== -->
<div id="side-marginalia-drawer">
  <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--hair); padding-bottom:8px; margin-bottom:14px;">
    <div style="font-family:var(--mono); font-size:.8rem; color:var(--red); font-weight:700;" id="drawer-term-name">TERM</div>
    <button onclick="closeSideMarginalia()" style="background:none; border:none; font-size:20px; cursor:pointer; color:var(--ink-soft);">&times;</button>
  </div>
  
  <div style="font-family:var(--serif); font-size:.98rem; line-height:1.6; color:var(--ink); margin-bottom:16px;" id="drawer-term-desc">
    Definition.
  </div>

  <div style="border-top:1px dashed var(--hair); padding-top:14px; margin-top:14px;">
    <div style="font-family:var(--mono); font-size:.68rem; color:var(--red); font-weight:700; letter-spacing:.15em; margin-bottom:4px;">PHILOSOPHICAL LINEAGE</div>
    <div style="font-family:var(--serif); font-size:.88rem; color:var(--ink-soft);" id="drawer-thinkers-info">—</div>
  </div>

  <div style="border-top:1px dashed var(--hair); padding-top:14px; margin-top:14px;">
    <div style="font-family:var(--mono); font-size:.68rem; color:var(--red); font-weight:700; letter-spacing:.15em; margin-bottom:4px;">MATERIAL ANCESTRY</div>
    <div style="font-family:var(--serif); font-size:.88rem; color:var(--ink-soft);" id="drawer-ancestry-info">—</div>
  </div>

  <div style="border-top:1px dashed var(--hair); padding-top:14px; margin-top:14px;">
    <div style="font-family:var(--mono); font-size:.68rem; color:var(--red); font-weight:700; letter-spacing:.15em; margin-bottom:4px;">FORMAL STATE SPEC</div>
    <pre style="background:var(--paper); padding:8px; font-family:var(--mono); font-size:.68rem; border-left:2px solid var(--red); white-space:pre-wrap; margin-top:6px;" id="drawer-yaml-spec"># Spec</pre>
  </div>
</div>

<!-- ==================== SEARCH MODAL ==================== -->
<div id="search-modal-overlay" onclick="handleSearchOverlayClick(event)">
  <div class="search-box-modal" onclick="event.stopPropagation()">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
      <span style="font-family:var(--mono); font-size:.75rem; color:var(--red); font-weight:700; letter-spacing:.2em;">ATLAS SEARCH DISPATCH</span>
      <span style="font-family:var(--mono); font-size:.65rem; color:var(--ink-soft);">[ESC TO CLOSE]</span>
    </div>
    <input type="text" id="global-search-box" class="search-input-field" placeholder="Search worlds, concepts, thinkers, or invariants...">
    <div id="search-results-target" style="max-height:400px; overflow-y:auto; margin-top:16px;">
      <!-- Injected via JS -->
    </div>
  </div>
</div>

<script>
  const CHAPTERS = {chapters_json};
  const GLOSSARY = {glossary_json};
  let currentReaderId = 0;

  function init() {{
    render34Cards();
    renderMonographStream();
    renderReaderNav();
    renderIndexTab();
    setupSearch();
    setupProgressBar();

    document.addEventListener('keydown', (e) => {{
      if (e.key === 'Escape') {{
        closeSearchModal();
        closeSideMarginalia();
      }}
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {{
        e.preventDefault();
        openSearchModal();
      }}
    }});
  }}

  function switchMainTab(tabKey) {{
    document.querySelectorAll('.view-panel-tab').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('nav.main-nav-bar a').forEach(a => a.classList.remove('active'));

    const targetPanel = document.getElementById(`tab-${{tabKey}}-view`);
    if (targetPanel) targetPanel.classList.add('active');

    const targetNav = document.getElementById(`nav-${{tabKey}}`);
    if (targetNav) targetNav.classList.add('active');

    window.scrollTo({{ top: 0, behavior: 'smooth' }});
  }}

  /* ============ RENDER 34 BOOK CARDS IN EXACT ARCHIVAL FORMAT ============ */
  function render34Cards() {{
    const target = document.getElementById('world-34-cards-target');
    target.innerHTML = CHAPTERS.map(ch => `
      <a class="world" onclick="openReaderAtWorld(${{ch.id}})">
        <div class="top">
          <div class="numeral">${{ch.roman}}</div>
          <div class="num-tick"></div>
          <h3>${{ch.title}}</h3>
        </div>
        <div class="fig">
          <div class="ph">
            <img src="${{ch.img_src}}" alt="Plate ${{ch.roman}} Lithograph" loading="lazy">
          </div>
          <span class="cap">${{ch.subtitle}}</span>
        </div>
      </a>
    `).join('');
  }}

  /* ============ RENDER NATIVE MONOGRAPH STREAM ============ */
  function renderMonographStream() {{
    const stream = document.getElementById('reader-main-target');
    stream.innerHTML = CHAPTERS.map(ch => {{
      let parsed = marked.parse(ch.prose);

      // Convert concepts into interactive side-drawer hyperlinks
      ch.terms.forEach(t => {{
        const reg = new RegExp(`\\\\b(${{t}})\\\\b`, 'gi');
        parsed = parsed.replace(reg, `<span class="concept-link" onclick="openConceptSideDrawer('${{t.replace(/'/g, "\\\\\\'")}}', ${{ch.id}})">$1</span>`);
      }});

      return `
        <article class="monograph-world-block" id="monograph-block-${{ch.id}}" data-id="${{ch.id}}">
          <div class="monograph-archival-header">
            <span>PLATE ${{ch.roman}} &bull; ARCHIVE NO. WF-23-${{String.fromCharCode(65 + (ch.id % 26))}}</span>
            <span>${{ch.coords[0]}} &bull; ${{ch.coords[1]}}</span>
          </div>

          <div class="monograph-hero-plate-box">
            <img src="${{ch.img_src}}" alt="Plate ${{ch.roman}} Field Document" class="monograph-plate-image" loading="lazy">
          </div>

          <div class="monograph-invariant-box">
            <strong>SYSTEM INVARIANT:</strong>
            ${{ch.invariant}}
          </div>

          <div class="monograph-prose-text">
            ${{parsed}}
          </div>

          <div style="margin-top:24px; display:flex; flex-wrap:wrap; gap:8px; align-items:center;">
            <span style="font-family:var(--mono); font-size:.65rem; color:var(--ink-soft); letter-spacing:.15em;">CONCEPTS:</span>
            ${{ch.terms.map(t => `
              <button onclick="openConceptSideDrawer('${{t.replace(/'/g, "\\\\\\'")}}', ${{ch.id}})" style="background:var(--paper-hi); border:1px solid var(--hair); padding:3px 8px; font-family:var(--mono); font-size:.72rem; color:var(--red); cursor:pointer;">
                ${{t}}
              </button>
            `).join('')}}
          </div>
        </article>
      `;
    }}).join('');
  }}

  function renderReaderNav() {{
    const bar = document.getElementById('reader-nav-target');
    bar.innerHTML = CHAPTERS.map(ch => `
      <div onclick="jumpReaderToId(${{ch.id}})" style="padding:8px 10px; border-bottom:1px solid var(--hair); cursor:pointer; display:flex; gap:8px;" id="reader-side-link-${{ch.id}}">
        <span style="font-family:var(--mono); font-size:.7rem; font-weight:700; color:var(--red); min-width:22px;">${{ch.roman}}</span>
        <span style="font-family:var(--mono); font-size:.7rem; font-weight:700; text-transform:uppercase;">${{ch.title}}</span>
      </div>
    `).join('');
  }}

  function renderIndexTab() {{
    const container = document.getElementById('index-cards-target');
    const searchInput = document.getElementById('index-filter-input');

    function updateIndex(q = '') {{
      const keys = Object.keys(GLOSSARY).sort();
      const filtered = keys.filter(k => k.includes(q.toLowerCase()) || GLOSSARY[k].definition.toLowerCase().includes(q.toLowerCase()));
      container.innerHTML = filtered.map(k => {{
        const item = GLOSSARY[k];
        return `
          <div style="background:var(--paper-hi); border:1px solid var(--hair); padding:16px; cursor:pointer;" onclick="openReaderAtWorld(${{item.world_id}})">
            <div style="font-family:var(--mono); font-size:.8rem; font-weight:700; color:var(--red); margin-bottom:4px;">${{item.name}}</div>
            <div style="font-family:var(--serif); font-size:.92rem; line-height:1.55; color:var(--ink);">${{item.definition}}</div>
            <div style="font-family:var(--mono); font-size:.65rem; color:var(--ink-soft); margin-top:8px;">FORMULATED IN: WORLD ${{item.world_id}} &bull; ${{item.world_title}} &rarr;</div>
          </div>
        `;
      }}).join('');
    }}

    updateIndex();
    searchInput.addEventListener('input', (e) => updateIndex(e.target.value));
  }}

  /* ============ SIDE MARGINALIA DRAWER (SLIDE OUT FROM RIGHT) ============ */
  function openConceptSideDrawer(rawTerm, wid) {{
    const key = rawTerm.toLowerCase().trim();
    let item = GLOSSARY[key];
    if (!item) {{
      for (let k in GLOSSARY) {{
        if (k.includes(key) || key.includes(k)) {{ item = GLOSSARY[k]; break; }}
      }}
    }}

    const ch = CHAPTERS.find(c => c.id === (wid !== undefined ? wid : (item ? item.world_id : 0)));
    
    document.getElementById('drawer-term-name').innerText = item ? item.name : rawTerm;
    document.getElementById('drawer-term-desc').innerText = item ? item.definition : "Operational field invariant under active investigation.";
    document.getElementById('drawer-thinkers-info').innerText = ch ? (ch.thinkers || "Field station notes.") : "—";
    document.getElementById('drawer-ancestry-info').innerText = ch ? (ch.ancestry || "Material traces.") : "—";
    document.getElementById('drawer-yaml-spec').innerText = ch ? (ch.yaml_spec || "# Spec") : "#";

    document.getElementById('side-marginalia-drawer').classList.add('open');
  }}

  function closeSideMarginalia() {{
    document.getElementById('side-marginalia-drawer').classList.remove('open');
  }}

  /* ============ READER ACTIONS ============ */
  function openReaderAtWorld(id) {{
    document.getElementById('reader-overlay-view').style.display = 'block';
    jumpReaderToId(id);
    setupReaderScrollSpy();
  }}

  function closeReaderModal() {{
    document.getElementById('reader-overlay-view').style.display = 'none';
    closeSideMarginalia();
  }}

  function jumpReaderToId(id) {{
    currentReaderId = id;
    const target = document.getElementById(`monograph-block-${{id}}`);
    if (target) {{
      target.scrollIntoView({{ behavior: 'smooth' }});
      updateReaderTopLabel(id);
    }}
  }}

  function updateReaderTopLabel(id) {{
    const ch = CHAPTERS.find(c => c.id === id);
    if (!ch) return;
    document.getElementById('reader-top-plate-label').innerText = `PLATE ${{ch.roman}} \u2022 ${{ch.title}}`;

    document.querySelectorAll('#reader-nav-target > div').forEach(d => d.style.background = 'none');
    const activeSide = document.getElementById(`reader-side-link-${{id}}`);
    if (activeSide) {{
      activeSide.style.background = 'var(--paper-hi)';
      activeSide.scrollIntoView({{ block: 'nearest', behavior: 'smooth' }});
    }}
  }}

  function setupReaderScrollSpy() {{
    const blocks = document.querySelectorAll('.monograph-world-block');
    const observer = new IntersectionObserver((entries) => {{
      entries.forEach(entry => {{
        if (entry.isIntersecting) {{
          const id = parseInt(entry.target.getAttribute('data-id'));
          updateReaderTopLabel(id);
        }}
      }});
    }}, {{ rootMargin: "-15% 0px -75% 0px" }});
    blocks.forEach(b => observer.observe(b));
  }}

  /* ============ SEARCH ENGINE ============ */
  function setupSearch() {{
    const input = document.getElementById('global-search-box');
    const target = document.getElementById('search-results-target');

    input.addEventListener('input', (e) => {{
      const q = e.target.value.toLowerCase().trim();
      if (!q) {{ target.innerHTML = ''; return; }}

      let results = [];
      CHAPTERS.forEach(ch => {{
        if (ch.title.toLowerCase().includes(q) || ch.subtitle.toLowerCase().includes(q) || ch.invariant.toLowerCase().includes(q) || (ch.thinkers && ch.thinkers.toLowerCase().includes(q))) {{
          results.push({{
            type: 'World Plate',
            title: `Plate ${{ch.roman}}: ${{ch.title}}`,
            snippet: ch.subtitle || ch.invariant,
            action: () => {{ closeSearchModal(); openReaderAtWorld(ch.id); }}
          }});
        }}
      }});

      for (let k in GLOSSARY) {{
        const item = GLOSSARY[k];
        if (k.includes(q) || item.definition.toLowerCase().includes(q)) {{
          results.push({{
            type: 'Concept Invariant',
            title: item.name,
            snippet: item.definition,
            action: () => {{ closeSearchModal(); openConceptSideDrawer(item.name, item.world_id); }}
          }});
        }}
      }}

      target.innerHTML = results.slice(0, 10).map((r, i) => `
        <div style="padding:10px 14px; border-bottom:1px solid var(--hair); cursor:pointer;" onclick="executeSearchAction(${{i}})">
          <div style="font-family:var(--mono); font-size:.65rem; color:var(--ink-soft);">${{r.type}}</div>
          <div style="font-family:var(--mono); font-size:.85rem; font-weight:700; color:var(--red);">${{r.title}}</div>
          <div style="font-family:var(--serif); font-size:.9rem; color:var(--ink-soft); margin-top:4px;">${{r.snippet}}</div>
        </div>
      `).join('');

      window._searchResults = results;
    }});
  }}

  function executeSearchAction(idx) {{
    if (window._searchResults && window._searchResults[idx]) {{
      window._searchResults[idx].action();
    }}
  }}

  function openSearchModal() {{
    document.getElementById('search-modal-overlay').style.display = 'flex';
    document.getElementById('global-search-box').focus();
  }}

  function closeSearchModal() {{
    document.getElementById('search-modal-overlay').style.display = 'none';
  }}

  function handleSearchOverlayClick(e) {{
    if (e.target.id === 'search-modal-overlay') closeSearchModal();
  }}

  function setupProgressBar() {{
    window.addEventListener('scroll', () => {{
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      document.getElementById('progress-line').style.width = scrolled + "%";
    }});
  }}

  window.onload = init;
</script>
</body>
</html>
"""

with open("index.html", "w", encoding="utf-8") as f:
    f.write(html_code)

with open("reader.html", "w", encoding="utf-8") as f:
    f.write(html_code)

print(f"Master WORLDFUL Press Application generated ({len(html_code):,} bytes)")
