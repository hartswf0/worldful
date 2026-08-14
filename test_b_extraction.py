import re

with open('b.md', 'r', encoding='utf-8') as f:
    b_raw = f.read()

b_sections = {}
for chunk in re.split(r'(?=(?:^|\n)#\s*(?:\d+\.|CONCLUSION))', b_raw):
    chunk = chunk.strip()
    m = re.match(r'^#\s*(\d+)\.\s+([^\n]+)', chunk)
    if m:
        wid = int(m.group(1))
        b_sections[wid] = chunk
    elif 'CONCLUSION' in chunk:
        b_sections[33] = chunk

def extract_b_specs(raw):
    m_skel = re.search(r'## 2\.\s*<Theory Skeleton>(.*?)(?=## 3\.|\Z)', raw, re.DOTALL | re.I)
    skeleton = m_skel.group(1).strip() if m_skel else ""
    
    m_op = re.search(r'## 4\.\s*<Operational Description>(.*?)(?=## 5\.|\Z)', raw, re.DOTALL | re.I)
    operational = m_op.group(1).strip() if m_op else ""
    
    m_test = re.search(r'## 6\.\s*<Change Test>(.*?)(?=## 7\.|\Z)', raw, re.DOTALL | re.I)
    change_test = m_test.group(1).strip() if m_test else ""
    
    return skeleton, operational, change_test

s, o, t = extract_b_specs(b_sections[1])
print("Skeleton:", s[:150])
print("Operational:", o[:150])
print("Test:", t[:150])
