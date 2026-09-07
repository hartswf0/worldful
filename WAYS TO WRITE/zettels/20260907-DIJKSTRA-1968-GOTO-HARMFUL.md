```text
ZETTEL

ID: 20260907-DIJKSTRA-1968-GOTO-HARMFUL

TITLE:
Bridging the gap between static textual program and dynamic execution process requires structured hierarchical control.

SOURCE:
Dijkstra, Edsger W. — "Go To Statement Considered Harmful" — Communications of the ACM — 1968 — Vol. 11, No. 3, pp. 147–148.

PASSAGE:
[QUOTE]
"Our intellectual powers are rather geared to master the static relation than to track the dynamic process... We should do our utmost to shorten the conceptual gap between the static program in text and the dynamic process in time, to make the correspondence between the program (spread out in text space) and the process (spread out in time) as trivial as possible. The unbridled use of the go to statement has an immediate consequence: it becomes terribly hard to find a meaningful set of coordinates in which to describe the process progress."

RESEARCH OBJECT:
The epistemological gap between the spatial arrangement of program text and the temporal progression of its dynamic execution trace.

LOCAL MOVE:
Dijkstra launches structured programming by identifying the GOTO statement as an architectural disaster that destroys the programmer's ability to assert invariants across temporal execution states.

SOURCE TERMS:
go to statement; static program; dynamic process; textual space; temporal process; progress coordinates; structured programming.

WHAT BECAME STRANGE:
In conversational multi-agent LLM systems, the execution flow is entirely GOTO: tokens jump across context windows, subagents call tools, interruptions occur, and the conceptual gap between prompt text and dynamic inference trace is infinite.

QUESTION:
What are the "progress coordinates" of an autonomous LLM agent execution trace?

DEEPER QUESTION:
Can an agent prompt be formally structured if its internal execution jumps are determined by non-deterministic sampling across billions of probabilities?

MECHANISM:
Structured Control: Linear sequence, Conditionals (if-then-else), Repetitions (while-do).
Invariant Property: Textual coordinate index strictly matches temporal execution stack.
GOTO Defect: Textual position $L_1$ jumps to $L_2$ across non-nested scopes, obliterating the historical call stack.

FORMAL SHIFT:
<CHAOTIC GOTO SPAGHETTI CONTROL GRAPH>
→ <HIERARCHICAL NESTED BLOCK STRUCTURE>
→ [STATIC-DYNAMIC ISOMORPHISM]
→ <FORMALLY PROVABLE LOOP INVARIANTS>

SOURCE FORMALISM:
Process Progress Coordinate := \langle Stack\_Depth, Call\_Path, Loop\_Counter angle

OUR FORMALIZATION:
[OUR FORMALIZATION — NOT SOURCE SYNTAX]
Gap(Program, Process) = \oint |Coordinate_{text}(t) - Coordinate_{time}(t)| \, dt 	o 0

TENSION:
Event-driven reactive programming (Node.js, actors) deliberately decouples static text from temporal callbacks, reviving Dijkstra's nightmare under the banner of asynchronous performance.

MISSING:
A proof that human thinking naturally operates in nested tree blocks rather than associative, jumpy associative graphs.

BOUNDARY:
Dijkstra’s prohibition applies to high-level programming; microcode, assembly language, and hardware silicon routing require jumps.

CITATION TRAIL:
Landin, P. J. (1966), "The Next 700 Programming Languages"; Knuth, Donald E. (1974), "Structured Programming with go to Statements".

TEST:
Compare debugging time on a recursive multi-agent workflow implemented as a structured deterministic state machine versus the same workflow implemented via dynamic tool-routing prompts.

PLATFORM:
[[game-03-program]]

LINKS:
[[game-01-instruction]]
[[game-03-program]]
[[game-04-plan]]

BIBTEX:
@article{dijkstra1968goto,
  author    = {Edsger W. Dijkstra},
  title     = {Go To Statement Considered Harmful},
  journal   = {Communications of the ACM},
  volume    = {11},
  number    = {3},
  pages     = {147--148},
  year      = {1968}
}
```
