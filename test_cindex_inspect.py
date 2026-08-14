import re

with open('cindex', 'r', encoding='utf-8') as f:
    text = f.read()

print("File size:", len(text))
# Check what sections or tags exist in cindex
headings = re.findall(r'<[^>]+>|/\*.*?\*/', text[:3000])
print("Sample tags/comments:", headings[:20])

# Look for text structures inside cindex
matches = re.findall(r'class="[^"]+"', text)
print("Classes sample:", set(matches[:30]))
