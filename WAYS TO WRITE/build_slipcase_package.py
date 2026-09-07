import os
import sys
import re
import glob
import json
import hashlib
import zipfile
import subprocess
from datetime import datetime

base_dir = "/Users/gaia/WORLDFUL"
pkg_dir = os.path.join(base_dir, "slipcase")
os.makedirs(pkg_dir, exist_ok=True)

# Subdirectories
subdirs = ["_MD", "_MOCS", "_ARRANGEMENTS", "_PROMPTS", "_RESOURCES", "_SLIPCASE"]
for sd in subdirs:
    os.makedirs(os.path.join(pkg_dir, sd), exist_ok=True)

print("Starting compilation of SLIPCASE — Portable Research Field...")
