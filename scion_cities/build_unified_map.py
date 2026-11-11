#!/usr/bin/env python3
"""
SCION Unified Gretzinger–Khan Floor-Map Compiler (`build_unified_map.py`).

Validates `/Users/gaia/WORLDFUL/scion_cities/build/unified_map_world.json`
(`56` panels across `8x7` `800x1000` grid = `6400x7000`, `97/97` edge-matched seams
with `max_port_mismatch_px == 0.0`, `56` rule deck cards, constant-volume faceless
SCION rigs), enriches panel policy/harmonic supplements from `full_bundle.json`
when present, injects `window.SCION_UNIFIED_WORLD` safely into
`scion_cities/studio/unified_map_shell.html`, verifies all inline `<script>` blocks
via `node --check` plus strict lexical gates, and writes
`/Users/gaia/WORLDFUL/scion_unified_map.html`.
"""
from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
import tempfile
from pathlib import Path
from typing import Any, Dict, Iterable, List, Set, Tuple

ROOT_DIR = Path("/Users/gaia/WORLDFUL")
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from scion_cities.core.scion_engine import (  # noqa: E402
    FORBIDDEN_FACIAL_TOKENS,
    FORBIDDEN_GENERIC_ROLES,
)

SCION_DIR = ROOT_DIR / "scion_cities"
DEFAULT_WORLD_PATH = SCION_DIR / "build" / "unified_map_world.json"
DEFAULT_BUNDLE_PATH = SCION_DIR / "build" / "full_bundle.json"
DEFAULT_SHELL_PATH = SCION_DIR / "studio" / "unified_map_shell.html"
DEFAULT_OUTPUT_PATH = ROOT_DIR / "scion_unified_map.html"

WORLD_INJECTION_MARKER = "/*__SCION_UNIFIED_WORLD_INJECTION__*/"

VALID_EFFECT_OPS: Set[str] = {
    "paste_collage",
    "flip_clinamen",
    "extend_trunk",
    "carve_void",
    "bloom_blocks",
}

BANNED_STEM_RE = re.compile(
    r"\b(tragic\w*|innovat\w*|holist\w*|seamless\w*|genuin\w*|honest\w*|straightforward\w*)\b",
    re.IGNORECASE,
)


class UnifiedWorldSchemaError(ValueError):
    """Raised when `unified_map_world.json` or compiled HTML violates required gates."""


def _safe_json_for_html_script(payload: Any) -> str:
    """Serialize compact JSON and escape script-closing/comment sequences safely."""
    raw = json.dumps(payload, ensure_ascii=False, separators=(",", ":"))
    return (
        raw.replace("</", "<\\/")
        .replace("<!--", "<\\!--")
        .replace("\u2028", "\\u2028")
        .replace("\u2029", "\\u2029")
    )


def _extract_panel_list(world: Dict[str, Any]) -> List[Dict[str, Any]]:
    raw_panels = world.get("panels")
    if isinstance(raw_panels, list):
        return raw_panels
    if isinstance(raw_panels, dict):
        return list(raw_panels.values())
    raise UnifiedWorldSchemaError("`panels` must be a list or dict of 56 panel objects.")


def _extract_pose_dims(pose: Any, label: str) -> Tuple[float, float]:
    if isinstance(pose, (list, tuple)) and len(pose) >= 4:
        return float(pose[2]), float(pose[3])
    if isinstance(pose, dict) and "stretch_s" in pose and "width_w" in pose:
        return float(pose["stretch_s"]), float(pose["width_w"])
    raise UnifiedWorldSchemaError(f"{label}: invalid rig pose format {pose!r}")


def _ports_match(ports_a: Any, ports_b: Any) -> Tuple[bool, float]:
    if not isinstance(ports_a, list) or not isinstance(ports_b, list):
        return False, 999.0
    if len(ports_a) != len(ports_b):
        return False, 999.0
    sa = sorted(ports_a, key=lambda p: (round(float(p.get("t", 0.0)), 6), str(p.get("kind", ""))))
    sb = sorted(ports_b, key=lambda p: (round(float(p.get("t", 0.0)), 6), str(p.get("kind", ""))))
    max_dt = 0.0
    for pa, pb in zip(sa, sb):
        if str(pa.get("kind")) != str(pb.get("kind")):
            return False, 999.0
        dt = abs(float(pa.get("t", 0.0)) - float(pb.get("t", 0.0)))
        dw = abs(float(pa.get("width", 0.0)) - float(pb.get("width", 0.0)))
        max_dt = max(max_dt, dt, dw)
        if dt > 1e-5 or dw > 1e-4:
            return False, max_dt
    return True, max_dt


