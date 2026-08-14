from enhance_books import PRAGMATIC_METADATA
from update_readable_book import CHAPTERS

for wid in range(10):
    cdata = CHAPTERS[wid]
    meta = PRAGMATIC_METADATA.get(wid, {})
    print(f"World {wid}: {cdata['title']}")
    print("  Subtitle:", cdata['subtitle'])
    print("  Invariant:", cdata['invariant'][:100])
    print("  Core Problem:", meta.get('core_problem', ''))
    print("  Decision Rule:", meta.get('decision_rule', ''))
    print()
