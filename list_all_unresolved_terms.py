from update_readable_book import CHAPTERS
from enhance_books import PRAGMATIC_METADATA

all_terms = {}
for wid in range(34):
    cdata = CHAPTERS[wid]
    meta = PRAGMATIC_METADATA.get(wid, {})
    existing = meta.get("key_terms", {})
    
    world_terms = cdata.get("terms", [])
    for t in world_terms:
        if t.lower() not in [k.lower() for k in existing.keys()]:
            all_terms[t] = wid

print(f"Total terms needing real deep definitions: {len(all_terms)}")
for t, wid in sorted(all_terms.items(), key=lambda x: x[1]):
    print(f"World {wid:02d} ({CHAPTERS[wid]['title']}): '{t}'")