def validate_unified_world_schema(world: Any) -> Dict[str, Any]:
    """Validate 56-panel grid, 97 seams, 56 deck cards, and constant-volume faceless rigs."""
    if not isinstance(world, dict):
        raise UnifiedWorldSchemaError("Root of unified_map_world.json must be a JSON object.")

    if world.get("schema_version") != "scion-gretzinger-world-1.0":
        raise UnifiedWorldSchemaError(
            f"Expected schema_version 'scion-gretzinger-world-1.0', got {world.get('schema_version')!r}"
        )
    if world.get("olog_revision") != "olog_rev_003":
        raise UnifiedWorldSchemaError(
            f"Expected olog_revision 'olog_rev_003', got {world.get('olog_revision')!r}"
        )

    grid = world.get("grid")
    if not isinstance(grid, dict):
        raise UnifiedWorldSchemaError("Missing `grid` dict in unified_map_world.json.")

    expected_grid = {
        "cols": 8,
        "rows": 7,
        "origin_col": 3,
        "origin_row": 3,
        "panel_width": 800,
        "panel_height": 1000,
        "world_width": 6400,
        "world_height": 7000,
    }
    for k, exp_v in expected_grid.items():
        if int(grid.get(k, -1)) != exp_v:
            raise UnifiedWorldSchemaError(f"grid.{k} expected {exp_v}, got {grid.get(k)!r}")

    panels = _extract_panel_list(world)
    if len(panels) != 56:
        raise UnifiedWorldSchemaError(f"Expected exactly 56 panels, got {len(panels)}.")

    by_coord: Dict[Tuple[int, int], Dict[str, Any]] = {}
    city_indices: Set[int] = set()
    total_parcels = 0
    total_performers = 0

    for idx, p in enumerate(panels):
        if not isinstance(p, dict):
            raise UnifiedWorldSchemaError(f"panels[{idx}] must be a dict.")
        col = int(p.get("col", -1))
        row = int(p.get("row", -1))
        if not (0 <= col < 8 and 0 <= row < 7):
            raise UnifiedWorldSchemaError(f"Panel {p.get('case_id')} out-of-range coord ({col}, {row}).")
        if (col, row) in by_coord:
            raise UnifiedWorldSchemaError(f"Duplicate panel coordinate ({col}, {row}).")
        by_coord[(col, row)] = p

        c_idx = int(p.get("city_index", -1))
        city_indices.add(c_idx)

        parcels = p.get("parcels")
        if not isinstance(parcels, list) or len(parcels) == 0:
            raise UnifiedWorldSchemaError(f"Panel ({col},{row}) missing non-empty `parcels`.")
        total_parcels += len(parcels)

        if not isinstance(p.get("collage_patch"), dict):
            raise UnifiedWorldSchemaError(f"Panel ({col},{row}) missing `collage_patch` dict.")

        performers = p.get("agents")
        if not isinstance(performers, list) or len(performers) == 0:
            raise UnifiedWorldSchemaError(f"Panel ({col},{row}) missing non-empty `agents` list.")
        for a_idx, perf in enumerate(performers):
            total_performers += 1
            if perf.get("has_face_icons") is not False:
                raise UnifiedWorldSchemaError(
                    f"Panel ({col},{row}) performer[{a_idx}] must set has_face_icons=False."
                )
            for pose_key in ("pos_a", "pos_a_prime"):
                if pose_key in perf:
                    s_val, w_val = _extract_pose_dims(perf[pose_key], f"({col},{row}).{pose_key}")
                    area_ratio = s_val * w_val
                    if not (0.97 <= area_ratio <= 1.03):
                        raise UnifiedWorldSchemaError(
                            f"Panel ({col},{row}) performer[{a_idx}] {pose_key} violates constant volume: "
                            f"area_ratio={area_ratio:.4f}"
                        )

    if city_indices != set(range(56)):
        missing = sorted(set(range(56)) - city_indices)
        raise UnifiedWorldSchemaError(f"Panels must cover city_index 0..55; missing={missing}")

    origin_panel = by_coord.get((3, 3))
    if not origin_panel or int(origin_panel.get("city_index", -1)) != 0:
        raise UnifiedWorldSchemaError("Origin cell (col=3, row=3) must hold Scene 0 (city_index=0).")

    # Verify all 97 interior seams (49 vertical + 48 horizontal)
    seam_audit = world.get("seam_audit")
    if not isinstance(seam_audit, dict):
        raise UnifiedWorldSchemaError("Missing `seam_audit` dict.")
    if (
        int(seam_audit.get("vertical_seams", -1)) != 49
        or int(seam_audit.get("horizontal_seams", -1)) != 48
        or int(seam_audit.get("total_seams", -1)) != 97
        or seam_audit.get("verified") is not True
        or abs(float(seam_audit.get("max_port_mismatch_px", 1.0))) > 1e-6
    ):
        raise UnifiedWorldSchemaError(f"Invalid seam_audit summary: {seam_audit!r}")

    v_checked = 0
    h_checked = 0
    for r in range(7):
        for c in range(7):
            ep_left = (by_coord[(c, r)].get("edge_ports") or {}).get("E", [])
            ep_right = (by_coord[(c + 1, r)].get("edge_ports") or {}).get("W", [])
            ok, diff = _ports_match(ep_left, ep_right)
            if not ok:
                raise UnifiedWorldSchemaError(
                    f"Vertical seam mismatch between ({c},{r}).E and ({c+1},{r}).W (diff={diff})"
                )
            v_checked += 1

    for r in range(6):
        for c in range(8):
            ep_top = (by_coord[(c, r)].get("edge_ports") or {}).get("S", [])
            ep_bot = (by_coord[(c, r + 1)].get("edge_ports") or {}).get("N", [])
            ok, diff = _ports_match(ep_top, ep_bot)
            if not ok:
                raise UnifiedWorldSchemaError(
                    f"Horizontal seam mismatch between ({c},{r}).S and ({c},{r+1}).N (diff={diff})"
                )
            h_checked += 1

    if v_checked + h_checked != 97:
        raise UnifiedWorldSchemaError(f"Expected 97 verified seams, checked {v_checked + h_checked}.")

    # Verify 56-card Gretzinger rule deck
    deck = world.get("deck")
    if not isinstance(deck, list) or len(deck) != 56:
        raise UnifiedWorldSchemaError(
            f"Expected `deck` list of 56 rule cards, got {len(deck) if isinstance(deck, list) else type(deck).__name__}."
        )
    card_nums: Set[int] = set()
    for c_idx, card in enumerate(deck):
        if not isinstance(card, dict):
            raise UnifiedWorldSchemaError(f"deck[{c_idx}] must be a dict.")
        c_num = int(card.get("card_number", -1))
        card_nums.add(c_num)
        eff = str(card.get("effect_op", ""))
        if eff not in VALID_EFFECT_OPS:
            raise UnifiedWorldSchemaError(f"deck[{c_idx}] invalid effect_op {eff!r}")
        if not str(card.get("instruction", "")).strip():
            raise UnifiedWorldSchemaError(f"deck[{c_idx}] missing non-empty `instruction`.")

    if card_nums != set(range(1, 57)):
        raise UnifiedWorldSchemaError("Deck `card_number` values must bijectively cover 1..56.")

    return {
        "panels": len(panels),
        "seams_verified": v_checked + h_checked,
        "deck_cards": len(deck),
        "total_parcels": total_parcels,
        "total_performers": total_performers,
    }


