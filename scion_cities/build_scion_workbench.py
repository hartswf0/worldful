#!/usr/bin/env python3
"""
SCION Workbench Compiler (`build_scion_workbench.py`).

Reads `/Users/gaia/WORLDFUL/scion_cities/build/full_bundle.json` if present,
else `/Users/gaia/WORLDFUL/scion_cities/build/proof_bundle.json`, performs strict
schema & Roubaud-lineage validation (failing loudly if malformed), loads
`/Users/gaia/WORLDFUL/scion_cities/atlas/manifest.json` (with `{}` fallback),
embeds `window.SCION_BUNDLE` and `window.SCION_ATLAS_MANIFEST` inside
`studio/workbench_shell.html`, and writes `/Users/gaia/WORLDFUL/scion_swarm_builder.html`.
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any, Dict, List, Tuple

ROOT_DIR = Path("/Users/gaia/WORLDFUL")
SCION_DIR = ROOT_DIR / "scion_cities"
SHELL_PATH = SCION_DIR / "studio" / "workbench_shell.html"
FULL_BUNDLE_PATH = SCION_DIR / "build" / "full_bundle.json"
PROOF_BUNDLE_PATH = SCION_DIR / "build" / "proof_bundle.json"
ATLAS_MANIFEST_PATH = SCION_DIR / "atlas" / "manifest.json"
ATLAS_PACK_MANIFESTS_DIR = SCION_DIR / "atlas" / "manifests"
OUTPUT_HTML_PATH = ROOT_DIR / "scion_swarm_builder.html"

BUNDLE_PLACEHOLDER = "/*__SCION_BUNDLE_INJECTION__*/"


class ScionBundleSchemaError(ValueError):
    """Raised when the input SCION bundle violates required structural invariants."""


def _extract_branches(case_obj: Dict[str, Any], label: str) -> Tuple[Dict[str, Any], Dict[str, Any]]:
    container = case_obj.get("branches") if isinstance(case_obj.get("branches"), dict) else case_obj
    branch_a = container.get("CHECKPOINT_LAWFUL_A")
    branch_ap = container.get("BRANCH_CLINAMEN_A_PRIME")
    if not isinstance(branch_a, dict):
        raise ScionBundleSchemaError(f"{label}: missing dict 'CHECKPOINT_LAWFUL_A'")
    if not isinstance(branch_ap, dict):
        raise ScionBundleSchemaError(f"{label}: missing dict 'BRANCH_CLINAMEN_A_PRIME'")
    return branch_a, branch_ap


def _validate_branch(branch: Dict[str, Any], label: str, expected_ticks: int = 25) -> None:
    world_trace = branch.get("world_trace")
    if not isinstance(world_trace, list) or len(world_trace) != expected_ticks:
        actual = len(world_trace) if isinstance(world_trace, list) else type(world_trace).__name__
        raise ScionBundleSchemaError(
            f"{label}: 'world_trace' must be a list of {expected_ticks} ticks (got {actual})"
        )
    for t_idx, tick_entry in enumerate(world_trace):
        if not isinstance(tick_entry, dict):
            raise ScionBundleSchemaError(f"{label}.world_trace[{t_idx}] is not a dict")
        if not isinstance(tick_entry.get("actors"), dict) or not tick_entry["actors"]:
            raise ScionBundleSchemaError(f"{label}.world_trace[{t_idx}] missing non-empty 'actors' dict")
        if not isinstance(tick_entry.get("residues"), dict):
            raise ScionBundleSchemaError(f"{label}.world_trace[{t_idx}] missing 'residues' dict")

    sensory_bus = branch.get("sensory_bus")
    if not isinstance(sensory_bus, list) or len(sensory_bus) != expected_ticks:
        actual = len(sensory_bus) if isinstance(sensory_bus, list) else type(sensory_bus).__name__
        raise ScionBundleSchemaError(
            f"{label}: 'sensory_bus' must be a list of {expected_ticks} entries (got {actual})"
        )

    rule_ledger = branch.get("rule_ledger")
    if not isinstance(rule_ledger, list) or len(rule_ledger) < 4:
        raise ScionBundleSchemaError(f"{label}: 'rule_ledger' must contain at least 4 policies (P1..P4)")

    actor_memory = branch.get("actor_memory")
    if not isinstance(actor_memory, (dict, list)) or len(actor_memory) == 0:
        raise ScionBundleSchemaError(f"{label}: 'actor_memory' must be non-empty")


def _validate_case(case_obj: Any, label: str) -> None:
    if not isinstance(case_obj, dict):
        raise ScionBundleSchemaError(f"{label}: case must be a JSON object")
    case_id = case_obj.get("case_id") or case_obj.get("id")
    if not isinstance(case_id, str) or not case_id.strip():
        raise ScionBundleSchemaError(f"{label}: missing non-empty 'case_id'")

    agents = case_obj.get("agents")
    if not isinstance(agents, (list, dict)) or len(agents) == 0:
        raise ScionBundleSchemaError(f"{label} ({case_id}): missing non-empty 'agents'")

    branch_a, branch_ap = _extract_branches(case_obj, f"{label}({case_id})")
    _validate_branch(branch_a, f"{label}({case_id}).CHECKPOINT_LAWFUL_A")
    _validate_branch(branch_ap, f"{label}({case_id}).BRANCH_CLINAMEN_A_PRIME")

    lineage = branch_ap.get("branch_lineage") or case_obj.get("branch_lineage")
    if not isinstance(lineage, dict) or lineage.get("lawful_verified") is not True:
        raise ScionBundleSchemaError(
            f"{label}({case_id}): Roubaud qualification missing ('branch_lineage.lawful_verified' != True)"
        )
    if not lineage.get("parent_checkpoint_id"):
        raise ScionBundleSchemaError(
            f"{label}({case_id}): missing 'branch_lineage.parent_checkpoint_id'"
        )


def validate_bundle_schema(bundle: Any) -> None:
    """Loudly validate top-level and per-case invariants before compiling workbench."""
    if not isinstance(bundle, dict):
        raise ScionBundleSchemaError("Root bundle must be a JSON object.")

    required_top = ("schema_version", "proof_case", "cities", "lattice_index")
    for key in required_top:
        if key not in bundle:
            raise ScionBundleSchemaError(f"Bundle missing required top-level key: {key!r}")

    schema_ver = bundle.get("schema_version")
    if not isinstance(schema_ver, str) or not schema_ver.startswith("scion-worldtext-"):
        raise ScionBundleSchemaError(
            f"Unsupported or invalid schema_version: {schema_ver!r} (expected 'scion-worldtext-*')"
        )

    _validate_case(bundle["proof_case"], "proof_case")

    cities = bundle.get("cities")
    if not isinstance(cities, list) or len(cities) == 0:
        raise ScionBundleSchemaError("'cities' must be a non-empty list of compiled city swarm cases.")
    for idx, city_case in enumerate(cities):
        _validate_case(city_case, f"cities[{idx}]")

    lattice = bundle.get("lattice_index")
    if not isinstance(lattice, (list, dict)) or len(lattice) == 0:
        raise ScionBundleSchemaError("'lattice_index' must be a non-empty list or dict.")


def load_atlas_manifest(explicit_manifest: Path | None = None) -> Dict[str, Any]:
    """Load `scion_cities/atlas/manifest.json` (merging pack manifests if present, `{}` fallback)."""
    merged: Dict[str, Any] = {}
    if explicit_manifest is not None:
        if explicit_manifest.is_file():
            data = json.loads(explicit_manifest.read_text(encoding="utf-8"))
            if isinstance(data, dict):
                return data
        return {}

    if ATLAS_PACK_MANIFESTS_DIR.is_dir():
        for p in sorted(ATLAS_PACK_MANIFESTS_DIR.glob("*.json")):
            try:
                part = json.loads(p.read_text(encoding="utf-8"))
                if isinstance(part, dict):
                    merged.update(part)
            except Exception:
                pass

    if ATLAS_MANIFEST_PATH.is_file():
        try:
            top = json.loads(ATLAS_MANIFEST_PATH.read_text(encoding="utf-8"))
            if isinstance(top, dict):
                merged.update(top)
        except Exception:
            pass

    return merged


def _load_catalog_55_metadata() -> List[Dict[str, Any]]:
    """Read-only export of Calvino's 55-city lattice genomes for lattice & fork-city UX."""
    if str(ROOT_DIR) not in sys.path:
        sys.path.insert(0, str(ROOT_DIR))
    try:
        from scion_cities.swarms.catalog_55 import CITIES_55  # type: ignore
    except Exception:
        return []

    out: List[Dict[str, Any]] = []
    for c in CITIES_55:
        out.append({
            "index": c.index,
            "name": c.name,
            "chapter": c.chapter,
            "series": c.series,
            "rank": c.rank,
            "weaver_page": c.weaver_page,
            "topology": c.topology,
            "desert_opposed": c.desert_opposed,
            "pole_alpha": c.pole_alpha,
            "pole_beta": c.pole_beta,
            "optical_rule": c.optical_rule,
            "loci": list(c.loci),
            "agents": [
                {
                    "name": a.name,
                    "locus": a.locus,
                    "op_kind": a.op_kind,
                    "polarity": a.polarity,
                    "emblems": list(a.emblems),
                    "base_magnitude": a.base_magnitude,
                    "harmonic_ratio": list(a.harmonic_ratio),
                }
                for a in c.agents
            ],
        })
    return out


