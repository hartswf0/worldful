ZETTEL

ID:
ZET-INTERFACE-SCHEMA-AS-PROMPT-2026

TITLE:
Tool Design Can Carry Instructions That No Longer Need to Be Stated in the Prompt

SOURCE:
Thariq Shihipar - “The New Rules of Context Engineering for Claude 5 Generation Models” - Claude by Anthropic - 24 July 2026. ([Claude](https://claude.com/blog/the-new-rules-of-context-engineering-for-claude-5-generation-models?reference=FUZZ))

PASSAGE:
Anthropic contrasts supplying examples with designing interfaces whose schemas and allowed parameters guide model behavior.

RESEARCH OBJECT:
The tool interface as metapragmatic prompt.

LOCAL MOVE:
Connects GUI-as-language to agent tool use: action spaces themselves can teach the model which moves are grammatical.

SOURCE TERMS:
interfaces; tools; schemas; parameters; examples; context engineering.

WHAT BECAME STRANGE:
Instruction can disappear from prose because the affordance structure of the tool already constrains possible action.

QUESTION:
When is a schema merely an API contract, and when is it functioning as prompt?

DEEPER QUESTION:
Can software architecture be analyzed as language addressed simultaneously to human and model implied readers?

MECHANISM:
Enumerated operations and typed parameters restrict and signal the space of plausible continuations.

FORMAL SHIFT:
PROMPT TELLS MODEL WHAT TO DO → TOOL ONTOLOGY MAKES CERTAIN DOINGS EXPRESSIBLE.

SOURCE FORMALISM:
Tool/interface structure participates in context engineering.

OUR FORMALIZATION:
[OUR FORMALIZATION - NOT SOURCE SYNTAX]
TOOL_SCHEMA = executable metapragmatics: it specifies what kinds of utterance/action can count as valid next moves.

TENSION:
A well-structured tool reduces ambiguity but may recreate Suchman’s problem of disciplining action through predefined categories.

MISSING:
Comparative evidence between schema-constrained and open-ended tool interfaces.

BOUNDARY:
Tool schemas do not determine correct use; model inference and surrounding context remain necessary.

CITATION TRAIL:
Claude context engineering → GUI language → Winograd/Suchman → thick prompting.

TEST:
Expose identical capability through a permissive generic action API and a semantically typed tool schema; keep user prompt fixed and compare error patterns.

PLATFORM:
Agent tools / HCI.

LINKS:
ZET-GUI-SPATIAL-LANGUAGE; ZET-METAPRAGMATICS; ZET-SUCHMAN-CATEGORIES-POLITICS-1994; ZET-IMPLIED-USER.

BIBTEX:
@misc{Shihipar2026ContextEngineering, author={Thariq Shihipar}, title={The New Rules of Context Engineering for Claude 5 Generation Models}, year={2026}, howpublished={Claude by Anthropic}}
```

```text