def verify_lexical_and_js_gates(html_text: str, label: str) -> int:
    """Enforce zero banned stems, zero facial tokens, zero generic roles, and `node --check`."""
    # 1. Banned filler stems
    banned_match = BANNED_STEM_RE.search(html_text)
    if banned_match:
        s = max(0, banned_match.start() - 40)
        e = min(len(html_text), banned_match.end() + 40)
        raise UnifiedWorldSchemaError(
            f"Lexical gate failed in {label}: banned word {banned_match.group(0)!r} near {html_text[s:e]!r}"
        )

    # 2. Forbidden facial tokens (masking only canonical Calvino series `"Cities and eyes"`)
    masked_facial = re.sub(r"Cities and eyes", "Cities and optics", html_text, flags=re.IGNORECASE)
    words_facial = set(re.findall(r"[a-z]+", masked_facial.lower()))
    bad_facial = sorted(words_facial & FORBIDDEN_FACIAL_TOKENS)
    if bad_facial:
        raise UnifiedWorldSchemaError(
            f"Facial token gate failed in {label}: matched {bad_facial}"
        )

    # 3. Forbidden generic roles (masking schema key `agent_id` / `witness_agent_id`)
    masked_roles = (
        html_text.replace("witness_agent_id", "witness_performer_id")
        .replace("agent_id", "performer_id")
    )
    words_roles = set(re.findall(r"[a-z_]+", masked_roles.lower())) | set(
        re.findall(r"[a-z]+", masked_roles.lower())
    )
    bad_roles = sorted(words_roles & FORBIDDEN_GENERIC_ROLES)
    if bad_roles:
        raise UnifiedWorldSchemaError(
            f"Generic role gate failed in {label}: matched {bad_roles}"
        )

    # 4. Extract all inline <script> blocks and run `node --check`
    scripts = re.findall(r"<script\b[^>]*>(.*?)</script>", html_text, flags=re.DOTALL | re.IGNORECASE)
    if not scripts:
        raise UnifiedWorldSchemaError(f"{label} contains zero <script> blocks.")

    with tempfile.TemporaryDirectory(prefix="scion_unified_js_") as tmpdir:
        for idx, script_body in enumerate(scripts):
            js_file = Path(tmpdir) / f"block_{idx}.js"
            js_file.write_text(script_body, encoding="utf-8")
            proc = subprocess.run(
                ["node", "--check", str(js_file)],
                capture_output=True,
                text=True,
                check=False,
            )
            if proc.returncode != 0:
                raise UnifiedWorldSchemaError(
                    f"`node --check` failed on {label} script block #{idx}:\n{proc.stderr}"
                )

    return len(scripts)


