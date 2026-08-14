import urllib.request
import os
from pathlib import Path

assets_dir = Path("readable_book/assets/images/wiki")
assets_dir.mkdir(parents=True, exist_ok=True)

urls = {
    "moai_heads.jpg": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Moai_Rano_raraku.jpg/500px-Moai_Rano_raraku.jpg",
    "dufour_map_left.jpg": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Aare_Zihl_%28Swisstopo_Dufourkarte_Blatt_VII._Porrentruy_Solothurn_1845%29.jpg/800px-Aare_Zihl_%28Swisstopo_Dufourkarte_Blatt_VII._Porrentruy_Solothurn_1845%29.jpg",
    "summer_tanager.jpg": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Summer_Tanager_%287093040863%29.jpg/480px-Summer_Tanager_%287093040863%29.jpg",
    "snake_river_valley.jpg": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Adams_The_Tetons_and_the_Snake_River.jpg/800px-Adams_The_Tetons_and_the_Snake_River.jpg",
    "dufour_map_right.jpg": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Aarboden_Brienz_Dufourkarte.jpg/900px-Aarboden_Brienz_Dufourkarte.jpg",
    "octopus_merculiano.jpg": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Octopus_vulgaris_Merculiano.jpg/560px-Octopus_vulgaris_Merculiano.jpg",
    "adams_taos_church.jpg": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Adams_Church_Taos_Pueblo.jpg/600px-Adams_Church_Taos_Pueblo.jpg"
}

headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'}

for fname, url in urls.items():
    dest = assets_dir / fname
    if not dest.exists() or dest.stat().st_size < 1000:
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=10) as resp, open(dest, 'wb') as out:
                out.write(resp.read())
            print(f"Downloaded {fname}: {dest.stat().st_size:,} bytes")
        except Exception as e:
            print(f"Failed to download {fname}: {e}")
    else:
        print(f"Already exists {fname}: {dest.stat().st_size:,} bytes")
