import os
import re
import json

base_dir = "/Users/gaia/WORLDFUL"
pkg_dir = os.path.join(base_dir, "slipcase")
meta_dir = os.path.join(pkg_dir, "_SLIPCASE")

# Load zettels, nodes, relations
with open(os.path.join(pkg_dir, "ZETTELS.json"), "r", encoding="utf-8") as fp:
    zettels = json.load(fp)

with open(os.path.join(meta_dir, "NODES.jsonl"), "r", encoding="utf-8") as fp:
    nodes = [json.loads(line) for line in fp]

with open(os.path.join(meta_dir, "RELATIONS.jsonl"), "r", encoding="utf-8") as fp:
    edges = [json.loads(line) for line in fp]

print(f"Generating interactive views with {len(zettels)} zettels...")

# -------------------------------------------------------------
# 1. NETWORK.html (Interactive Topology Desk)
# -------------------------------------------------------------
# We create a self-contained HTML file with embedded nodes & edges,
# canvas/SVG interactive graph layout, node filtering, search, and details pane.
network_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>SLIPCASE — Interactive Topological Field</title>
<style>
  :root {{
    --bg: #090d13;
    --panel-bg: #131822;
    --border: #262e3d;
    --text: #c9d1d9;
    --text-bright: #f0f6fc;
    --accent: #58a6ff;
    --accent-gold: #d29922;
    --accent-green: #3fb950;
    --card-bg: #1c2333;
  }}
  * {{ box-sizing: border-box; margin: 0; padding: 0; }}
  body {{
    background: var(--bg);
    color: var(--text);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    display: flex;
    height: 100vh;
    overflow: hidden;
  }}
  #graph-container {{
    flex: 1;
    height: 100%;
    position: relative;
    background: radial-gradient(circle at center, #111827 0%, #090d13 100%);
  }}
  #sidebar {{
    width: 380px;
    height: 100%;
    background: var(--panel-bg);
    border-left: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    z-index: 10;
  }}
  header {{
    padding: 1.25rem;
    border-bottom: 1px solid var(--border);
  }}
  h1 {{
    font-size: 1.15rem;
    color: var(--text-bright);
    margin-bottom: 0.25rem;
  }}
  .subtitle {{
    font-size: 0.8rem;
    color: #8b949e;
  }}
  #search-box {{
    padding: 0.75rem 1.25rem;
    border-bottom: 1px solid var(--border);
  }}
  #search-input {{
    width: 100%;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 8px 12px;
    color: var(--text-bright);
    font-size: 0.85rem;
    outline: none;
  }}
  #search-input:focus {{
    border-color: var(--accent);
  }}
  #filter-bar {{
    display: flex;
    gap: 6px;
    padding: 8px 1.25rem;
    border-bottom: 1px solid var(--border);
    overflow-x: auto;
    font-size: 0.75rem;
  }}
  .filter-chip {{
    background: #21262d;
    padding: 4px 8px;
    border-radius: 12px;
    cursor: pointer;
    white-space: nowrap;
    border: 1px solid transparent;
  }}
  .filter-chip.active {{
    border-color: var(--accent);
    color: var(--accent);
    background: rgba(88,166,255,0.1);
  }}
  #details {{
    flex: 1;
    overflow-y: auto;
    padding: 1.25rem;
  }}
  .empty-state {{
    color: #8b949e;
    font-size: 0.85rem;
    line-height: 1.5;
  }}
  .detail-card {{
    background: var(--card-bg);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 1rem;
  }}
  .detail-order {{
    display: inline-block;
    padding: 2px 6px;
    background: rgba(88,166,255,0.2);
    color: var(--accent);
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }}
  .detail-title {{
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-bright);
    margin-bottom: 0.75rem;
    line-height: 1.4;
  }}
  .detail-meta {{
    font-size: 0.8rem;
    color: #8b949e;
    margin-bottom: 0.75rem;
  }}
  .detail-meta strong {{ color: var(--text); }}
  .detail-body {{
    font-size: 0.85rem;
    color: var(--text);
    line-height: 1.6;
    margin-bottom: 1rem;
    max-height: 250px;
    overflow-y: auto;
    background: rgba(0,0,0,0.2);
    padding: 8px;
    border-radius: 4px;
    font-family: monospace;
    white-space: pre-wrap;
  }}
  .badge-row {{
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 0.5rem;
  }}
  .badge {{
    font-size: 0.75rem;
    padding: 3px 8px;
    border-radius: 4px;
    background: #21262d;
    color: #79c0ff;
    text-decoration: none;
  }}
  svg {{
    width: 100%;
    height: 100%;
    cursor: grab;
  }}
  svg:active {{
    cursor: grabbing;
  }}
  .node {{
    cursor: pointer;
    transition: r 0.2s, stroke 0.2s;
  }}
  .node:hover {{
    r: 10;
  }}
  .node-label {{
    font-size: 9px;
    fill: #8b949e;
    pointer-events: none;
    text-anchor: middle;
  }}
  .edge {{
    stroke: #21262d;
    stroke-width: 1;
  }}
  .edge.highlighted {{
    stroke: var(--accent);
    stroke-width: 2;
  }}
  .platform-node {{
    fill: #161b22;
    stroke: var(--accent-gold);
    stroke-width: 2.5;
  }}
  .zettel-node {{
    fill: #21262d;
    stroke: var(--accent);
    stroke-width: 1.5;
  }}
  .ghost-node {{
    fill: #161b22;
    stroke: #f85149;
    stroke-width: 1.5;
    stroke-dasharray: 2 2;
  }}
  .hub-node {{
    fill: #1f6feb;
    stroke: #ffffff;
    stroke-width: 3;
  }}
  #legend {{
    position: absolute;
    bottom: 20px;
    left: 20px;
    background: rgba(19, 24, 34, 0.85);
    backdrop-filter: blur(8px);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 10px 14px;
    font-size: 0.75rem;
    color: #8b949e;
    display: flex;
    gap: 15px;
  }}
  .legend-item {{
    display: flex;
    align-items: center;
    gap: 6px;
  }}
  .legend-dot {{
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }}
</style>
</head>
<body>

