import re
import glob

# Clean up all link patterns across markdown files
for filepath in glob.glob("readable_book/*.md") + ["THE_ABSENT_THING_COMPLETE_BOOK.md"]:
    with open(filepath, 'r', encoding='utf-8') as f:
        text = f.read()

    # Replace file://./34_master_glossary_and_index.md#xyz with #xyz or glossary anchor
    text = re.sub(r'\(file://\./34_master_glossary_and_index\.md#([^)]+)\)', r'(#\1)', text)
    text = re.sub(r'\(file://\./\d+_[^)]+\.md\)', r'#', text)
    text = re.sub(r'\(file://\./README\.md\)', r'#', text)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(text)

print("All broken file:// links converted to safe anchor links across all markdown files.")
