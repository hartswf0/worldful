ZETTEL

ID: 20260907-GRICE-1975-LOGIC-CONVERSATION

TITLE:
Conversational implicature operates by calculating meaning on the assumption that speakers honor the Cooperative Principle.

SOURCE:
Grice, H. P. — "Logic and Conversation" — Syntax and Semantics: Vol. 3, Speech Acts — 1975 — pp. 45–48.

PASSAGE:
[QUOTE]
"Make your conversational contribution such as is required, at the stage at which it occurs, by the accepted purpose or direction of the talk exchange in which you are engaged. One may label this the Cooperative Principle. Under this general principle, we may distinguish four categories of maxims: Quantity (make your contribution as informative as is required, and not more), Quality (do not say what you believe to be false or that for which you lack adequate evidence), Relation (be relevant), and Manner (avoid obscurity, avoid ambiguity, be brief, be orderly)... When a speaker blatantly flouts a maxim, the listener does not assume nonsense; they calculate an implicature to preserve the assumption of cooperation."

RESEARCH OBJECT:
Conversational implicature: the cognitive calculus that infers non-explicit meaning from the deliberate violation (flouting) of communicative maxims.

LOCAL MOVE:
Grice decouples formal mathematical logic from natural language semantics, proving that everyday speech communicates vastly more than its truth-conditional assertions through an assumption of rational cooperation.

SOURCE TERMS:
Cooperative Principle; conversational implicature; maxim of quantity; maxim of quality; maxim of relation; maxim of manner; flouting.

WHAT BECAME STRANGE:
When asked "Is Smith a good philosopher?", a professor writes "Smith dresses very neatly and has good handwriting." The sentence asserts zero insults, yet successfully communicates that Smith is completely incompetent.

QUESTION:
Can an AI system calculate conversational implicature without possessing an internal model of the speaker’s social goals and psychological background?

DEEPER QUESTION:
Why do LLMs frequently fail at sarcasm and irony, either taking blatant floutings literally or lecturing the user on moral propriety?

MECHANISM:
1. Speaker S utters proposition $p$.
2. Surface analysis indicates $p$ violates Maxim $M$ (e.g., grossly uninformative).
3. Listener L assumes S is rational and observing the Cooperative Principle.
4. L deduces: S must think proposition $q$, which S could not state directly without violating another maxim.
5. Implicature $q$ successfully communicated without being asserted.

FORMAL SHIFT:
<SURFACE TRUTH-CONDITIONAL PROPOSITION>
→ <MAXIM VIOLATION / FLOUTING DETECTION>
→ [COOPERATIVE REPAIR INFERENCE]
→ <DERIVED CONVERSATIONAL IMPLICATURE>

SOURCE FORMALISM:
$S \text{ implicates } q \iff \text{Speaker says } p \land \text{Requires belief in } q \text{ to sustain CP}$

OUR FORMALIZATION:
[OUR FORMALIZATION — NOT SOURCE SYNTAX]
Meaning = Asserted(p) + Implicated(q) \quad \text{where } q = \arg\max_k P(k \mid \text{Violation}(p, \text{Maxims}), CP)

TENSION:
Conversation Analysis (Sacks, Schegloff) rejects Grice’s mentalist deductions, arguing that meaning is negotiated strictly through visible sequential repair in the talk itself, not through private cognitive calculations.

MISSING:
The cultural dependency of the maxims: what counts as "too much information" or "relevance" varies radically between a Manhattan courtroom and an Amazonian village.

BOUNDARY:
Grice’s framework fails in hostile, adversarial cross-examination where the speaker is explicitly non-cooperative and actively attempting to deceive within literal truth.

CITATION TRAIL:
Austin, J. L. (1962), How to Do Things with Words; Sacks, Harvey et al. (1974), "A Simplest Systematics for the Organization of Turn-Taking".

TEST:
Test an LLM on 100 classic Gricean implicature tests (e.g., recommendation letters praising trivialities). Measure how often the model correctly infers negative evaluation versus providing a naive positive summary.

PLATFORM:
[[game-09-conversation]]

LINKS:
[[game-01-instruction]]
[[game-06-probe]]
[[game-09-conversation]]

BIBTEX:
@incollection{grice1975logic,
  author    = {H. P. Grice},
  title     = {Logic and Conversation},
  booktitle = {Syntax and Semantics: Volume 3: Speech Acts},
  editor    = {Peter Cole and Jerry L. Morgan},
  pages     = {41--58},
  year      = {1975},
  publisher = {Academic Press},
  address   = {New York}
}
