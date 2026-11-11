#!/opt/homebrew/bin/python3
"""
Assembles the Complete 56-Chapter Multiplane Feature Film, Continuous Drive/Commute
Audiobook (`.m4a` + `.mp3`), and Coupled 55-City SCION Cinema & Lattice Console
(`/Users/gaia/WORLDFUL/scion_cities/index.html`).
"""
from __future__ import annotations

import json
import os
import subprocess
import sys
from typing import Any, Dict, List

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

from scion_cities.swarms.catalog_55 import CITIES_55
from scion_cities.cities_dramaturgy import CITY_SCRIPTS

FILMS_DIR = os.path.join(HERE, "films")
AUDIO_DIR = os.path.join(HERE, "audio")
TIMING_DIR = os.path.join(HERE, "timing")
CKPT_DIR = os.path.join(HERE, "checkpoints", "cities")


def get_duration(path: str) -> float:
    out = subprocess.check_output([
        "/opt/homebrew/bin/ffprobe", "-v", "error",
        "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1", path
    ]).decode("utf-8").strip()
    return float(out)


def build_master_feature_and_drive_audio(entries: List[Dict[str, Any]]):
    concat_vid = os.path.join(HERE, "concat_videos.txt")
    concat_aud = os.path.join(HERE, "concat_audios.txt")
    ffmeta = os.path.join(HERE, "chapters_ffmeta.txt")

    with open(concat_vid, "w", encoding="utf-8") as fv, open(concat_aud, "w", encoding="utf-8") as fa:
        for e in entries:
            fv.write(f"file '{os.path.abspath(os.path.join(FILMS_DIR, e['slug'] + '.mp4'))}'\n")
            fa.write(f"file '{os.path.abspath(os.path.join(AUDIO_DIR, e['slug'] + '.m4a'))}'\n")

    meta_lines = [";FFMETADATA1", "title=Invisible Cities & SCION Clinamen Multiplane Studio (Complete 56-Film Edition)", "artist=WORLDFUL & SCION Multiplane Studio"]
    cur_ms = 0
    for e in entries:
        dur_s = get_duration(os.path.join(FILMS_DIR, e["slug"] + ".mp4"))
        e["start_sec"] = round(cur_ms / 1000.0, 2)
        e["duration_sec"] = round(dur_s, 2)
        end_ms = cur_ms + int(round(dur_s * 1000.0))
        meta_lines.extend([
            "[CHAPTER]",
            "TIMEBASE=1/1000",
            f"START={cur_ms}",
            f"END={end_ms}",
            f"title={e['label']}",
        ])
        cur_ms = end_ms

    with open(ffmeta, "w", encoding="utf-8") as fm:
        fm.write("\n".join(meta_lines) + "\n")

    # 1. Continuous Drive Mode M4A + MP3 (with monotonic PTS resample!)
    drive_m4a = os.path.join(AUDIO_DIR, "invisible-cities-complete-drive.m4a")
    drive_mp3 = os.path.join(AUDIO_DIR, "invisible-cities-complete-drive.mp3")
    subprocess.run([
        "/opt/homebrew/bin/ffmpeg", "-y", "-loglevel", "error",
        "-f", "concat", "-safe", "0", "-i", concat_aud,
        "-i", ffmeta, "-map_metadata", "1",
        "-af", "aresample=async=1",
        "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart",
        drive_m4a,
    ], check=True)
    subprocess.run([
        "/opt/homebrew/bin/ffmpeg", "-y", "-loglevel", "error",
        "-i", drive_m4a,
        "-c:a", "libmp3lame", "-b:a", "128k",
        drive_mp3,
    ], check=True)
    print(f"[drive] Built {drive_m4a} and {drive_mp3} (total {cur_ms/60000.0:.1f} min)")

    # 2. Complete Continuous Feature MP4 (< 92 MB target for artifact viewer!)
    feature_mp4 = os.path.join(FILMS_DIR, "invisible-cities-complete-feature.mp4")
    subprocess.run([
        "/opt/homebrew/bin/ffmpeg", "-y", "-loglevel", "error",
        "-f", "concat", "-safe", "0", "-i", concat_vid,
        "-i", ffmeta, "-map_metadata", "1",
        "-vf", "scale=960:540",
        "-c:v", "libx264", "-preset", "veryfast", "-crf", "29", "-maxrate", "290k", "-bufsize", "600k",
        "-pix_fmt", "yuv420p",
        "-af", "aresample=async=1", "-c:a", "aac", "-b:a", "128k",
        "-movflags", "+faststart",
        feature_mp4,
    ], check=True)
    sz_mb = os.path.getsize(feature_mp4) / (1024 * 1024)
    print(f"[feature] Built {feature_mp4} ({sz_mb:.1f} MB)")


