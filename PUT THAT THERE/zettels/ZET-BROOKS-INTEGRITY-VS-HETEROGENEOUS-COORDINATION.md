ZETTEL

ID:
ZET-BROOKS-INTEGRITY-VS-HETEROGENEOUS-COORDINATION

TITLE:
Software Coordination May Need Conceptual Integrity Locally Without Requiring Semantic Uniformity Globally

SOURCE:
Frederick P. Brooks Jr. - The Mythical Man-Month - 1975. ([CMU School of Computer Science](https://www.cs.cmu.edu/afs/cs/academic/class/15712-s19/www/papers/mythicalmanmonth00fred.pdf))

PASSAGE:
[QUOTE]
"I believe that conceptual integrity is the most important consideration in system design. It is better to have a system omit certain anomalous features and improvements, but to reflect one set of design ideas, than to have one which contains many good but uncoordinated and independent ideas... The design must proceed from one mind, or from a very small number of agreeing resonant minds." — Frederick P. Brooks Jr., The Mythical Man-Month, Addison-Wesley, pp. 42–44 (1975)

RESEARCH OBJECT:
The level at which shared conceptual language is actually required in software.

LOCAL MOVE:
Pressures the earlier claim that software succeeds by making many minds “mutually compilable.” Brooks requires integrity in system design, but that does not yet establish that every participant must share one representation.

SOURCE TERMS:
conceptual integrity; system design; coordinated ideas; architecture; simplicity.

WHAT BECAME STRANGE:
A system may need a coherent public architecture while the people and disciplines coordinating through it retain different local models.

QUESTION:
Where must conceptual unity reside: in every participant, in the interface, in architecture, or only at translation boundaries?

DEEPER QUESTION:
Can the Yellow Circle serve as a stable common object precisely because local representations remain heterogeneous?

MECHANISM:
A common architectural surface constrains externally visible behavior while allowing implementation and disciplinary descriptions to differ.

FORMAL SHIFT:
COORDINATION = SHARED MEANING → COORDINATION MAY REQUIRE ONLY SHARED INTERFACE INVARIANTS.

SOURCE FORMALISM:
Brooks’s conceptual integrity concerns coherence of system design.

OUR FORMALIZATION:
[OUR FORMALIZATION - NOT SOURCE SYNTAX]
Global artifact invariant can coexist with locally heterogeneous operational descriptions if translation boundaries preserve required distinctions.

TENSION:
Too much conceptual plurality can destroy usability and predictability; too much imposed unity can erase useful local distinctions.

MISSING:
Primary boundary-object collision and empirical evidence about coordination with non-consensual local representations.

BOUNDARY:
Brooks does not argue that every engineer must possess identical concepts.

CITATION TRAIL:
Brooks 1975 → software coordination → boundary-object hypothesis → Yellow Circle.

TEST:
Give three teams separate SVG, Logo, and GUI representations but one output acceptance test; compare coordination under shared vocabulary versus only shared artifact invariants.

PLATFORM:
Software architecture / CSCW.

LINKS:
ZET-SOFTWARE-COORDINATION; ZET-YELLOW-CIRCLE; ZET-LAW-REQUISITE-DESCRIPTION; ZET-TASK-OF-TRANSLATOR.

BIBTEX:
@book{Brooks1975Mythical, author={Frederick P. Brooks Jr.}, title={The Mythical Man-Month}, year={1975}, publisher={Addison-Wesley}}
```

```text
