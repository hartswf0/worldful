ZETTEL

ID: 20260907-KAY-1993-OBJECT-MESSAGING-BIOLOGY

TITLE:
Object-oriented programming was conceived as recursive biological cells communicating via messages, not data structures with functions.

SOURCE:
Kay, Alan C. — "The Early History of Smalltalk" — ACM SIGPLAN Notices — 1993 — Vol. 28, No. 3, pp. 69–72.

PASSAGE:
[QUOTE]
"I'm sorry that I long ago coined the term 'objects' for this topic because it gets many people to focus on the lesser idea. The big idea is messaging... In computer science, we had been treating programs as data structures manipulated by procedures. My background in molecular biology suggested a completely different model: what if a computer program were made of microscopic autonomous computers—like biological cells—that communicate solely by sending and receiving messages across membranes? Inside the cell, the local state is hidden; outside, only the communicative interface exists."

RESEARCH OBJECT:
The biological metaphor of autonomous cellular messaging as the root of modular software encapsulation.

LOCAL MOVE:
Kay rejects the Algol/von Neumann procedural architecture, replacing centralized memory control with a decentralized swarm of self-contained virtual machines exchanging asynchronous signals.

SOURCE TERMS:
Smalltalk; messaging; biological cell; encapsulation; objects; late binding; virtual machine; interface; local state.

WHAT BECAME STRANGE:
Modern industrial programming languages (C++, Java) adopted "objects" as rigid static memory layouts, completely abandoning Kay's dynamic, biological vision of runtime message negotiation.

QUESTION:
Is a multi-agent system composed of interacting LLMs the literal realization of Alan Kay’s cellular Smalltalk vision?

DEEPER QUESTION:
What happens to encapsulation when the "message" exchanged between software cells is ambiguous natural language rather than a typed method selector?

MECHANISM:
1. System decomposed into autonomous entities (Objects $O_i$).
2. Object $O_i$ encapsulates internal private state $S_i$ behind impermeable membrane.
3. Computation occurs exclusively via Message Passing: $O_A \xrightarrow{M} O_B$.
4. Object $O_B$ dynamically dispatches $M$ according to its own internal logic (Late Binding).
5. No object can directly mutate another object's internal memory.

FORMAL SHIFT:
<CENTRALIZED VON NEUMANN MEMORY / PROCEDURES>
→ <DECENTRALIZED BIOLOGICAL CELL SWARM>
→ [DYNAMIC MESSAGE DISPATCH ACROSS MEMBRANES]
→ <AUTONOMOUS RECURSIVE COMPUTATION>

SOURCE FORMALISM:
Object ::= State + Behavior
Compute ::= Message(Receiver, Selector, Arguments)

OUR FORMALIZATION:
[OUR FORMALIZATION — NOT SOURCE SYNTAX]
State_{system}(t) = \prod_{i=1}^N S_i(t) \quad \text{where } \frac{\partial S_i}{\partial t} = f_i(S_i, \{M_{inbound}\})

TENSION:
Dijkstra’s structured programming demands statically provable state transitions across transparent code blocks; Kay’s late-bound messaging ensures that you cannot prove what an object will do until the runtime message hits it.

MISSING:
A formal proof of deadlock avoidance when thousands of autonomous cellular agents flood the network with recursive unhandled requests.

BOUNDARY:
Kay’s model requires runtime overhead for dynamic lookup; micro-controllers running on 4KB of RAM cannot afford late-bound message dispatch.

CITATION TRAIL:
Landin, P. J. (1966), "The Next 700 Programming Languages"; Hewitt, Carl (1973), "A Universal Modular ACTOR Formalism".

TEST:
Build an agent architecture where modules communicate strictly via JSON-RPC messages with hidden internal context prompts versus an architecture with a single shared global memory context. Test which breaks down faster when scaling to 50 concurrent sub-tasks.

PLATFORM:
[[game-03-program]]

LINKS:
[[game-01-instruction]]
[[game-03-program]]
[[game-09-conversation]]

BIBTEX:
@article{kay1993early,
  author    = {Alan C. Kay},
  title     = {The Early History of Smalltalk},
  journal   = {ACM SIGPLAN Notices},
  volume    = {28},
  number    = {3},
  pages     = {69--95},
  year      = {1993}
}
