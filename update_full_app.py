import re

with open("build_eink_omnibus_worldful.py", "r", encoding="utf-8") as f:
    eink_code = f.read()

from fix_exact_scroll_and_hero import new_js_scroll, hero_proportional_css

# Update scroll in template
with open("build_aura_collage_worldful.py", "r", encoding="utf-8") as f:
    aura_code = f.read()

# Replace mobile CSS in aura template
aura_code_fixed = re.sub(r'/\* =========================================================\s+MOBILE REFLOW.*?\}\s*</style>', hero_proportional_css + '\n</style>', aura_code, flags=re.DOTALL)

# Replace JS scroll in aura template
aura_code_fixed = re.sub(r'function openReaderAtWorld\(id\) \{.*?function setupReaderScrollSpy\(\) \{.*?\n  \}', new_js_scroll, aura_code_fixed, flags=re.DOTALL)

with open("build_aura_collage_worldful.py", "w", encoding="utf-8") as f:
    f.write(aura_code_fixed)

