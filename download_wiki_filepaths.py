import subprocess
from pathlib import Path

assets_dir = Path("readable_book/assets/images/wiki")
assets_dir.mkdir(parents=True, exist_ok=True)

files = {
    "moai_heads.jpg": "https://commons.wikimedia.org/wiki/Special:FilePath/Moai%20Rano%20raraku.jpg?width=640",
    "dufour_map_left.jpg": "https://commons.wikimedia.org/wiki/Special:FilePath/Aare%20Zihl%20%28Swisstopo%20Dufourkarte%20Blatt%20VII.%20Porrentruy%20Solothurn%201845%29.jpg?width=800",
    "summer_tanager.jpg": "https://commons.wikimedia.org/wiki/Special:FilePath/Summer%20Tanager%20%287093040863%29.jpg?width=640",
    "snake_river_valley.jpg": "https://commons.wikimedia.org/wiki/Special:FilePath/Adams%20The%20Tetons%20and%20the%20Snake%20River.jpg?width=800",
    "dufour_map_right.jpg": "https://commons.wikimedia.org/wiki/Special:FilePath/Aarboden%20Brienz%20Dufourkarte.jpg?width=800",
    "octopus_merculiano.jpg": "https://commons.wikimedia.org/wiki/Special:FilePath/Octopus%20vulgaris%20Merculiano.jpg?width=640",
    "adams_taos_church.jpg": "https://commons.wikimedia.org/wiki/Special:FilePath/Adams%20Church%20Taos%20Pueblo.jpg?width=640"
}

for fname, url in files.items():
    dest = assets_dir / fname
    cmd = ["curl", "-L", "-s", "-A", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36", url, "-o", str(dest)]
    subprocess.run(cmd)
    size = dest.stat().st_size if dest.exists() else 0
    print(f"{fname}: {size:,} bytes")
