"""
SCION v1.0 — Archival Cartographic Survey & Multiplane Architectural Plate Engine.

Couples handmade `.svg` and `.png` plates (`1200x900` Survey Maps, `1200x800`
Architectural Elevations) directly to canonical `CitySwarmSpec`, `world_trace`
physical residues, `ConflictGrain` arch keystones, and Calvino material nouns.
"""
from scion_cities.atlas.plate_engine import (
    IMAGE_DIMENSIONS,
    MAP_DIMENSIONS,
    WORLDFUL_PALETTE,
    ImagePlateBuilder,
    MapPlateBuilder,
    PlateRenderResult,
    render_dual_plate,
    verify_plate_pair,
)

__all__ = [
    "MAP_DIMENSIONS",
    "IMAGE_DIMENSIONS",
    "WORLDFUL_PALETTE",
    "MapPlateBuilder",
    "ImagePlateBuilder",
    "PlateRenderResult",
    "render_dual_plate",
    "verify_plate_pair",
]
