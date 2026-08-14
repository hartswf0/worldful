import os
import shutil
import glob
from pathlib import Path

source_dir = Path("book images")
target_dir = Path("readable_book/assets/images")
target_dir.mkdir(parents=True, exist_ok=True)

# List all png files sorted by creation/modification time
files = sorted(list(source_dir.glob("*.png")), key=lambda x: os.path.getmtime(x))
print(f"Found {len(files)} image files in {source_dir}")

# Map sequentially to worlds 0 to 33
# If 34+ images, map up to 33
for i, f in enumerate(files):
    if i < 34:
        dest_name = f"plate_{i:02d}.png"
        shutil.copy(f, target_dir / dest_name)
        print(f"Mapped {f.name[:30]}... -> {dest_name} ({f.stat().st_size:,} bytes)")

print("All book images successfully mapped and copied to assets/images.")