SITE_HTML = r"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Invisible Cities (55 Films) &amp; SCION Clinamen Multiplane Cinema</title>
<style>
  :root {
    --paper: #f2ead9;
    --paper-hi: #faf5ea;
    --paper-deep: #e2d4ba;
    --ink: #1d1915;
    --ink-mid: #4d4236;
    --crimson: #a8291e;
    --blueprint: #284b63;
    --ochre: #b57c26;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    background: var(--paper);
    color: var(--ink);
    font-family: "Georgia", serif;
  }
  header {
    background: var(--ink);
    color: var(--paper-hi);
    padding: 16px 22px;
    border-bottom: 4px solid var(--crimson);
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
  }
  header h1 { margin: 0; font-size: 1.28rem; letter-spacing: 0.04em; text-transform: uppercase; }
  .mono { font-family: "Menlo", monospace; font-size: 0.77rem; }
  a.btn-link, button {
    font-family: "Menlo", monospace;
    font-size: 0.76rem;
    padding: 7px 11px;
    border: 1.5px solid var(--ink);
    background: var(--paper-hi);
    color: var(--ink);
    cursor: pointer;
    text-decoration: none;
    display: inline-block;
    box-shadow: 2px 2px 0 var(--crimson);
  }
  button.active { background: var(--crimson); color: var(--paper-hi); border-color: var(--crimson); }
  main { max-width: 1460px; margin: 0 auto; padding: 16px 20px 48px; }
  .drive-hero {
    display: grid;
    grid-template-columns: 1.35fr 0.65fr;
    gap: 16px;
    background: var(--paper-hi);
    border: 2px solid var(--ink);
    padding: 14px;
    margin-bottom: 18px;
  }
  @media (max-width: 960px) { .drive-hero { grid-template-columns: 1fr; } }
  video { width: 100%; background: #12100e; border: 1.5px solid var(--ink); display: block; }
  .filter-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 16px;
    padding: 10px;
    background: var(--paper-deep);
    border: 1.5px solid var(--ink);
  }
  .cities-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
    gap: 14px;
  }
  .city-card {
    border: 1.5px solid var(--ink);
    background: var(--paper-hi);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .city-card-head {
    background: var(--paper-deep);
    padding: 8px 10px;
    border-bottom: 1px solid var(--ink);
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }
  .city-thumb {
    width: 100%;
    aspect-ratio: 16 / 9;
    object-fit: cover;
    border-bottom: 1px solid var(--ink);
    cursor: pointer;
  }
  .city-body { padding: 10px 12px; font-size: 0.88rem; }
  .city-foot {
    padding: 8px 12px;
    border-top: 1px dashed var(--ink-mid);
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }
</style>
</head>
<body>

<header>
  <div>
    <h1>Italo Calvino&rsquo;s Invisible Cities &mdash; Complete 55-City Hand-Drawn Clinamen Cinema</h1>
    <div class="mono" style="color:#d8ccb4;margin-top:4px;">
      7-Plane Rough-Construction Keyframes (Ones/Twos/Holds) &middot; Constant-Volume Faceless Performers &middot; Kokoro v1.0 + Parameter-Coupled Foley
    </div>
  </div>
  <div style="display:flex;gap:8px;flex-wrap:wrap;">
    <a class="btn-link" href="../scion_swarm_builder.html" style="background:var(--crimson);color:var(--paper-hi);border-color:var(--paper-hi);"><strong>SCION Swarm Builder (56 Swarms) &nearr;</strong></a>
    <a class="btn-link" href="../scion_atlas.html" style="background:var(--blueprint);color:var(--paper-hi);border-color:var(--paper-hi);"><strong>Great Khan&rsquo;s Atlas (56 Plates) &nearr;</strong></a>
    <a class="btn-link" href="atelier/index.html"><strong>55-City Morphogenetic Atelier &nearr;</strong></a>
    <a class="btn-link" href="../studio/office/index.html"><strong>Multiplane Agent Office &nearr;</strong></a>
    <a class="btn-link" href="workbench.html">&larr; Flour Test Workbench</a>
    <a class="btn-link" href="../lineage/index.html">WORLDFUL 35-Film Lineage</a>
    <a class="btn-link" href="../index.html">WORLDFUL Press</a>
  </div>
</header>

<main>
  <section style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:10px;margin-bottom:16px;padding:12px;background:var(--paper-deep);border:2px solid var(--ink);">
    <a class="btn-link" href="../scion_swarm_builder.html" style="padding:10px 12px;">
      <div style="color:var(--crimson);font-weight:700;">01 &middot; SCION SWARM BUILDER</div>
      <div style="margin-top:3px;font-size:0.71rem;">Interactive 25-Tick Split-Trace A vs A&prime; Workbench (`scion_swarm_builder.html`)</div>
    </a>
    <a class="btn-link" href="../scion_atlas.html" style="padding:10px 12px;">
      <div style="color:var(--blueprint);font-weight:700;">02 &middot; GREAT KHAN&rsquo;S ATLAS</div>
      <div style="margin-top:3px;font-size:0.71rem;">56 Dual Archival Survey Maps &amp; Section Plates (`scion_atlas.html`)</div>
    </a>
    <a class="btn-link" href="atelier/index.html" style="padding:10px 12px;">
      <div style="color:var(--ink);font-weight:700;">03 &middot; 55-CITY MORPHOGENETIC ATELIER</div>
      <div style="margin-top:3px;font-size:0.71rem;">11 Topology Renderers &amp; Quine Re-Entry Console (`scion_cities/atelier/index.html`)</div>
    </a>
    <a class="btn-link" href="../studio/office/index.html" style="padding:10px 12px;">
      <div style="color:var(--ochre);font-weight:700;">04 &middot; STUDIO OF LIVING DESKS</div>
      <div style="margin-top:3px;font-size:0.71rem;">Plate 34 Interactive Multiplane Agent Office (`studio/office/index.html`)</div>
    </a>
  </section>
  <section class="drive-hero">
    <div>
      <video id="main-player" controls playsinline poster="films/01-diomira.jpg" src="films/invisible-cities-complete-feature.mp4"></video>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px;flex-wrap:wrap;gap:8px;">
        <div class="mono" id="now-playing"><strong>NOW SCREENING:</strong> Complete 56-Film Continuous Feature (Proof 00 + All 55 Cities)</div>
        <div style="display:flex;gap:6px;">
          <button id="btn-prev-city">&laquo; Prev City</button>
          <button id="btn-play-feature" class="active">Play Full Continuous Feature</button>
          <button id="btn-next-city">Next City &raquo;</button>
        </div>
      </div>
    </div>
    <div style="display:flex;flex-direction:column;justify-content:space-between;gap:10px;">
      <div>
        <h3 style="margin:0 0 6px 0;text-transform:uppercase;font-size:0.95rem;">Drive &amp; Commute Continuous Audio Console</h3>
        <p style="margin:0 0 8px 0;font-size:0.86rem;">
          Listen hands-free on a drive with lock-screen / CarPlay chapter controls, or watch any individual 24fps city film below.
        </p>
        <audio id="drive-audio" controls preload="metadata" src="audio/invisible-cities-complete-drive.m4a" style="width:100%;"></audio>
        <div class="mono" style="margin-top:6px;">
          Direct Downloads:
          <a href="audio/invisible-cities-complete-drive.m4a" download>Drive M4A</a> &middot;
          <a href="audio/invisible-cities-complete-drive.mp3" download>Drive MP3</a> &middot;
          <a href="films/invisible-cities-complete-feature.mp4" download>Full Feature MP4</a>
        </div>
      </div>
      <div class="mono" id="active-ledger" style="background:var(--paper);border:1px solid var(--ink);padding:10px;font-size:0.73rem;">
        Select any of the 55 cities below to inspect its Roubaud Lawful Baseline (&alpha;), Clinamen Swerve (&beta;), 4 disjoint ScionAgents, and Better Question.
      </div>
    </div>
  </section>

  <div class="filter-bar" id="series-filters"></div>
  <div class="cities-grid" id="cities-grid"></div>
</main>

<script>
const CATALOG = __CATALOG_JSON__;
let currentFilter = "ALL";
let currentIdx = -1;

const player = document.getElementById("main-player");
const nowPlaying = document.getElementById("now-playing");
const ledger = document.getElementById("active-ledger");

const seriesSet = ["ALL", ...new Set(CATALOG.map(c => c.series))];
const filterBar = document.getElementById("series-filters");
seriesSet.forEach(s => {
  const b = document.createElement("button");
  b.textContent = s === "ALL" ? `All Films (${CATALOG.length})` : s;
  if (s === "ALL") b.classList.add("active");
  b.onclick = () => {
    currentFilter = s;
    document.querySelectorAll("#series-filters button").forEach(x => x.classList.remove("active"));
    b.classList.add("active");
    renderGrid();
  };
  filterBar.appendChild(b);
});

function playSingle(idx) {
  currentIdx = idx;
  const item = CATALOG[idx];
  player.src = `films/${item.slug}.mp4`;
  player.poster = `films/${item.slug}.jpg`;
  player.play();
  nowPlaying.innerHTML = `<strong>NOW SCREENING:</strong> ${item.label} (${item.series})`;
  ledger.innerHTML = `
    <div><strong>${item.label}</strong> &middot; Topology: ${item.topology}</div>
    <div style="margin-top:4px;"><strong>&alpha; Baseline:</strong> ${item.pole_alpha} &rarr; <strong>&beta; Clinamen:</strong> <span style="color:var(--crimson)">${item.pole_beta}</span></div>
    <div style="margin-top:4px;"><strong>Swarm Agents:</strong> ${(item.agents || []).join(", ")}</div>
    <div style="margin-top:6px;border-left:3px solid var(--crimson);padding-left:6px;"><strong>T5 Better Question:</strong> ${item.question}</div>
  `;
  if ("mediaSession" in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: item.label,
      artist: "SCION Multiplane Studio",
      album: item.series,
    });
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

player.addEventListener("ended", () => {
  if (currentIdx >= 0 && currentIdx + 1 < CATALOG.length) {
    playSingle(currentIdx + 1);
  }
});

document.getElementById("btn-play-feature").onclick = () => {
  currentIdx = -1;
  player.src = "films/invisible-cities-complete-feature.mp4";
  player.play();
  nowPlaying.innerHTML = "<strong>NOW SCREENING:</strong> Complete 56-Film Continuous Feature";
};
document.getElementById("btn-prev-city").onclick = () => playSingle(Math.max(0, (currentIdx <= 0 ? 1 : currentIdx) - 1));
document.getElementById("btn-next-city").onclick = () => playSingle(Math.min(CATALOG.length - 1, currentIdx + 1));

if ("mediaSession" in navigator) {
  navigator.mediaSession.setActionHandler("previoustrack", () => document.getElementById("btn-prev-city").click());
  navigator.mediaSession.setActionHandler("nexttrack", () => document.getElementById("btn-next-city").click());
}

function renderGrid() {
  const grid = document.getElementById("cities-grid");
  grid.innerHTML = "";
  CATALOG.forEach((item, idx) => {
    if (currentFilter !== "ALL" && item.series !== currentFilter) return;
    const card = document.createElement("div");
    card.className = "city-card";
    card.innerHTML = `
      <div>
        <div class="city-card-head mono">
          <strong>${item.label}</strong>
          <span>${item.series}</span>
        </div>
        <img class="city-thumb" loading="lazy" src="films/${item.slug}.jpg" alt="${item.label}" />
        <div class="city-body">
          <div class="mono" style="font-size:0.71rem;color:var(--blueprint);margin-bottom:4px;">
            &alpha;: ${item.pole_alpha} &rarr; &beta;: ${item.pole_beta}
          </div>
          <div><em>&ldquo;${item.question}&rdquo;</em></div>
        </div>
      </div>
      <div class="city-foot">
        <button class="play-btn">&#9654; Watch Film (${item.duration_sec}s)</button>
        <a class="btn-link" href="sheets/${item.slug}/contact_sheet.jpg" target="_blank">Contact Sheet</a>
        <a class="btn-link" href="films/${item.slug}.mp4" download>MP4</a>
      </div>
    `;
    card.querySelector(".city-thumb").onclick = () => playSingle(idx);
    card.querySelector(".play-btn").onclick = () => playSingle(idx);
    grid.appendChild(card);
  });
}
renderGrid();
</script>
</body>
</html>
"""


def main():
    entries: List[Dict[str, Any]] = [
        {
            "index": 0,
            "slug": "00-abominable-cellar-flour-test",
            "label": "00 · The Flour Test (Abominable Cellar)",
            "series": "First Risk Case",
            "topology": "SPLIT_WITNESS_MEMORY_DAG",
            "pole_alpha": "complete_witness_memory_P1_arson_bar",
            "pole_beta": "selective_shove_erasure_P3_liability_flip",
            "agents": ["inigo_sack", "belindo_sack", "flower_witness_sack"],
            "question": "How does an honest witness's selective causal omission harden under P3 into institutional law overriding intact physical residue?",
        }
    ]
    for spec in CITIES_55:
        slug, _, _, q_line = CITY_SCRIPTS[spec.index]
        entries.append({
            "index": spec.index,
            "slug": slug,
            "label": f"{spec.index:02d} · {spec.name} (Ch.{spec.chapter})",
            "series": spec.series,
            "topology": spec.topology,
            "pole_alpha": spec.pole_alpha,
            "pole_beta": spec.pole_beta,
            "agents": [a.name for a in spec.agents],
            "question": q_line,
        })

    build_master_feature_and_drive_audio(entries)

    out_json = os.path.join(HERE, "master_56_catalog.json")
    with open(out_json, "w", encoding="utf-8") as f:
        json.dump(entries, f, indent=2)

    html = SITE_HTML.replace("__CATALOG_JSON__", json.dumps(entries))
    out_html = os.path.join(HERE, "index.html")
    with open(out_html, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"[cinema-site] Wrote {out_html} ({len(html):,} bytes)")


if __name__ == "__main__":
    main()
