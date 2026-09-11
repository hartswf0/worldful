#!/usr/bin/env python3
"""
build_defense_presentation.py
Synchronizes and verifies the 30-minute, 18-slide doctoral dissertation proposal defense engine:
"Operative Humanities & The Construction of Language Games"
for Watson Hartsoe's PhD Proposal Defense at Georgia Tech.
"""

import os
import shutil

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    src = os.path.join(base_dir, "dissertation_proposal_defense_30min.html")
    dst = os.path.join(base_dir, "PUT THAT THERE", "dissertation_proposal_defense_30min.html")

    if not os.path.exists(src):
        print(f"Error: Source file {src} does not exist.")
        return 1

    shutil.copyfile(src, dst)
    size = os.path.getsize(dst)
    print(f"Synchronized defense presentation to {dst} ({size} bytes).")
    return 0

if __name__ == '__main__':
    exit(main())