<div id="graph-container">
  <svg id="viewport"></svg>
  <div id="legend">
    <div class="legend-item"><span class="legend-dot" style="background: #1f6feb;"></span> Central Aperture</div>
    <div class="legend-item"><span class="legend-dot" style="background: var(--accent-gold);"></span> Platform</div>
    <div class="legend-item"><span class="legend-dot" style="background: var(--accent);"></span> Zettel Card</div>
    <div class="legend-item"><span class="legend-dot" style="background: #f85149;"></span> Open Ghost</div>
  </div>
</div>

<div id="sidebar">
  <header>
    <h1>SLIPCASE TOPOLOGY</h1>
    <div class="subtitle">44 Zettels • 13 Platforms • 5 Ghosts • Interactive Offline Field</div>
  </header>
  <div id="search-box">
    <input type="text" id="search-input" placeholder="Search cards, concepts, authors..." oninput="onSearch(this.value)">
  </div>
  <div id="filter-bar">
    <div class="filter-chip active" onclick="setFilter('all', this)">All Nodes</div>
    <div class="filter-chip" onclick="setFilter('deep-play-at-the-aperture', this)">Aperture</div>
    <div class="filter-chip" onclick="setFilter('game-01-instruction', this)">G01: Instruction</div>
    <div class="filter-chip" onclick="setFilter('game-04-plan', this)">G04: Plan</div>
    <div class="filter-chip" onclick="setFilter('game-02-score', this)">G02: Score</div>
    <div class="filter-chip" onclick="setFilter('game-03-program', this)">G03: Program</div>
  </div>
  <div id="details">
    <div class="empty-state">
      <p>Select any node in the topological field to inspect its payload, source, direction of fit, and linked neighborhood.</p>
      <br>
      <p><strong>Hotkeys:</strong><br>
      - Click & Drag: Pan viewport<br>
      - Scroll: Zoom in/out<br>
      - Click node: Inspect & highlight connections</p>
    </div>
  </div>
</div>

<script>
const rawZettels = {json.dumps(zettels)};
const rawNodes = {json.dumps(nodes)};
const rawEdges = {json.dumps(edges)};

const svg = document.getElementById('viewport');
let width = window.innerWidth - 380;
let height = window.innerHeight;

let panX = width / 2;
let panY = height / 2;
let zoom = 1.0;
let isPanning = false;
let startX = 0, startY = 0;
let selectedNodeId = null;

// Layout positions
const nodePos = {{}};
const platAngles = {{}};
const platOrder = [
  "game-01-instruction", "game-02-score", "game-03-program", "game-04-plan",
  "game-05-query", "game-06-probe", "game-07-gesture", "game-08-commission",
  "game-09-conversation", "game-10-edit", "game-11-constraint", "game-12-performance"
];

// Aperture at center
nodePos["deep-play-at-the-aperture"] = {{ x: 0, y: 0, type: 'HUB', label: 'THE APERTURE' }};

