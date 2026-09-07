ZETTEL

ID: 20260907-SEARLE-1975-ILLOCUTIONARY-TAXONOMY

TITLE:
Illocutionary acts classify exhaustively along direction of fit and expressed psychological state.

SOURCE:
Searle, John R. — "A Taxonomy of Illocutionary Acts" — Language in Society — 1975 — Vol. 5, No. 1, pp. 1–4, 12–16.

PASSAGE:
[QUOTE]
"Some illocutions have as part of their illocutionary point to get the words (more strictly, their propositional content) to match the world, others to get the world to match the words. Assertions are in the first category, promises and requests are in the second... There are five and only five basic things we can do with language: we tell people how things are (assertives), we try to get them to do things (directives), we commit ourselves to doing things (commissives), we express our feelings and attitudes (expressives), and we bring about changes in the world through our utterances (declarations)."

RESEARCH OBJECT:
The five-fold dimensional limit of illocutionary force based on vector direction between symbolic representation and reality.

LOCAL MOVE:
Searle disciplines Austin’s sprawling list of performative verbs into a formal taxonomic algebra based on four independent variables: illocutionary point, direction of fit, psychological state, and propositional content conditions.

SOURCE TERMS:
illocutionary point; direction of fit; words-to-world; world-to-words; assertive; directive; commissive; expressive; declaration; sincerity condition.

WHAT BECAME STRANGE:
Natural language appears infinitely variable and nuanced, yet every prompt ever typed into an LLM is forced by speech-act ontology into one of exactly five thermodynamic vectors relating symbol to environment.

QUESTION:
When a prompt requests an LLM to "roleplay as a Victorian detective," is the utterance a directive (world-to-words) or the creation of an imaginary declarative reality?

DEEPER QUESTION:
Can an artificial agent produce a genuine commissive (a promise) if it has no material body capable of suffering penalty or guilt upon default?

MECHANISM:
Illocutionary Vector Table:
1. Assertive: Point(Inform), Fit(Word-to-World $\downarrow$), State(Believe $B(p)$), Content(Prop $p$).
2. Directive: Point(Command), Fit(World-to-Word $\uparrow$), State(Want $W(H \text{ does } A)$), Content(Act $A$).
3. Commissive: Point(Obligate), Fit(World-to-Word $\uparrow$), State(Intend $I(S \text{ does } A)$), Content(Act $A$).
4. Expressive: Point(Attitude), Fit(Null $\emptyset$), State(Feel $E(p)$), Content(Property $P(S/H)$).
5. Declaration: Point(Change World), Fit(Both $\updownarrow$), State(Null $\emptyset$), Content(Prop $p$).

FORMAL SHIFT:
<INFINITE PRAGMATIC IDIOMS>
→ <FIVE FINITE ILLOCUTIONARY VECTORS>
→ [DIRECTION-OF-FIT CONSTRAINT EVALUATION]
→ <DISCRETE PRAGMATIC COMMITMENT STATE>

SOURCE FORMALISM:
$F(P) \quad \text{where } F \in \{\vdash \downarrow, ! \uparrow, C \uparrow, E \emptyset, D \updownarrow\}$

OUR FORMALIZATION:
[OUR FORMALIZATION — NOT SOURCE SYNTAX]
Speech_Act = \langle Point \in \{Assert, Direct, Commit, Express, Declare\}, Fit \in \{\downarrow, \uparrow, \emptyset, \updownarrow\}, \Psi(State) \rangle

TENSION:
Jacques Derrida (1977) in Limited Inc argues that Searle's rigid taxonomy ignores the fundamental "iterability" and graftability of the sign, which can always break from its intended illocutionary context.

MISSING:
A category for ludic or exploratory language games (e.g., scoring, probing) that deliberately oscillate between directive and assertive without settling into either.

BOUNDARY:
Searle's taxonomy assumes literal institutional speaking subjects with coherent internal intentional states, an assumption violated by statistical next-token predictors.

CITATION TRAIL:
Austin, J. L. (1962), How to Do Things with Words; Anscombe, G. E. M. (1957), Intention.

TEST:
Classify 10,000 user prompts from the LMSYS Chatbot Arena into Searle’s five categories. Measure whether model performance failures correlate disproportionately with prompts possessing dual ($\updownarrow$) or null ($\emptyset$) direction of fit.

PLATFORM:
[[game-01-instruction]]

LINKS:
[[game-01-instruction]]
[[game-04-plan]]
[[game-05-query]]

BIBTEX:
@article{searle1975taxonomy,
  author    = {John R. Searle},
  title     = {A Taxonomy of Illocutionary Acts},
  journal   = {Language in Society},
  volume    = {5},
  number    = {1},
  pages     = {1--23},
  year      = {1975}
}
