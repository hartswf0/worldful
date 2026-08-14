import re

with open("build_eink_omnibus_worldful.py", "r", encoding="utf-8") as f:
    code = f.read()

# Fix re.sub call
code_fixed = code.replace(
    "full_html = re.sub(r'function formatCodeTerminal\\(raw\\) \\{.*?function openConceptSideDrawer\\(rawTerm, wid\\) \\{.*?\\n  \\}', drawer_js_eink, full_html, flags=re.DOTALL)",
    "full_html = re.sub(r'function formatCodeTerminal\\(raw\\) \\{.*?function openConceptSideDrawer\\(rawTerm, wid\\) \\{.*?\\n  \\}', lambda m: drawer_js_eink, full_html, flags=re.DOTALL)"
).replace(
    "full_html = re.sub(r'<!-- ==================== AUTHENTIC MONOSPACE FIELD TERMINAL DRAWER.*?<!-- ==================== SEARCH MODAL ==================== -->', eink_drawer_html + '\\n\\n<!-- ==================== SEARCH MODAL ==================== -->', full_html, flags=re.DOTALL)",
    "full_html = re.sub(r'<!-- ==================== AUTHENTIC MONOSPACE FIELD TERMINAL DRAWER.*?<!-- ==================== SEARCH MODAL ==================== -->', lambda m: eink_drawer_html + '\\n\\n<!-- ==================== SEARCH MODAL ==================== -->', full_html, flags=re.DOTALL)"
).replace(
    "full_html = re.sub(r'function openReaderAtWorld\\(id\\) \\{.*?\\n  \\}', scroll_func, full_html, flags=re.DOTALL)",
    "full_html = re.sub(r'function openReaderAtWorld\\(id\\) \\{.*?\\n  \\}', lambda m: scroll_func, full_html, flags=re.DOTALL)"
)

with open("build_eink_omnibus_worldful.py", "w", encoding="utf-8") as f:
    f.write(code_fixed)

