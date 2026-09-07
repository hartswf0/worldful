ZETTEL

ID: 20260907-PEREC-1969-LIPOGRAM-DISPARITION

TITLE:
Severe lexical constraint operates as an engine of narrative invention by making the missing vowel the hidden protagonist.

SOURCE:
Perec, Georges — La Disparition (A Void) — 1969 — "Postface", pp. 305–312.

PASSAGE:
[QUOTE]
"The suppression of the letter 'e'—the most frequent letter in the French language—was not a gratuitous game or an idle puzzle. It was the central motor of the entire book. By forbidding myself the use of 'e', I was simultaneously forbidden from using words like 'le', 'de', 'ne', 'je', 'elle', 'manger', 'vivre'. Every sentence became a desperate obstacle course. But this restriction was not a prison; it forced me to rediscover the French language, to excavate forgotten synonyms, to invent bizarre periphrases, and ultimately, to make the disappearance of the letter itself the secret metaphysical plot of the novel."

RESEARCH OBJECT:
The lipogram as a radical structural constraint where lexical excision directly dictates narrative ontology.

LOCAL MOVE:
Perec proves that formal arbitrary negative constraint (erasing a single vowel) generates an entire 300-page mystery novel whose characters vanish precisely because they are searching for the lost letter that cannot be named.

SOURCE TERMS:
lipogram; La Disparition; constraint; obstruction; periphrasis; missing letter; Oulipo; formal motor; creative liberation.

WHAT BECAME STRANGE:
The author did not sit down with a story idea and then apply a constraint; the constraint itself generated the characters, their motivations, their assassinations, and their existential dread.

QUESTION:
When an LLM is prompted with a strict negative constraint ("Do not mention price or warranty"), does the model’s reasoning simulate Perec's structural adaptation or merely mask tokens during generation?

DEEPER QUESTION:
Why do AI models struggle far more with negative constraints ("Do not include X") than with positive constraints ("Include Y")?

MECHANISM:
1. Excision Rule: Alphabet $A' = A \setminus \{e\}$.
2. Syntactic Filter: Sentence $S$ valid if and only if $\forall c \in S, c \in A'$.
3. Consequence: Default idioms blocked -> Combinatorial search forces activation of obsolete, rare, and bizarre semantic tokens -> Plot adapts to explain the bizarre vocabulary.

FORMAL SHIFT:
<UNCONSTRAINED VOCABULARY CLICHÉ>
→ <NEGATIVE ALPHABETICAL EXCISION>
→ [SEARCH-IN-ADVERSITY EXPEDITION]
→ <STRUCTURALLY INVENTED NARRATIVE REALITY>

SOURCE FORMALISM:
NONE

OUR FORMALIZATION:
[OUR FORMALIZATION — NOT SOURCE SYNTAX]
Text = \arg\max_T \text{Coherence}(T) \quad \text{subject to } \text{Freq}(char = 'e', T) = 0

TENSION:
Noam Chomsky’s universal grammar assumes human language strives for maximum expressive ease and cognitive efficiency; Perec proves that maximum aesthetic invention requires maximum artificial friction.

MISSING:
The biological cost: Perec reported physical exhaustion, night terrors, and linguistic aphasia after completing the manuscript.

BOUNDARY:
Lipograms cannot be sustained in technical communication (e.g., aviation safety manuals) where clear, standardized vocabulary is essential to prevent loss of life.

CITATION TRAIL:
Queneau, Raymond (1981), Oulipo: A Primer of Potential Literature; Elster, Jon (1979), Ulysses and the Sirens.

TEST:
Test an LLM on generating a 500-word explanation of quantum mechanics without the letter 'e'. Measure how often the model fails the constraint versus the linguistic creativity of the explanations when it succeeds.

PLATFORM:
[[game-11-constraint]]

LINKS:
[[game-02-score]]
[[game-03-program]]
[[game-11-constraint]]

BIBTEX:
@book{perec1969disparition,
  author    = {Georges Perec},
  title     = {La Disparition},
  year      = {1969},
  publisher = {Deno{"e}l},
  address   = {Paris}
}
