import re

text = """
# 0. THE CROSSING

“I will first construct the <theory-of-the-program>, then generate <program text> only after the theory is explicit.”

## 1. <Initial Interpretation>

This is a `\<program theory problem>` about **how an absent cause acquires present force**. The real activity is not “communication” in general. It is the transfer of actionable difference across separation: the wolf leaves, the trace remains, another body changes course.

The world must make one asymmetry impossible to ignore: `\<source>` disappears while `\<consequence>` persists.

## 2. <Theory Skeleton>

Main `\<entities>`: `\<wolf>`, `\<track>`, `\<hunter>`, `\<child>`, `\<forked-path>`, `\<danger>`, `\<warning>`, `\<later-generation>`.

Main `[operations]`: `[leave-trace]`, `[notice]`, `[interpret]`, `[point]`, `[redirect]`, `[remember]`, `[retransmit]`.

Main `\<states>`: `\<encounter>`, `\<absence>`, `\<trace-present>`, `\<interpreted-danger>`, `\<altered-route>`.

Main `\<constraint>`: the child must never encounter the original wolf.

Main `\<invariant>`: `\<source> ≠ \<representation>`, yet `[representation alters] <action>`.

## 3. <Assumption Ledger>

`<safe>` A trace can carry actionable evidence after its cause is gone.

`<safe>` Successful description need not preserve most properties of its source.

`<uncertain>` The transition from trace-reading to description is philosophically fuzzy.

`<requires-user-decision>` None. The ambiguity is the point.

## 4. <Operational Description>

`<wolf>` `[crosses]` `<trail>`.

`<wolf>` `[produces]` `<track>`.

`<wolf>` `[leaves]` `<scene>`.

`<hunter>` `[reads]` `<track>`.

`<track>` `[transforms into]` `<warning>` only through `<hunter>`.

`<warning>` `[redirects]` `<child>`.

`<child>` `[survives-or-avoids-risk-without-encountering]` `<wolf>`.
"""

def clean_pseudo_code(content):
    # Remove escaped angle brackets like \<entity\> -> entity
    content = re.sub(r'\\<([^>]+)\\>', r'*\1*', content)
    content = re.sub(r'\\<([^>]+)>', r'*\1*', content)
    content = re.sub(r'<([^>]+)>', r'*\1*', content)
    
    # Clean up operations [leave-trace] -> `leave-trace` or plain text
    content = re.sub(r'\[([a-z\-]+)\]', r'`\1`', content)
    
    # Fix heading tags like ## 1. *Initial Interpretation* -> ## 1. Initial Interpretation
    content = re.sub(r'## (\d+)\.\s*\*([^*]+)\*', r'## \1. \2', content)
    
    # Format operational flows
    # e.g. *wolf* `crosses` *trail*. -> - **Step:** *Wolf* crosses *trail*
    lines = content.splitlines()
    new_lines = []
    for line in lines:
        if line.startswith('*safe*'):
            new_lines.append(line.replace('*safe*', '✓ **Confirmed Assumption:**'))
        elif line.startswith('*uncertain*'):
            new_lines.append(line.replace('*uncertain*', '⚠️ **Open Uncertainty:**'))
        elif line.startswith('*requires-user-decision*'):
            new_lines.append(line.replace('*requires-user-decision*', '❓ **Decision Point:**'))
        else:
            new_lines.append(line)
    return "\n".join(new_lines)

print(clean_pseudo_code(text))
