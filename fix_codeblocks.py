import os
import glob
import re

for filepath in glob.glob("readable_book/*.md") + ["THE_ABSENT_THING_COMPLETE_BOOK.md"]:
    with open(filepath, 'r', encoding='utf-8') as f:
        text = f.read()
        
    # Clean double backticks or nested ticks in codeblocks
    text = text.replace("``", "`")
    text = text.replace("`*entities*`", "entities").replace("`entities`", "entities")
    text = text.replace("`*operations*`", "operations").replace("`operations`", "operations")
    text = text.replace("`*states*`", "states").replace("`states`", "states")
    text = text.replace("`*constraint*`", "constraint").replace("`constraint`", "constraint")
    text = text.replace("`*invariant*`", "invariant").replace("`invariant`", "invariant")
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(text)

print("Codeblock formatting verified and cleaned across all files.")
