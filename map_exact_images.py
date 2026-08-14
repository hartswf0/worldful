import shutil
import os
from pathlib import Path

source_dir = Path("book images")
target_dir = Path("readable_book/assets/images")
target_dir.mkdir(parents=True, exist_ok=True)

# Exact 1-to-1 OCR mapping verified
EXACT_MAPPING = {
    0: "ChatGPT Image Aug 14, 2026, 05_28_34 PM (1).png",
    1: "ChatGPT Image Aug 14, 2026, 05_28_34 PM (2).png",
    2: "ChatGPT Image Aug 14, 2026, 05_28_35 PM (3).png",
    3: "ChatGPT Image Aug 14, 2026, 05_28_35 PM (4).png",
    4: "ChatGPT Image Aug 14, 2026, 05_28_36 PM (5).png",
    5: "ChatGPT Image Aug 14, 2026, 05_28_36 PM (6).png",
    6: "ChatGPT Image Aug 14, 2026, 05_28_37 PM (7).png",
    7: "ChatGPT Image Aug 14, 2026, 05_28_37 PM (8).png",
    8: "ChatGPT Image Aug 14, 2026, 05_28_38 PM (9).png",
    9: "ChatGPT Image Aug 14, 2026, 05_28_38 PM (10).png",
    10: "ChatGPT Image Aug 14, 2026, 05_28_49 PM (1).png",
    11: "ChatGPT Image Aug 14, 2026, 05_28_49 PM (2).png",
    12: "ChatGPT Image Aug 14, 2026, 05_28_50 PM (3).png",
    13: "ChatGPT Image Aug 14, 2026, 05_28_50 PM (4).png",
    14: "ChatGPT Image Aug 14, 2026, 05_28_50 PM (5).png",
    15: "ChatGPT Image Aug 14, 2026, 05_28_51 PM (6).png",
    16: "ChatGPT Image Aug 14, 2026, 05_28_51 PM (7).png",
    17: "ChatGPT Image Aug 14, 2026, 05_28_51 PM (8).png",
    18: "ChatGPT Image Aug 14, 2026, 05_28_52 PM (9).png",
    19: "ChatGPT Image Aug 14, 2026, 05_28_52 PM (10).png",
    20: "ChatGPT Image Aug 14, 2026, 05_29_13 PM (1).png",
    21: "ChatGPT Image Aug 14, 2026, 05_29_14 PM (2).png",
    22: "ChatGPT Image Aug 14, 2026, 05_29_14 PM (3).png",
    23: "ChatGPT Image Aug 14, 2026, 05_29_14 PM (4).png",
    24: "ChatGPT Image Aug 14, 2026, 05_29_14 PM (5).png",
    25: "ChatGPT Image Aug 14, 2026, 05_29_15 PM (6).png",
    26: "ChatGPT Image Aug 14, 2026, 05_29_15 PM (7).png",
    27: "ChatGPT Image Aug 14, 2026, 05_29_15 PM (8).png",
    28: "ChatGPT Image Aug 14, 2026, 05_29_16 PM (9).png",
    29: "ChatGPT Image Aug 14, 2026, 05_29_16 PM (10).png",
    30: "ChatGPT Image Aug 14, 2026, 05_33_47 PM (1).png",
    31: "ChatGPT Image Aug 14, 2026, 05_33_47 PM (2).png",
    32: "ChatGPT Image Aug 14, 2026, 05_33_47 PM (3).png",
    33: "ChatGPT Image Aug 14, 2026, 05_33_48 PM (4).png",
}

for wid, fname in EXACT_MAPPING.items():
    src = source_dir / fname
    dest = target_dir / f"plate_{wid:02d}.png"
    if src.exists():
        shutil.copy(src, dest)
        print(f"[Copied] World {wid:02d} -> {dest.name} ({fname[:32]}...)")
    else:
        print(f"[MISSING] {fname}")

print("Exact image mapping complete!")
