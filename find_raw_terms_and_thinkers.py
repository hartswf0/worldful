import re
import os
import glob

files = glob.glob("*.md") + glob.glob("readable_book/*.md")

print(f"Checking {len(files)} markdown files for bracketed terms and thinkers...")

bracket_terms = set()
thinkers = set()

thinker_patterns = [
    r'\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s*\((?:19\d\d|20\d\d|18\d\d|[A-Z][a-z]+)\)',
    r'\b(?:Wittgenstein|Searle|Peirce|Shannon|Bateson|Geertz|Polanyi|Taleb|Heidegger|Tomasello|Sperber|Wilson|Bühler|Grice|Bruner|Latour|Williams|Hobsbawm|Scott|Haraway|Goffman|Vygotsky|Gibson|Foucault|Merleau-Ponty|Luhmann|Kahneman|Tversky|Austin|Habermas|Simondon|Stiegler|Chomsky|Jakobson|Saussure|Bakhtin|Benjamin|Adorno|Arendt|Canguilhem|Serres|Sloterdijk|Dewey|James|Mead|Garfinkel|Sacks|Schegloff|Levinson|Clark|Hutchins|Suchman|Winograd|Flores|Dreyfus|Varela|Maturana|Wiener|Ashby|von Foerster|Simon|Minsky|Pearl|Jaynes|MacKay)\b'
]

for fpath in files:
    with open(fpath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
        
        # Find <term>
        matches = re.findall(r'<([^<>]{2,50})>', content)
        for m in matches:
            if not m.startswith('http') and not m.startswith('/') and not m.startswith('div') and not m.startswith('span') and not m.startswith('img'):
                bracket_terms.add(m.strip())
                
        # Find thinkers
        for p in thinker_patterns:
            t_matches = re.findall(p, content)
            for tm in t_matches:
                if len(tm) > 2:
                    thinkers.add(tm.strip())

print(f"\nFound {len(bracket_terms)} bracketed `<...>` terms in raw books:")
for t in sorted(bracket_terms)[:40]:
    print("  <" + t + ">")

print(f"\nFound {len(thinkers)} thinkers referenced across raw source books:")
print(", ".join(sorted(thinkers)))