def _safe_json_for_html_script(payload: Any) -> str:
    """Serialize JSON and escape closing script/comment sequences safely for inline <script>."""
    raw = json.dumps(payload, ensure_ascii=False, separators=(",", ":"))
    return (
        raw.replace("</", "<\\/")
        .replace("<!--", "<\\!--")
        .replace("\u2028", "\\u2028")
        .replace("\u2029", "\\u2029")
    )


def resolve_bundle_path(explicit_path: str | None = None) -> Path:
    if explicit_path:
        p = Path(explicit_path)
        if not p.is_file():
            raise FileNotFoundError(f"Explicit bundle path does not exist: {p}")
        return p
    if FULL_BUNDLE_PATH.is_file():
        return FULL_BUNDLE_PATH
    if PROOF_BUNDLE_PATH.is_file():
        return PROOF_BUNDLE_PATH
    raise FileNotFoundError(
        f"Neither {FULL_BUNDLE_PATH} nor {PROOF_BUNDLE_PATH} exists yet."
    )


def build_workbench(
    bundle_path: Path | None = None,
    shell_path: Path = SHELL_PATH,
    output_path: Path = OUTPUT_HTML_PATH,
    manifest_path: Path | None = None,
) -> Dict[str, Any]:
    resolved_bundle = resolve_bundle_path(str(bundle_path) if bundle_path else None)
    if not shell_path.is_file():
        raise FileNotFoundError(f"Missing workbench shell template: {shell_path}")

    try:
        bundle_data = json.loads(resolved_bundle.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        raise ScionBundleSchemaError(f"Malformed JSON in {resolved_bundle}: {exc}") from exc

    validate_bundle_schema(bundle_data)
    atlas_manifest = load_atlas_manifest(manifest_path)

    shell_html = shell_path.read_text(encoding="utf-8")
    if BUNDLE_PLACEHOLDER not in shell_html:
        raise RuntimeError(
            f"Shell template {shell_path} is missing injection marker {BUNDLE_PLACEHOLDER!r}"
        )

    catalog_meta = _load_catalog_55_metadata()
    injection_js = (
        f"window.SCION_BUNDLE = {_safe_json_for_html_script(bundle_data)};\n"
        f"window.SCION_ATLAS_MANIFEST = {_safe_json_for_html_script(atlas_manifest)};\n"
        f"window.SCION_CATALOG_55 = {_safe_json_for_html_script(catalog_meta)};\n"
        f"window.SCION_BUNDLE_SOURCE = {json.dumps(resolved_bundle.name)};"
    )

    compiled_html = shell_html.replace(BUNDLE_PLACEHOLDER, injection_js, 1)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(compiled_html, encoding="utf-8")

    return {
        "bundle_source": str(resolved_bundle),
        "shell_path": str(shell_path),
        "output_path": str(output_path),
        "output_bytes": output_path.stat().st_size,
        "city_count": len(bundle_data["cities"]),
        "atlas_plate_entries": len(atlas_manifest),
        "schema_version": bundle_data["schema_version"],
    }


def main(argv: List[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Compile SCION single-file HTML5 workbench.")
    parser.add_argument("--bundle", default=None, help="Optional explicit bundle JSON path.")
    parser.add_argument("--manifest", default=None, help="Optional explicit atlas manifest JSON path.")
    parser.add_argument("--shell", default=str(SHELL_PATH), help="Path to workbench_shell.html.")
    parser.add_argument("--out", default=str(OUTPUT_HTML_PATH), help="Output HTML path.")
    args = parser.parse_args(argv)

    try:
        info = build_workbench(
            bundle_path=Path(args.bundle) if args.bundle else None,
            shell_path=Path(args.shell),
            output_path=Path(args.out),
            manifest_path=Path(args.manifest) if args.manifest else None,
        )
    except (FileNotFoundError, ScionBundleSchemaError, RuntimeError) as exc:
        print(f"[SCION BUILD ERROR] {exc}", file=sys.stderr)
        return 1

    print(
        f"[SCION BUILD OK] source={info['bundle_source']} "
        f"cities={info['city_count']} plates={info['atlas_plate_entries']} "
        f"out={info['output_path']} bytes={info['output_bytes']}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
