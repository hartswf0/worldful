from synthesize_master_edition import extract_lineage, extract_b_specs
from enhance_books import PRAGMATIC_METADATA
from update_readable_book import CHAPTERS

for wid in range(3):
    grounded, literature, code_math = extract_lineage(wid)
    skeleton, assumptions, operational, change_test = extract_b_specs(wid)
    meta = PRAGMATIC_METADATA.get(wid, {})
    
    print(f"=== WORLD {wid}: {CHAPTERS[wid]['title']} ===")
    print("THINKERS / LITERATURE:\n", literature[:200])
    print("GROUNDED ANCESTRY:\n", grounded[:200])
    print("CODE / MATH:\n", code_math[:200])
    print("SKELETON:\n", skeleton[:150])
    print("OPERATIONAL:\n", operational[:150])
    print("CHANGE TEST:\n", change_test[:150])
    print("CORE PROBLEM:", meta.get("core_problem", ""))
    print("DECISION RULE:", meta.get("decision_rule", ""))
    print("KEY TERMS:", list(meta.get("key_terms", {}).keys()))
    print()
