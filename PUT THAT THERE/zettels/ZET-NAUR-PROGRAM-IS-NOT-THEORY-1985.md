ZETTEL

ID:
ZET-NAUR-PROGRAM-IS-NOT-THEORY-1985

TITLE:
The Program Text Is Not the Primary Object of Programming

SOURCE:
Peter Naur - “Programming as Theory Building” - 1985. ([Naur](https://www.naur.com/comp/c1-4.html))

PASSAGE:
Naur’s abstract makes the primary aim not program production but programmers building theories of how problems are solved by program execution.

RESEARCH OBJECT:
Whether a codebase can function as a complete operative description of its own continuation.

LOCAL MOVE:
Opposes the strong claim that “the codebase is the thick prompt.” On Naur’s account, the operative theory may exceed the artefacts left behind.

SOURCE TERMS:
theory building; programmer; program execution; modification; changing demands.

WHAT BECAME STRANGE:
A repository can display enormous regularity yet still fail to preserve the theory that made its design choices intelligible.

QUESTION:
When an agent successfully modifies unfamiliar code from repository context alone, has it reconstructed the missing theory or merely found a locally adequate continuation?

DEEPER QUESTION:
Can model-scale prior training partially substitute for the team-held theory Naur thought essential to program life?

MECHANISM:
Modification depends on an internalized theory of how the domain and program solution fit, not merely reproduction of textual patterns.

FORMAL SHIFT:
CODEBASE = OPERATIVE DESCRIPTION → CODEBASE = EVIDENCE FROM WHICH OPERATIVE THEORY MAY OR MAY NOT BE RECONSTRUCTED.

SOURCE FORMALISM:
Programming as theory building.

OUR FORMALIZATION:
[OUR FORMALIZATION - NOT SOURCE SYNTAX]
REPOSITORY_CONTEXT + MODEL_PRIORS → inferred local theory → modification.
Successful patch does not prove full theory recovery.

TENSION:
Modern foundation models create a reconstructive capacity unavailable in Naur’s historical setting.

MISSING:
Experiments comparing model success on repositories with identical source but differing undocumented design rationale.

BOUNDARY:
Do not attribute to Naur claims about LLMs or prompt context.

CITATION TRAIL:
Naur 1985 → description migration → Claude Code context → implied reader.

TEST:
Create two codebases with surface-similar patterns but different hidden design rationales; ask an agent to extend both without rationale, then provide rationale and compare failures.

PLATFORM:
Software engineering / agentic coding.

LINKS:
ZET-DESCRIPTION-MIGRATION; ZET-IMPLIED-USER; ZET-CLAUDE-DESCRIPTION-MIGRATION-2026.

BIBTEX:
@article{Naur1985TheoryBuilding, author={Peter Naur}, title={Programming as Theory Building}, journal={Microprocessing and Microprogramming}, year={1985}, volume={15}, number={5}, pages={253--261}, doi={10.1016/0165-6074(85)90032-8}}
```

```text
