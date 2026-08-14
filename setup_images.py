import shutil
import glob
from pathlib import Path

IMG_DIR = Path("readable_book/assets/images")
IMG_DIR.mkdir(parents=True, exist_ok=True)

# Copy generated images from artifacts
artifact_dir = Path("/Users/gaia/.gemini/antigravity-ide/brain/5e420ba9-6dae-4df6-bda5-2536958d233f")

for pattern, target in [
    ("worldful_hero_plate_*.jpg", "hero_plate.jpg"),
    ("worldful_plate_crossing_*.jpg", "plate_00.jpg"),
    ("worldful_plate_pointing_*.jpg", "plate_01.jpg"),
]:
    matches = list(artifact_dir.glob(pattern))
    if matches:
        shutil.copy(matches[-1], IMG_DIR / target)
        print(f"Copied {matches[-1].name} to {IMG_DIR / target}")

print("Image setup complete.")
