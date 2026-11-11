#!/usr/bin/env python3
"""
SCION Great Khan's Atlas Compiler (`build_scion_atlas.py`).

Reads `/Users/gaia/WORLDFUL/scion_cities/build/full_bundle.json` if present,
else `/Users/gaia/WORLDFUL/scion_cities/build/proof_bundle.json`, validates the
canonical SCION bundle schema, loads `/Users/gaia/WORLDFUL/scion_cities/atlas/manifest.json`
(merging `atlas/manifests/*.json` fallback if present), embeds `window.SCION_BUNDLE`,
`window.SCION_ATLAS_MANIFEST`, and `window.SCION_CATALOG_55` into
`studio/atlas_shell.html`, and writes `/Users/gaia/WORLDFUL/scion_atlas.html`.
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any, Dict, List

ROOT_DIR = Path("/Users/gaia/WORLDFUL")
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from scion_cities.build_scion_workbench import (  # noqa: E402
    ScionBundleSchemaError,
    _load_catalog_55_metadata,
    _safe_json_for_html_script,
    load_atlas_manifest,
    resolve_bundle_path,
    validate_bundle_schema,
)

SCION_DIR = ROOT_DIR / "scion_cities"
ATLAS_SHELL_PATH = SCION_DIR / "studio" / "atlas_shell.html"
OUTPUT_ATLAS_HTML_PATH = ROOT_DIR / "scion_atlas.html"
ATLAS_PLACEHOLDER = "/*__SCION_ATLAS_INJECTION__*/"


def _slim_case_for_atlas(case_obj: Dict[str, Any]) -> Dict[str, Any]:
    """Strip 25-tick world_trace/sensory_bus/actor_memory arrays not rendered in the static Atlas folio."""
    branch_a = case_obj.get("CHECKPOINT_LAWFUL_A") or {}
    branch_ap = case_obj.get("BRANCH_CLINAMEN_A_PRIME") or {}
    dag_a = branch_a.get("accumulator_dag") or {}
    dag_ap = branch_ap.get("accumulator_dag") or {}
    return {
        "case_id": case_obj.get("case_id"),
        "kind": case_obj.get("kind"),
        "city_index": case_obj.get("city_index"),
        "city_name": case_obj.get("city_name"),
        "title": case_obj.get("title"),
        "chapter": case_obj.get("chapter"),
        "series": case_obj.get("series"),
        "series_rank": case_obj.get("series_rank"),
        "weaver_page": case_obj.get("weaver_page"),
        "desert_opposed": case_obj.get("desert_opposed"),
        "optical_rule": case_obj.get("optical_rule"),
        "material_nouns": case_obj.get("material_nouns", []),
        "loci": case_obj.get("loci", []),
        "agents": case_obj.get("agents", []),
        "CHECKPOINT_LAWFUL_A": {
            "checkpoint_id": branch_a.get("checkpoint_id"),
            "rule_ledger": branch_a.get("rule_ledger", []),
            "accumulator_dag": {
                "conflict_grains": dag_a.get("conflict_grains", []),
            },
        },
        "BRANCH_CLINAMEN_A_PRIME": {
            "branch_id": branch_ap.get("branch_id"),
            "rule_ledger": branch_ap.get("rule_ledger", []),
            "accumulator_dag": {
                "conflict_grains": dag_ap.get("conflict_grains", []),
            },
        },
        "branch_lineage": case_obj.get("branch_lineage"),
        "divergence_audit": case_obj.get("divergence_audit"),
        "clinamen_inquiry": case_obj.get("clinamen_inquiry"),
        "thick_telemetry": case_obj.get("thick_telemetry"),
    }


def _slim_bundle_for_atlas(bundle_data: Dict[str, Any]) -> Dict[str, Any]:
    return {
        "schema_version": bundle_data.get("schema_version"),
        "palette": bundle_data.get("palette"),
        "afterlight_grammar": bundle_data.get("afterlight_grammar"),
        "proof_case": _slim_case_for_atlas(bundle_data["proof_case"]),
        "cities": [_slim_case_for_atlas(c) for c in bundle_data.get("cities", [])],
        "lattice_index": bundle_data.get("lattice_index"),
        "global_invariants": bundle_data.get("global_invariants"),
    }


def build_atlas(
    bundle_path: Path | None = None,
    shell_path: Path = ATLAS_SHELL_PATH,
    output_path: Path = OUTPUT_ATLAS_HTML_PATH,
    manifest_path: Path | None = None,
) -> Dict[str, Any]:
    resolved_bundle = resolve_bundle_path(str(bundle_path) if bundle_path else None)
    if not shell_path.is_file():
        raise FileNotFoundError(f"Missing atlas shell template: {shell_path}")

    try:
        bundle_data = json.loads(resolved_bundle.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        raise ScionBundleSchemaError(f"Malformed JSON in {resolved_bundle}: {exc}") from exc

    validate_bundle_schema(bundle_data)
    atlas_bundle = _slim_bundle_for_atlas(bundle_data)
    atlas_manifest = load_atlas_manifest(manifest_path)
    catalog_meta = _load_catalog_55_metadata()

    shell_html = shell_path.read_text(encoding="utf-8")
    if ATLAS_PLACEHOLDER not in shell_html:
        raise RuntimeError(
            f"Atlas shell template {shell_path} missing marker {ATLAS_PLACEHOLDER!r}"
        )

    injection_js = (
        f"window.SCION_BUNDLE = {_safe_json_for_html_script(atlas_bundle)};\n"
        f"window.SCION_ATLAS_MANIFEST = {_safe_json_for_html_script(atlas_manifest)};\n"
        f"window.SCION_CATALOG_55 = {_safe_json_for_html_script(catalog_meta)};\n"
        f"window.SCION_BUNDLE_SOURCE = {json.dumps(resolved_bundle.name)};"
    )

    compiled_html = shell_html.replace(ATLAS_PLACEHOLDER, injection_js, 1)
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
    parser = argparse.ArgumentParser(description="Compile SCION Great Khan's Atlas folio HTML.")
    parser.add_argument("--bundle", default=None, help="Optional explicit bundle JSON path.")
    parser.add_argument("--manifest", default=None, help="Optional explicit atlas manifest JSON path.")
    parser.add_argument("--shell", default=str(ATLAS_SHELL_PATH), help="Path to atlas_shell.html.")
    parser.add_argument("--out", default=str(OUTPUT_ATLAS_HTML_PATH), help="Output HTML path.")
    args = parser.parse_args(argv)

    try:
        info = build_atlas(
            bundle_path=Path(args.bundle) if args.bundle else None,
            shell_path=Path(args.shell),
            output_path=Path(args.out),
            manifest_path=Path(args.manifest) if args.manifest else None,
        )
    except (FileNotFoundError, ScionBundleSchemaError, RuntimeError) as exc:
        print(f"[SCION ATLAS BUILD ERROR] {exc}", file=sys.stderr)
        return 1

    print(
        f"[SCION ATLAS BUILD OK] source={info['bundle_source']} "
        f"cities={info['city_count']} plates={info['atlas_plate_entries']} "
        f"out={info['output_path']} bytes={info['output_bytes']}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
