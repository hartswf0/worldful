import os
import glob

files = sorted(glob.glob("*.md"))
for f in files:
    size = os.path.getsize(f)
    print(f"{f:35s} {size:>8,} bytes")
