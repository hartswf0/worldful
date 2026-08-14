import re

for wid in [0, 1, 2, 5, 12, 15, 20, 22]:
    print(f"=== WORLD {wid} ===")
    
    # Check e.md (Ecology of Description)
    with open("e.md", "r", encoding="utf-8") as f:
        e_content = f.read()
    e_match = re.search(rf'##\s+{wid}\.\s+([^\n]+)\n(.*?)(?=##\s+\d+\.|\Z)', e_content, re.DOTALL)
    if e_match:
        print(f"  [e.md Ecology]: {e_match.group(1)}")
        print(f"    {e_match.group(2).strip()[:200]}...")
        
    # Check k.md (Geertzian Cultural Systems)
    with open("k.md", "r", encoding="utf-8") as f:
        k_content = f.read()
    k_match = re.search(rf'##\s+{wid}\.\s+([^\n]+)\n(.*?)(?=##\s+\d+\.|\Z)', k_content, re.DOTALL)
    if k_match:
        print(f"  [k.md Geertzian]: {k_match.group(1)}")
        print(f"    {k_match.group(2).strip()[:200]}...")

    # Check c.md (Lineages)
    with open("c.md", "r", encoding="utf-8") as f:
        c_content = f.read()
    c_match = re.search(rf'##\s+{wid}\.\s+([^\n]+)\n(.*?)(?=##\s+\d+\.|\Z)', c_content, re.DOTALL)
    if c_match:
        print(f"  [c.md Lineage]: {c_match.group(1)}")
        print(f"    {c_match.group(2).strip()[:200]}...")
    print()