// Orbit radius
const R = 340;
platOrder.forEach((pid, i) => {{
  const angle = (2 * Math.PI / 12) * i - (Math.PI / 2);
  platAngles[pid] = angle;
  nodePos[pid] = {{
    x: R * Math.cos(angle),
    y: R * Math.sin(angle),
    type: 'PLATFORM',
    label: pid.replace('game-', 'G')
  }};
}});

// Position zettels orbiting platforms
rawZettels.forEach((z) => {{
  const plat = z.platform;
  if (plat === 'deep-play-at-the-aperture') {{
    const idx = z.order - 24;
    const a = (2 * Math.PI / 4) * idx;
    nodePos[z.id] = {{
      x: 90 * Math.cos(a),
      y: 90 * Math.sin(a),
      type: 'ZETTEL',
      zettel: z
    }};
  }} else if (nodePos[plat]) {{
    const pPos = nodePos[plat];
    const siblings = rawZettels.filter(item => item.platform === plat);
    const idx = siblings.findIndex(item => item.id === z.id);
    const baseAngle = Math.atan2(pPos.y, pPos.x);
    const spread = 0.65;
    const a = baseAngle - (spread / 2) + (spread / (siblings.length > 1 ? siblings.length - 1 : 1)) * idx;
    const dist = 75;
    nodePos[z.id] = {{
      x: pPos.x + dist * Math.cos(a),
      y: pPos.y + dist * Math.sin(a),
      type: 'ZETTEL',
      zettel: z
    }};
  }} else {{
    nodePos[z.id] = {{ x: (Math.random()-0.5)*400, y: (Math.random()-0.5)*400, type: 'ZETTEL', zettel: z }};
  }}
}});

// Position ghosts outside perimeter
const ghostList = rawNodes.filter(n => n.type === 'GHOST');
ghostList.forEach((g, i) => {{
  const a = (2 * Math.PI / ghostList.length) * i;
  nodePos[g.id] = {{
    x: (R + 130) * Math.cos(a),
    y: (R + 130) * Math.sin(a),
    type: 'GHOST',
    ghost: g
  }};
}});

function render() {{
  svg.innerHTML = '';
  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  g.setAttribute('transform', `translate(${{panX}}, ${{panY}}) scale(${{zoom}})`);

  // Render edges
  rawEdges.forEach(e => {{
    const s = nodePos[e.source];
    const t = nodePos[e.target];
    if (s && t) {{
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', s.x);
      line.setAttribute('y1', s.y);
      line.setAttribute('x2', t.x);
      line.setAttribute('y2', t.y);
      const isHilite = (selectedNodeId === e.source || selectedNodeId === e.target);
      line.setAttribute('class', isHilite ? 'edge highlighted' : 'edge');
      g.appendChild(line);
    }}
  }});

  // Render nodes
  Object.keys(nodePos).forEach(id => {{
    const n = nodePos[id];
    let r = 7;
    let cls = 'node zettel-node';
    if (n.type === 'HUB') {{ r = 26; cls = 'node hub-node'; }}
    else if (n.type === 'PLATFORM') {{ r = 16; cls = 'node platform-node'; }}
    else if (n.type === 'GHOST') {{ r = 9; cls = 'node ghost-node'; }}

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', n.x);
    circle.setAttribute('cy', n.y);
    circle.setAttribute('r', r);
    circle.setAttribute('class', cls);
    circle.onclick = () => selectNode(id);
    g.appendChild(circle);

    // Label
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', n.x);
    text.setAttribute('y', n.y + (r + 11));
    text.setAttribute('class', 'node-label');
    if (n.type === 'ZETTEL') {{
      text.textContent = n.zettel ? n.zettel.name.split('-')[0] : id;
    }} else if (n.type === 'PLATFORM') {{
      text.textContent = n.label;
    }} else if (n.type === 'HUB') {{
      text.textContent = 'APERTURE';
    }} else if (n.type === 'GHOST') {{
      text.textContent = n.ghost.label.replace('[[', '').replace(']]', '');
    }}
    g.appendChild(text);
  }});

  svg.appendChild(g);
}}

