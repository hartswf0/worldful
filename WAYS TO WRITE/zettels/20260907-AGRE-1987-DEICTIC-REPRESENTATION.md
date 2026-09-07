```text
ZETTEL

ID: 20260907-AGRE-1987-DEICTIC-REPRESENTATION

TITLE:
Activity in dynamic environments relies on indexical-functional entities, not objective world models.

SOURCE:
Agre, Philip E. and Chapman, David — "Pengi: An Implementation of a Theory of Activity" — AAAI-87 Proceedings — 1987 — pp. 268–270.

PASSAGE:
[QUOTE]
"Traditional AI models assume that an agent maintains a complete, objective world model—a map of all objects and their absolute spatial coordinates. We argue that routine activity does not require this. An agent interacts with its environment through indexical-functional entities (which we call deictic representations). Instead of representing 'Bee-34 at coordinate (14, 22)', the agent represents 'the-bee-I-am-running-away-from' or 'the-block-I-am-pushing'. These representations are relational, indexical to the agent's immediate physical posture and current project."

RESEARCH OBJECT:
Deictic representation (indexical-functional entities) as the computational substrate for real-time reactivity without centralized search trees.

LOCAL MOVE:
Agre and Chapman implement Pengi (an arcade video game agent) using combinational logic circuits without memory or search, demonstrating that complex survival behavior emerges from indexical coupling to immediate threat vectors.

SOURCE TERMS:
activity; deictic representation; indexical-functional entity; Pengi; world model; routine activity; combinational logic.

WHAT BECAME STRANGE:
An agent can successfully navigate a hostile dynamic world without ever maintaining an internal representation of where objects go when they leave the immediate visual screen.

QUESTION:
Can an autonomous software agent operate on "the-error-message-blocking-my-current-compile" rather than maintaining an elaborate global knowledge graph of the entire operating system?

DEEPER QUESTION:
Why do modern LLM agent frameworks default to constructing massive vector database world models when indexical-functional focus is cheaper and less prone to hallucination?

MECHANISM:
Sensory Array -> Visual Markers focus on immediate entity -> Logic gates compute indexical relation: "the-projectile-flying-toward-me" -> Fire motor impulse directly without planning tree.

FORMAL SHIFT:
<OBJECTIVE THIRD-PERSON ONTOLOGY>
→ <FIRST-PERSON EMBODIED VISUAL MARKERS>
→ [RELATIONAL INDEXICAL MAPPING]
→ <IMMEDIATE REACTIVE BEHAVIORAL DISPATCH>

SOURCE FORMALISM:
Entity ::= the-[role]-[relationship to current activity]
e.g., the-ice-cube-I-am-kicking

OUR FORMALIZATION:
[OUR FORMALIZATION — NOT SOURCE SYNTAX]
Representation(x) = \langle Functional_Role(x, Current_Goal), Indexical_Vector(x, Agent_Body) \rangle
Action = Circuit(Representation(x_1), ..., Representation(x_n))

TENSION:
Classical planning (STRIPS) requires objective, persistent state to prove completeness and termination; Agre and Chapman prove that completeness is irrelevant when you are about to be stung by a bee.

MISSING:
Long-term strategic planning: Pengi cannot plan a multi-day corporate budget or design a cathedral; its intelligence is strictly local and reactive.

BOUNDARY:
Deictic representations fail when the agent must coordinate across temporal gaps where the referenced object is entirely absent from sensory perception.

CITATION TRAIL:
Suchman, Lucy A. (1987), Plans and Situated Actions; Brooks, Rodney (1991), "Intelligence without Representation".

TEST:
Build an automated web agent using two architectures: (1) an agent that converts the DOM into an exhaustive abstract JSON graph, and (2) an agent that inspects only "the-button-I-need-to-click-next". Compare token cost and task completion across 500 dynamic websites.

PLATFORM:
[[game-04-plan]]

LINKS:
[[game-04-plan]]
[[game-07-gesture]]
[[game-12-performance]]

BIBTEX:
@inproceedings{agre1987pengi,
  author    = {Philip E. Agre and David Chapman},
  title     = {Pengi: An Implementation of a Theory of Activity},
  booktitle = {Proceedings of the Sixth National Conference on Artificial Intelligence (AAAI-87)},
  pages     = {268--272},
  year      = {1987}
}
```
