import re
import glob

# Comprehensive emoji regex
emoji_pattern = re.compile(
    "["
    "\U0001F1E0-\U0001F1FF"  # flags (iOS)
    "\U0001F300-\U0001F5FF"  # symbols & pictographs
    "\U0001F600-\U0001F64F"  # emoticons
    "\U0001F680-\U0001F6FF"  # transport & map symbols
    "\U0001F700-\U0001F77F"  # alchemical symbols
    "\U0001F780-\U0001F7FF"  # Geometric Shapes Extended
    "\U0001F800-\U0001F8FF"  # Supplemental Arrows-C
    "\U0001F900-\U0001F9FF"  # Supplemental Symbols and Pictographs
    "\U0001FA00-\U0001FA6F"  # Chess Symbols
    "\U0001FA70-\U0001FAFF"  # Symbols and Pictographs Extended-A
    "\U00002702-\U000027B0"  # Dingbats
    "\U000024C2-\U0001F251"
    "\U0001F900-\U0001F9FF"
    "\U0001F600-\U0001F64F"
    "\U0001F300-\U0001F5FF"
    "\U0001F680-\U0001F6FF"
    "\U00002600-\U000026FF"
    "]+", flags=re.UNICODE
)

files = glob.glob("readable_book/*.md") + ["THE_ABSENT_THING_COMPLETE_BOOK.md", "readable_book/README.md"]
for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace navigation text
    content = content.replace("⬅️ Prev:", "Previous:").replace("➡️ Next:", "Next:")
    content = content.replace("📖 [Table of Contents]", "[Table of Contents]").replace("📚 [Master Glossary]", "[Master Glossary]")
    content = content.replace("🔝 Back to Table of Contents", "Back to Table of Contents").replace("📚 Jump to Glossary", "Jump to Glossary")
    content = content.replace("🏺 Lived Historical & Material Ancestry", "Lived Historical & Material Ancestry")
    content = content.replace("📚 Philosophical & Sociological Thinkers", "Philosophical & Sociological Thinkers")
    content = content.replace("⚙️ Computational & Cybernetic Lineage", "Computational & Cybernetic Lineage")
    content = content.replace("🔑 Core Concepts Defined in This Chapter", "Core Concepts Defined in This Chapter")
    content = content.replace("🔑 Key Concepts in This Chapter", "Key Concepts in This Chapter")
    content = content.replace("📑 TABLE OF CONTENTS", "TABLE OF CONTENTS")
    content = content.replace("📑 Chapters", "Chapters")
    content = content.replace("📖 Complete Single-Volume File", "Complete Single-Volume File")
    content = content.replace("📚 Hyperlinked Master Glossary", "Hyperlinked Master Glossary")
    
    # Strip any remaining emojis
    content = emoji_pattern.sub("", content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("All emojis permanently stripped from all markdown documents.")