function selectNode(id) {{
  selectedNodeId = id;
  render();

  const details = document.getElementById('details');
  const n = nodePos[id];
  if (!n) return;

  if (n.type === 'ZETTEL') {{
    const z = n.zettel;
    details.innerHTML = `
      <div class="detail-card">
        <span class="detail-order">CARD #${{z.order.toString().padStart(3, '0')}}</span>
        <div class="detail-title">${{z.title}}</div>
        <div class="detail-meta">
          <strong>Platform:</strong> [[${{z.platform}}]]<br>
          <strong>Author / Citekey:</strong> ${{z.citekey}}<br>
          <strong>Source:</strong> ${{z.source}}<br>
          <strong>Payload SHA-256:</strong> <code>${{z.sha256.substring(0, 16)}}...</code>
        </div>
        <div class="badge-row">
          ${{z.links.map(l => `<span class="badge">[[${{l}}]]</span>`).join('')}}
        </div>
        <hr style="border: 0; border-top: 1px solid var(--border); margin: 12px 0;">
        <div style="font-weight: bold; font-size: 0.8rem; margin-bottom: 4px; color: var(--text-bright);">RESEARCH OBJECT:</div>
        <div style="font-size: 0.85rem; margin-bottom: 10px;">${{z.research_object}}</div>
        <div style="font-weight: bold; font-size: 0.8rem; margin-bottom: 4px; color: var(--text-bright);">MECHANISM:</div>
        <div style="font-size: 0.85rem; margin-bottom: 10px;">${{z.mechanism}}</div>
        <div style="font-weight: bold; font-size: 0.8rem; margin-bottom: 4px; color: var(--text-bright);">RAW PAYLOAD:</div>
        <div class="detail-body">${{z.payload}}</div>
      </div>
    `;
  }} else if (n.type === 'PLATFORM' || n.type === 'HUB') {{
    const pInfo = rawNodes.find(item => item.id === id);
    const members = rawZettels.filter(z => z.platform === id);
    details.innerHTML = `
      <div class="detail-card">
        <span class="detail-order">PLATFORM CONSTELLATION</span>
        <div class="detail-title">${{pInfo ? pInfo.label : id}}</div>
        <div class="detail-meta">${{pInfo ? pInfo.description : ''}}</div>
        <div style="font-weight: bold; font-size: 0.85rem; margin: 12px 0 6px 0; color: var(--text-bright);">MEMBER CARDS (${{members.length}}):</div>
        <div class="badge-row">
          ${{members.map(m => `<span class="badge" onclick="selectNode('${{m.id}}')">#${{m.order.toString().padStart(3, '0')}} ${{m.name}}</span>`).join('')}}
        </div>
      </div>
    `;
  }} else if (n.type === 'GHOST') {{
    const g = n.ghost;
    details.innerHTML = `
      <div class="detail-card" style="border-color: #f85149;">
        <span class="detail-order" style="background: rgba(248,81,73,0.2); color: #f85149;">OPEN GHOST ADDRESS</span>
        <div class="detail-title">${{g.label}}</div>
        <div class="detail-body" style="font-family: inherit;">${{g.description}}</div>
        <div class="detail-meta">Law 10: "A GHOST is an unfinished intellectual address, not an error. Preserve its literal name, inbound links, and open tension."</div>
      </div>
    `;
  }}
}}

function onSearch(query) {{
  if (!query) return;
  const q = query.toLowerCase();
  const match = rawZettels.find(z =>
    z.title.toLowerCase().includes(q) ||
    z.name.toLowerCase().includes(q) ||
    z.citekey.toLowerCase().includes(q) ||
    z.payload.toLowerCase().includes(q)
  );
  if (match) {{
    selectNode(match.id);
  }}
}}

function setFilter(plat, btn) {{
  document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  if (plat === 'all') {{
    panX = width / 2;
    panY = height / 2;
    zoom = 1.0;
  }} else if (nodePos[plat]) {{
    panX = (width / 2) - nodePos[plat].x * 1.5;
    panY = (height / 2) - nodePos[plat].y * 1.5;
    zoom = 1.5;
    selectNode(plat);
  }}
  render();
}}

// Mouse events for pan/zoom
svg.onmousedown = (e) => {{
  if (e.target.tagName === 'svg') {{
    isPanning = true;
    startX = e.clientX - panX;
    startY = e.clientY - panY;
  }}
}};
window.onmousemove = (e) => {{
  if (isPanning) {{
    panX = e.clientX - startX;
    panY = e.clientY - startY;
    render();
  }}
}};
window.onmouseup = () => {{ isPanning = false; }};
svg.onwheel = (e) => {{
  e.preventDefault();
  const delta = e.deltaY < 0 ? 1.1 : 0.9;
  zoom *= delta;
  render();
}};

window.onresize = () => {{
  width = window.innerWidth - 380;
  height = window.innerHeight;
  render();
}};

render();
</script>
</body>
</html>
"""

with open(os.path.join(pkg_dir, "NETWORK.html"), "w", encoding="utf-8") as fp:
    fp.write(network_html)

# -------------------------------------------------------------
# 2. READER.html (Quiet Offline Research Desk)
# -------------------------------------------------------------
# 8 Modes: DECK, READ, GRAPH, SOURCES, BIBLIOGRAPHY, GHOSTS, MOCS, TRAIL
reader_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>SLIPCASE — Offline Research Desk</title>
<style>
  :root {{
    --bg: #0d1117;
    --sidebar-bg: #161b22;
    --card-bg: #21262d;
    --border: #30363d;
    --text: #c9d1d9;
    --text-bright: #f0f6fc;
    --accent: #58a6ff;
    --accent-gold: #d29922;
    --accent-red: #f85149;
    --accent-green: #3fb950;
  }}
  * {{ box-sizing: border-box; margin: 0; padding: 0; }}
  body {{
    background: var(--bg);
    color: var(--text);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    display: flex;
    height: 100vh;
    overflow: hidden;
  }}
  #nav-strip {{
    width: 64px;
    background: #090d13;
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem 0;
    gap: 16px;
  }}
  .nav-btn {{
    width: 44px;
    height: 44px;
    border-radius: 8px;
    background: transparent;
    border: 1px solid transparent;
    color: #8b949e;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 0.75rem;
    font-weight: 600;
    transition: all 0.2s;
  }}
  .nav-btn:hover {{
    background: #161b22;
    color: var(--text-bright);
  }}
  .nav-btn.active {{
    background: rgba(88,166,255,0.15);
    border-color: var(--accent);
    color: var(--accent);
  }}
  #sidebar-col {{
    width: 340px;
    background: var(--sidebar-bg);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
  }}
  .sidebar-header {{
    padding: 1rem 1.25rem;
    border-bottom: 1px solid var(--border);
  }}
  .sidebar-header h2 {{
    font-size: 1rem;
    color: var(--text-bright);
    margin-bottom: 4px;
  }}
  .search-wrapper {{
    padding: 8px 1.25rem;
    border-bottom: 1px solid var(--border);
  }}
  .search-input {{
    width: 100%;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 6px 10px;
    color: var(--text-bright);
    font-size: 0.85rem;
  }}
  #card-list {{
    flex: 1;
    overflow-y: auto;
  }}
  .card-item {{
    padding: 10px 1.25rem;
    border-bottom: 1px solid rgba(48,54,61,0.5);
    cursor: pointer;
    transition: background 0.15s;
  }}
  .card-item:hover {{
    background: #1f242c;
  }}
  .card-item.active {{
    background: rgba(88,166,255,0.12);
    border-left: 3px solid var(--accent);
  }}
  .card-item-order {{
    font-size: 0.75rem;
    font-weight: bold;
    color: var(--accent);
  }}
  .card-item-title {{
    font-size: 0.85rem;
    color: var(--text-bright);
    margin: 2px 0;
    line-height: 1.3;
  }}
  .card-item-sub {{
    font-size: 0.75rem;
    color: #8b949e;
  }}
  #content-area {{
    flex: 1;
    overflow-y: auto;
    padding: 2rem 3rem;
    background: var(--bg);
  }}
  .view-pane {{
    display: none;
    max-width: 900px;
    margin: 0 auto;
  }}
  .view-pane.active {{
    display: block;
  }}
  .reading-card {{
    background: var(--sidebar-bg);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 2.5rem;
    margin-bottom: 2rem;
  }}
  .card-header-badge {{
    display: inline-block;
    padding: 4px 10px;
    background: rgba(88,166,255,0.15);
    color: var(--accent);
    border-radius: 16px;
    font-size: 0.8rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }}
  .card-main-title {{
    font-size: 1.5rem;
    color: var(--text-bright);
    margin-bottom: 1rem;
    line-height: 1.35;
  }}
  .card-source {{
    font-size: 0.95rem;
    color: #8b949e;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--border);
  }}
  .section-label {{
    font-size: 0.8rem;
    font-weight: bold;
    color: var(--accent);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin: 1.5rem 0 0.5rem 0;
  }}
  .quote-box {{
    background: #0d1117;
    border-left: 3px solid var(--accent);
    padding: 1rem 1.25rem;
    border-radius: 0 4px 4px 0;
    font-style: italic;
    color: var(--text-bright);
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }}
  .content-text {{
    font-size: 1rem;
    line-height: 1.7;
    color: var(--text);
  }}
  .raw-box {{
    background: #090d13;
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 1rem;
    font-family: monospace;
    font-size: 0.85rem;
    color: #79c0ff;
    overflow-x: auto;
    white-space: pre-wrap;
    margin-top: 1rem;
  }}
  .btn-row {{
    display: flex;
    gap: 10px;
    margin-top: 1.5rem;
  }}
  .desk-btn {{
    background: #21262d;
    border: 1px solid var(--border);
    color: var(--text);
    padding: 6px 14px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.85rem;
  }}
  .desk-btn:hover {{
    background: #30363d;
    color: var(--text-bright);
  }}
  .desk-btn.primary {{
    background: #1f6feb;
    border-color: #388bfd;
    color: #ffffff;
  }}
</style>
</head>
<body>

<div id="nav-strip">
  <button class="nav-btn active" title="DECK View" onclick="setMode('DECK', this)">DECK</button>
  <button class="nav-btn" title="READ Mode" onclick="setMode('READ', this)">READ</button>
  <button class="nav-btn" title="TOPOLOGY Mode" onclick="window.location.href='NETWORK.html'">NET</button>
  <button class="nav-btn" title="BIBLIOGRAPHY Mode" onclick="setMode('BIB', this)">BIB</button>
  <button class="nav-btn" title="GHOSTS Mode" onclick="setMode('GHOSTS', this)">GHOST</button>
  <button class="nav-btn" title="MOCS Mode" onclick="setMode('MOCS', this)">MOC</button>
  <button class="nav-btn" title="PRINT CARDS" onclick="window.location.href='CARDS.html'">PRINT</button>
</div>

<div id="sidebar-col">
  <div class="sidebar-header">
    <h2>SLIPCASE DESK</h2>
    <div style="font-size: 0.75rem; color: #8b949e;">44 Cards • 12 Language Games</div>
  </div>
  <div class="search-wrapper">
    <input type="text" class="search-input" placeholder="Search zettels (title, author)..." oninput="filterCards(this.value)">
  </div>
  <div id="card-list"></div>
</div>

<div id="content-area">
  <!-- DECK / READ MODE -->
  <div id="pane-deck" class="view-pane active">
    <div id="current-reading-card" class="reading-card">
      <div class="card-header-badge" id="c-badge">CARD #001</div>
      <h1 class="card-main-title" id="c-title">Title</h1>
      <div class="card-source" id="c-source">Source</div>

      <div class="section-label">Passage / Direct Evidence</div>
      <div class="quote-box" id="c-passage">Passage</div>

      <div class="section-label">Research Object</div>
      <div class="content-text" id="c-object">Research Object</div>

      <div class="section-label">Mechanism</div>
      <div class="content-text" id="c-mech">Mechanism</div>

      <div class="btn-row">
        <button class="desk-btn primary" onclick="toggleRaw()">Toggle Raw Payload</button>
        <button class="desk-btn" onclick="copyBibtex()">Copy BibTeX</button>
        <button class="desk-btn" onclick="jumpSurprise()">Random Surprise Card</button>
      </div>

      <div id="raw-container" style="display: none;">
        <div class="section-label">Exact Immutable Payload</div>
        <pre class="raw-box" id="c-payload"></pre>
      </div>
    </div>
  </div>

  <!-- BIBLIOGRAPHY MODE -->
  <div id="pane-bib" class="view-pane">
    <h1 style="color: var(--text-bright); margin-bottom: 1.5rem;">Compiled Bibliography</h1>
    <div id="bib-list"></div>
  </div>

  <!-- GHOSTS MODE -->
  <div id="pane-ghosts" class="view-pane">
    <h1 style="color: var(--text-bright); margin-bottom: 0.5rem;">Open Ghost Addresses</h1>
    <p style="color: #8b949e; margin-bottom: 2rem;">Unfinished intellectual addresses holding open generative tensions in the field.</p>
    <div id="ghosts-list"></div>
  </div>

  <!-- MOCS MODE -->
  <div id="pane-mocs" class="view-pane">
    <h1 style="color: var(--text-bright); margin-bottom: 1.5rem;">Maps of Content (MOCs)</h1>
    <div id="mocs-list">
      <div class="reading-card">
        <h2>1. Language Games & Pragmatic Containers</h2>
        <p style="color: #8b949e; margin: 8px 0;">Covers all 12 Wittgensteinian language games.</p>
        <button class="desk-btn" onclick="alert('See _MOCS/MOC__LANGUAGE_GAMES.md in package.')">Inspect MOC</button>
      </div>
      <div class="reading-card">
        <h2>2. Direction of Fit & Speech Acts</h2>
        <p style="color: #8b949e; margin: 8px 0;">Anscombe, Searle, Austin, and Winograd.</p>
        <button class="desk-btn" onclick="alert('See _MOCS/MOC__DIRECTION_OF_FIT.md in package.')">Inspect MOC</button>
      </div>
      <div class="reading-card">
        <h2>3. Operative Ekphrasis & The Knife</h2>
        <p style="color: #8b949e; margin: 8px 0;">Dimensional reduction between text and execution.</p>
        <button class="desk-btn" onclick="alert('See _MOCS/MOC__OPERATIVE_EKPHRASIS.md in package.')">Inspect MOC</button>
      </div>
    </div>
  </div>
</div>

<script>
const zettels = {json.dumps(zettels)};
let currentIdx = 0;

function initCardList() {{
  const listEl = document.getElementById('card-list');
  listEl.innerHTML = '';
  zettels.forEach((z, i) => {{
    const item = document.createElement('div');
    item.className = 'card-item' + (i === currentIdx ? ' active' : '');
    item.id = 'c-item-' + i;
    item.onclick = () => showCard(i);
    item.innerHTML = `
      <div class="card-item-order">#${{z.order.toString().padStart(3, '0')}} • [[${{z.platform}}]]</div>
      <div class="card-item-title">${{z.title}}</div>
      <div class="card-item-sub">${{z.citekey}}</div>
    `;
    listEl.appendChild(item);
  }});
}}

function showCard(idx) {{
  currentIdx = idx;
  document.querySelectorAll('.card-item').forEach((el, i) => {{
    el.classList.toggle('active', i === idx);
  }});

  const z = zettels[idx];
  document.getElementById('c-badge').textContent = `CARD #${{z.order.toString().padStart(3, '0')}} • [[${{z.platform}}]]`;
  document.getElementById('c-title').textContent = z.title;
  document.getElementById('c-source').textContent = z.source;
  document.getElementById('c-passage').textContent = z.passage;
  document.getElementById('c-object').textContent = z.research_object;
  document.getElementById('c-mech').textContent = z.mechanism;
  document.getElementById('c-payload').textContent = z.payload;
}}

function toggleRaw() {{
  const el = document.getElementById('raw-container');
  el.style.display = el.style.display === 'none' ? 'block' : 'none';
}}

function copyBibtex() {{
  const z = zettels[currentIdx];
  navigator.clipboard.writeText(z.bibtex).then(() => {{
    alert('Copied BibTeX for ' + z.citekey);
  }});
}}

function jumpSurprise() {{
  const rand = Math.floor(Math.random() * zettels.length);
  showCard(rand);
  const el = document.getElementById('c-item-' + rand);
  if (el) el.scrollIntoView({{ behavior: 'smooth', block: 'center' }});
}}

function filterCards(q) {{
  const query = q.toLowerCase();
  zettels.forEach((z, i) => {{
    const el = document.getElementById('c-item-' + i);
    const match = z.title.toLowerCase().includes(query) ||
                  z.name.toLowerCase().includes(query) ||
                  z.citekey.toLowerCase().includes(query);
    el.style.display = match ? 'block' : 'none';
  }});
}}

function setMode(mode, btn) {{
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  document.querySelectorAll('.view-pane').forEach(p => p.classList.remove('active'));
  if (mode === 'DECK' || mode === 'READ') {{
    document.getElementById('pane-deck').classList.add('active');
  }} else if (mode === 'BIB') {{
    document.getElementById('pane-bib').classList.add('active');
    renderBibList();
  }} else if (mode === 'GHOSTS') {{
    document.getElementById('pane-ghosts').classList.add('active');
    renderGhostsList();
  }} else if (mode === 'MOCS') {{
    document.getElementById('pane-mocs').classList.add('active');
  }}
}}

function renderBibList() {{
  const el = document.getElementById('bib-list');
  el.innerHTML = zettels.map(z => `
    <div class="reading-card" style="margin-bottom: 1.5rem;">
      <div style="font-size: 0.8rem; color: var(--accent); font-weight: bold;">#${{z.order.toString().padStart(3, '0')}} • ${{z.citekey}}</div>
      <div style="font-size: 1.1rem; color: var(--text-bright); margin: 6px 0;">${{z.source}}</div>
      <pre class="raw-box">${{z.bibtex}}</pre>
    </div>
  `).join('');
}}

function renderGhostsList() {{
  const ghosts = [
    {{ title: "[[the-knife-counter-cut]]", desc: "The unmodelled physical friction and blade wear produced during actuation." }},
    {{ title: "[[subordinate-listener-break]]", desc: "The point of breakdown when a passive receiver fails to translate token into motion." }},
    {{ title: "[[ekphrastic-remainder]]", desc: "What is discarded when analog continuous reality is quantized into text." }},
    {{ title: "[[incomputable-friction]]", desc: "Substrate resistance preventing closed-loop formal convergence." }},
    {{ title: "[[aperture-threshold]]", desc: "The mechanical interface where tokens cease being signs and become levers." }}
  ];
  const el = document.getElementById('ghosts-list');
  el.innerHTML = ghosts.map(g => `
    <div class="reading-card" style="border-color: #f85149; margin-bottom: 1.5rem;">
      <div style="color: #f85149; font-weight: bold; font-size: 1.1rem; margin-bottom: 8px;">${{g.title}}</div>
      <div style="font-size: 0.95rem; line-height: 1.6;">${{g.desc}}</div>
    </div>
  `).join('');
}}

initCardList();
showCard(0);
</script>
</body>
</html>
"""

with open(os.path.join(pkg_dir, "READER.html"), "w", encoding="utf-8") as fp:
    fp.write(reader_html)

# -------------------------------------------------------------
# 3. CARDS.html (Printable 4x6 Notecards Layout)
# -------------------------------------------------------------
cards_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>SLIPCASE — Printable 4x6 Notecards Deck</title>
<style>
  @page {{
    size: 6in 4in;
    margin: 0.25in;
  }}
  * {{ box-sizing: border-box; margin: 0; padding: 0; }}
  body {{
    background: #f0f0f0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Georgia, serif;
    color: #111;
  }}
  .screen-bar {{
    background: #161b22;
    color: #fff;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }}
  .screen-bar button {{
    background: #58a6ff;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    font-weight: bold;
    cursor: pointer;
  }}
  .cards-container {{
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
    gap: 2rem;
  }}
  .notecard {{
    width: 6in;
    height: 4in;
    background: #ffffff;
    border: 1px solid #ccc;
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    padding: 0.3in;
    position: relative;
    page-break-after: always;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
  }}
  .card-top {{
    display: flex;
    justify-content: space-between;
    border-bottom: 1.5px solid #000;
    padding-bottom: 4px;
    margin-bottom: 6px;
  }}
  .card-top-id {{
    font-weight: bold;
    font-size: 8pt;
    font-family: monospace;
  }}
  .card-top-plat {{
    font-size: 8pt;
    font-weight: bold;
    text-transform: uppercase;
  }}
  .card-title {{
    font-size: 10.5pt;
    font-weight: bold;
    line-height: 1.25;
    margin-bottom: 6px;
    color: #000;
  }}
  .card-quote {{
    font-size: 8pt;
    font-style: italic;
    line-height: 1.35;
    background: #f7f7f7;
    border-left: 2px solid #555;
    padding: 4px 8px;
    margin-bottom: 6px;
    max-height: 1.4in;
    overflow: hidden;
  }}
  .card-mech {{
    font-size: 7.5pt;
    line-height: 1.25;
    color: #222;
  }}
  .card-footer {{
    border-top: 1px solid #ddd;
    padding-top: 4px;
    display: flex;
    justify-content: space-between;
    font-size: 6.5pt;
    color: #666;
    font-family: monospace;
  }}
  @media print {{
    body {{ background: #fff; }}
    .screen-bar {{ display: none; }}
    .cards-container {{ padding: 0; gap: 0; }}
    .notecard {{
      border: none;
      box-shadow: none;
      width: 100%;
      height: 100%;
    }}
  }}
</style>
</head>
<body>

<div class="screen-bar">
  <div>
    <strong>SLIPCASE 4×6 INDEX CARDS PRINT VIEW</strong>
    <span style="font-size: 0.85rem; color: #8b949e; margin-left: 1rem;">44 Cards • Formatted for standard 4x6 notecard stock</span>
  </div>
  <button onclick="window.print()">Print Cards Deck</button>
</div>

<div class="cards-container">
"""

for c in zettels:
    clean_passage = c["passage"].replace('"', '&quot;').replace("[QUOTE]", "").strip()
    cards_html += f"""
  <div class="notecard">
    <div>
      <div class="card-top">
        <div class="card-top-id">#{c['order']:03d} • {c['citekey']}</div>
        <div class="card-top-plat">[[{c['platform']}]]</div>
      </div>
      <div class="card-title">{c['title']}</div>
      <div class="card-quote">"{clean_passage[:280]}..."</div>
      <div class="card-mech"><strong>Mechanism:</strong> {c['mechanism'][:220]}...</div>
    </div>
    <div class="card-footer">
      <div>{c['id']}</div>
      <div>SHA-256: {c['sha256'][:16]}...</div>
      <div>POML v15.55-AM</div>
    </div>
  </div>
"""

cards_html += """
</div>
</body>
</html>
"""

with open(os.path.join(pkg_dir, "CARDS.html"), "w", encoding="utf-8") as fp:
    fp.write(cards_html)

print("Finished 03_interactive_views.py successfully!")
