import shutil
from pathlib import Path

src_splash = Path("book images/ChatGPT Image Aug 14, 2026, 05_26_05 PM (4).png")
dest_splash = Path("readable_book/assets/images/splash_hero.png")

if src_splash.exists():
    shutil.copy(src_splash, dest_splash)
    print(f"Copied splash hero image to {dest_splash} ({dest_splash.stat().st_size:,} bytes)")
else:
    print("Warning: src_splash not found!")
