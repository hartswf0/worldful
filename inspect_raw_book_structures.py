import os
import glob
import re

for fname in ['c.md', 'e.md', 'k.md', 'a.md', 'GOT_396_completions_DeltaDelta.md']:
    if os.path.exists(fname):
        size = os.path.getsize(fname)
        with open(fname, 'r', encoding='utf-8', errors='ignore') as f:
            head = "".join([f.readline() for _ in range(35)])
        print(f"=== {fname} ({size:,} bytes) ===")
        print(head[:600])
        print("...\n")
