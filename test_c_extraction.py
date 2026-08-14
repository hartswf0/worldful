import re

with open('c.md', 'r', encoding='utf-8') as f:
    c_raw = f.read()

c_sections = {}
for chunk in re.split(r'(?=(?:^|\n)#\s*(?:\d+\.|CONCLUSION))', c_raw):
    chunk = chunk.strip()
    m = re.match(r'^#\s*(\d+)\.\s+([^—\n]+)', chunk)
    if m:
        wid = int(m.group(1))
        c_sections[wid] = chunk
    elif 'CONCLUSION' in chunk:
        c_sections[33] = chunk

def extract_lineage(raw):
    # Search in raw text before cleaning
    grounded = ""
    literature = ""
    code_math = ""
    
    m_ground = re.search(r'\*\*`?<Grounded-memory lineage>`?\*\*\s*(.+?)(?=\n\n\*\*`?<Literature|\Z)', raw, re.DOTALL | re.I)
    if m_ground:
        grounded = m_ground.group(1).strip()
        
    m_lit = re.search(r'\*\*`?<Literature lineage>`?\*\*\s*(.+?)(?=\n\n\*\*`?<Code/math|\Z)', raw, re.DOTALL | re.I)
    if m_lit:
        literature = m_lit.group(1).strip()
        
    m_code = re.search(r'\*\*`?<Code/math lineage>`?\*\*\s*(.+?)(?=\n\n#|\Z)', raw, re.DOTALL | re.I)
    if m_code:
        code_math = m_code.group(1).strip()
        
    return grounded, literature, code_math

g, l, c = extract_lineage(c_sections[1])
print("Grounded:", g[:100])
print("Literature:", l[:100])
print("Code/Math:", c[:100])
