ZETTEL

ID:
ZET-GREEN-BLACKWELL-PREMATURE-COMMITMENT-1998

TITLE:
Requirements Can Force Decisions Before the Information Needed to Make Them Exists

SOURCE:
Thomas R. G. Green and Alan F. Blackwell - Cognitive Dimensions of Information Artefacts: A Tutorial - 1998. ([Cambridge Computer Lab](https://www.cl.cam.ac.uk/~afb21/CognitiveDimensions/CDtutorial.pdf))

PASSAGE:
Premature commitment occurs when an ordering constraint forces a decision before the information needed for that decision is available.

RESEARCH OBJECT:
The software requirements problem as a notation-induced temporal error.

LOCAL MOVE:
Replaces the loose Jobs maxim “users do not know what they want until they see it” with an established representational mechanism: the design process may demand distinctions too early.

SOURCE TERMS:
premature commitment; enforced lookahead; natural sequence; medium; information availability; technical design.

WHAT BECAME STRANGE:
“Incomplete requirements” can be a property of the representation schedule rather than a deficiency in the user.

QUESTION:
Which software requirements become knowable only after an artifact or consequence exists?

DEEPER QUESTION:
Can generative interaction reduce premature commitment by making specification and execution interleave?

MECHANISM:
A notation or process requires an irreversible or costly choice before later evidence capable of discriminating that choice is available.

FORMAL SHIFT:
REQUIREMENTS FIRST → PROVISIONAL DESCRIPTION ↔ ARTIFACT ↔ REVISED DESCRIPTION.

SOURCE FORMALISM:
Green and Blackwell treat premature commitment as a Cognitive Dimension affected by notation, environment, and medium.

OUR FORMALIZATION:
[OUR FORMALIZATION - NOT SOURCE SYNTAX]
If distinction d becomes observable only after prototype state W₁, requiring d in specification for W₀ imposes premature descriptive commitment.

TENSION:
Iterative generative systems can also create new forms of premature commitment by silently inferring an underspecified choice and propagating it.

MISSING:
Comparative evidence on when model inference reduces versus conceals premature commitment.

BOUNDARY:
Not every requirement uncertainty is a notation problem.

CITATION TRAIL:
Cognitive Dimensions → HCD requirements → thick prompting → critique loop.

TEST:
For a Yellow Circle variant with intentionally unresolved size, compare upfront complete specification against interactive “circle there → bigger → there” refinement; count commitments made before evidence.

PLATFORM:
HCI / requirements engineering.

LINKS:
ZET-HCD-AS-TRANSLATION; ZET-THICK-PROMPTING; ZET-CRITICISM-AS-PROGRAMMING; ZET-WORLD-TO-WORLD.

BIBTEX:
@techreport{GreenBlackwell1998CognitiveDimensions, author={Thomas R. G. Green and Alan F. Blackwell}, title={Cognitive Dimensions of Information Artefacts: A Tutorial}, year={1998}}
```

```text
