import re

with open("index.html", "r", encoding="utf-8") as f:
    content = f.read()

# Let's inspect openReaderAtWorld and jumpReaderToId
scroll_func = """  function openReaderAtWorld(id) {
    const overlay = document.getElementById('reader-overlay-view');
    overlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
      jumpReaderToId(id, true);
      setupReaderScrollSpy();
    }, 40);
  }

  function closeReaderModal() {
    document.getElementById('reader-overlay-view').style.display = 'none';
    document.body.style.overflow = '';
    closeSideMarginalia();
  }

  function jumpReaderToId(id, instant = false) {
    currentReaderId = id;
    const overlay = document.getElementById('reader-overlay-view');
    const target = document.getElementById('monograph-block-' + id);
    if (target) {
      if (instant) {
        target.scrollIntoView({ behavior: 'auto', block: 'start' });
      } else {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      updateReaderTopLabel(id);
    }
  }"""

# Update both in index.html and reader.html
content_fixed = re.sub(r'function openReaderAtWorld\(id\) \{.*?\n  \}', scroll_func, content, flags=re.DOTALL)

with open("index.html", "w", encoding="utf-8") as f:
    f.write(content_fixed)

with open("reader.html", "w", encoding="utf-8") as f:
    f.write(content_fixed)

# Also update build_complete_omnibus_worldful.py so future builds retain this fix
with open("build_complete_omnibus_worldful.py", "r", encoding="utf-8") as f:
    build_script = f.read()

build_script_fixed = re.sub(r'function openReaderAtWorld\(id\) \{.*?\n  \}', scroll_func, build_script, flags=re.DOTALL)
with open("build_complete_omnibus_worldful.py", "w", encoding="utf-8") as f:
    f.write(build_script_fixed)

print("Reader scroll fix applied cleanly!")
