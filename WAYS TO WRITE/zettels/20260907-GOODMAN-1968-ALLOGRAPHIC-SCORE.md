```text
ZETTEL

ID: 20260907-GOODMAN-1968-ALLOGRAPHIC-SCORE

TITLE:
A score functions allographically by defining an equivalence class that prevents identity drift through performance compliance.

SOURCE:
Goodman, Nelson — Languages of Art: An Approach to a Theory of Symbols — 1968 — Chapter IV: "The Score", pp. 128, 177–179.

PASSAGE:
[QUOTE]
"A score is a character in an allographic art... The principal function of a score is the authoritative identification of a work from performance to performance. What is required is that all and only performances that comply with the score belong to the work... A score cannot determine all properties of a performance, for performances compliant with the same score differ in tempo, phrasing, timbre, and subtle nuances. But any deviation from the score, no matter how slight, disqualifies a performance from being an instance of the work."

RESEARCH OBJECT:
The mathematical and semiotic role of notation in establishing an immutable equivalence class across stochastic physical executions.

LOCAL MOVE:
Goodman separates works of art into autographic (where authenticity requires historical tracing to the physical object of the creator) and allographic (where authenticity requires strictly symbolic compliance with a notational system).

SOURCE TERMS:
score; compliance; allographic; autographic; characters; compliance-class; disjointness; finite differentiability; performance.

WHAT BECAME STRANGE:
The score deliberately leaves huge swaths of material reality undefined (timbre, micro-dynamics, performer breath), yet its digital discrete requirements are absolute: playing one wrong pitch mathematically ejects the performance from the work, while radical interpretive variance within the notation preserves identity.

QUESTION:
When a prompt acts as a score for a stochastic generative model, what constitutes the score's compliance class?

DEEPER QUESTION:
Does generative AI possess a true notational system in Goodman’s sense, or does the lack of finite syntactic differentiability in latent embeddings collapse the allographic back into the autographic?

MECHANISM:
A score S is expressed in a notational system satisfying:
1. Syntactic disjointness (no token belongs to two character classes).
2. Syntactic finite differentiability (it is always possible to tell which character a token is).
3. Semantic disjointness (no two characters share compliant physical performances).
4. Semantic finite differentiability (it is always possible to determine compliance).

FORMAL SHIFT:
<COMPOSITION / PROMPT SCORE>
→ <DISCRETE NOTATIONAL CHARACTERS>
→ [STOCHASTIC PERFORMANCE / DENOISING]
→ <EQUIVALENCE CLASS OF COMPLIANT REALIZATIONS>

SOURCE FORMALISM:
Work W = { P | P complies with Character C in Notational System N }

OUR FORMALIZATION:
[OUR FORMALIZATION — NOT SOURCE SYNTAX]
Compliance(P, S) = {
  True  if for all invariant constraints i in S, Value(P, i) == Target(i),
  False if exists i in S such that Delta(P, i) > 0
}

TENSION:
Eno's generative music scores deliberately introduce analog drift and tape decay, defying Goodman's strict requirement that any deviation, no matter how minute, invalidates identity.

MISSING:
A threshold function for semantic compliance when dealing with natural language instructions rather than western tonal musical notes.

BOUNDARY:
Goodman’s theory strictly requires five formal requirements for a true notational system; natural language and latent diffusion embeddings violate all five.

CITATION TRAIL:
Cardew, Cornelius (1971), Treatise Handbook; Eno, Brian (1996), A Year with Swollen Appendices.

TEST:
Sample 1,000 diffusion runs with the same structural prompt and seed variation. Measure whether human evaluators identify a deterministic boundary where the image ceases to comply with the text, or whether the boundary is a continuous gradient.

PLATFORM:
[[game-02-score]]

LINKS:
[[game-02-score]]
[[game-03-program]]
[[game-11-constraint]]

BIBTEX:
@book{goodman1968languages,
  author    = {Nelson Goodman},
  title     = {Languages of Art: An Approach to a Theory of Symbols},
  year      = {1968},
  publisher = {Bobbs-Merrill Company},
  address   = {Indianapolis}
}
```