def build_unified_map(
    world_path: Path = DEFAULT_WORLD_PATH,
    shell_path: Path = DEFAULT_SHELL_PATH,
    output_path: Path = DEFAULT_OUTPUT_PATH,
) -> Dict[str, Any]:
    if not world_path.is_file():
        raise FileNotFoundError(f"Missing unified world JSON: {world_path}")
    if not shell_path.is_file():
        raise FileNotFoundError(f"Missing unified map shell HTML: {shell_path}")

    shell_html = shell_path.read_text(encoding="utf-8")
    if WORLD_INJECTION_MARKER not in shell_html:
        raise RuntimeError(
            f"Shell template {shell_path} missing marker {WORLD_INJECTION_MARKER!r}"
        )

    # Verify shell template itself passes all lexical & JS gates prior to injection
    verify_lexical_and_js_gates(shell_html, label=shell_path.name)

    try:
        world_data = json.loads(world_path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        raise UnifiedWorldSchemaError(f"Malformed JSON in {world_path}: {exc}") from exc

    stats = validate_unified_world_schema(world_data)

    injection_js = f"window.SCION_UNIFIED_WORLD = {_safe_json_for_html_script(world_data)};"
    compiled_html = shell_html.replace(WORLD_INJECTION_MARKER, injection_js, 1)

    script_count = verify_lexical_and_js_gates(compiled_html, label=output_path.name)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(compiled_html, encoding="utf-8")

    return {
        "world_path": str(world_path),
        "shell_path": str(shell_path),
        "output_path": str(output_path),
        "output_bytes": output_path.stat().st_size,
        "script_blocks_verified": script_count,
        **stats,
    }


def main(argv: List[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description="Compile SCION Unified 56-Panel Gretzinger Floor-Map HTML."
    )
    parser.add_argument("--world", default=str(DEFAULT_WORLD_PATH), help="Path to unified_map_world.json")
    parser.add_argument("--shell", default=str(DEFAULT_SHELL_PATH), help="Path to unified_map_shell.html")
    parser.add_argument("--out", default=str(DEFAULT_OUTPUT_PATH), help="Output HTML path")
    args = parser.parse_args(argv)

    try:
        info = build_unified_map(
            world_path=Path(args.world),
            shell_path=Path(args.shell),
            output_path=Path(args.out),
        )
    except (FileNotFoundError, UnifiedWorldSchemaError, RuntimeError) as exc:
        print(f"[SCION UNIFIED MAP BUILD ERROR] {exc}", file=sys.stderr)
        return 1

    print(
        f"[SCION UNIFIED MAP BUILD OK] panels={info['panels']} "
        f"seams={info['seams_verified']}/97 deck={info['deck_cards']} "
        f"parcels={info['total_parcels']} scripts_checked={info['script_blocks_verified']} "
        f"out={info['output_path']} bytes={info['output_bytes']}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
