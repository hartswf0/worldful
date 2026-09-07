```text
ZETTEL

ID: 20260907-MCGANN-1983-SOCIAL-TEXT-EDIT

TITLE:
Textual editing cannot recover autonomous authorial intention because texts are irreducibly social productions.

SOURCE:
McGann, Jerome J. — A Critique of Modern Textual Criticism — 1983 — Chapter 3: "The Social and Institutional Context", pp. 43–48.

PASSAGE:
[QUOTE]
"The concept of 'final authorial intention' is a romantic myth that distorts the actual history of texts... A literary work is not an autonomous mental creation that exists in a pure, ideal state prior to its material manifestation. It is a social product, generated through an interactive process involving authors, editors, publishers, compositors, printers, and readers. Every material version of a text carries its own distinct historical and social authority, and to strip away these historical collaborations in search of an uncorrupted original is to destroy the work's mode of existence."

RESEARCH OBJECT:
The rejection of the Greg-Bowers eclectic text in favor of the material "social text" bearing the marks of multiple historical revisions and institutional hands.

LOCAL MOVE:
McGann attacks the foundational doctrine of modern Anglo-American textual scholarship (Bowers, Tanselle), proving that authors actively relied on the institutional apparatus of printing houses to complete the linguistic and communicative identity of their writing.

SOURCE TERMS:
final authorial intention; social text; eclectic text; Greg-Bowers tradition; copy-text; material transmission; compositor; collaboration.

WHAT BECAME STRANGE:
When editing text, we assume there is an original ground-truth intent that the edit restores, yet every editorial intervention is itself another social layer altering the historical reception and trajectory of the symbol.

QUESTION:
When a human edits an LLM's output (or an LLM edits a human draft), whose intention is being preserved, constructed, or erased?

DEEPER QUESTION:
Can a text produced by an autoregressive neural model possess an "authorial intention" to which an editor could ever be faithful?

MECHANISM:
Greg-Bowers Model: Ideal Author Intent -> Material Historical Text (Corrupted by Printers) -> Editor Removes Corruptions -> Pure Eclectic Text.
McGann Model: Author Draft -> Institutional Socialization (Publishers, Printers, Readers) -> Multiple Legitimate Historical Material Manifestations.

FORMAL SHIFT:
<ROMANTIC IDEAL INTENTION>
→ <MATERIAL HISTORICAL PRINT PRODUCTION>
→ [EDITORIAL INTERFERENCE / ACCUMULATION]
→ <HISTORICALLY CONTINGENT SOCIAL TEXT>

SOURCE FORMALISM:
NONE

OUR FORMALIZATION:
[OUR FORMALIZATION — NOT SOURCE SYNTAX]
Text_{published} = Author(Intent) \otimes Editor(Rules) \otimes Compositor(Physical\_Constraints)
where \otimes \text{ is non-invertible, preventing recovery of pure } Author(Intent).

TENSION:
Fredson Bowers (1949) argues that an editor must strip away non-authorial accidentals (spelling, punctuation) to recover the pure mental design; McGann proves accidentals carry essential communicative codes.

MISSING:
A systematic calculus for contemporary digital texts where versions are continuous git commits rather than distinct physical letterpress printings.

BOUNDARY:
McGann’s theory is designed for literary and historical print cultures; technical documentation and mathematical tables demand deterministic accuracy over historical social transmission.

CITATION TRAIL:
Bowers, Fredson (1949), Principles of Bibliographical Description; Bryant, John (2002), The Fluid Text: A Theory of Revision and Editing for Book and Screen.

TEST:
Take a single prompt output and subject it to three sequential passes by three different editing systems (Grammarly, a senior editor, and an LLM). Track whether stylistic metrics diverge further from the original prompt author with each iteration.

PLATFORM:
[[game-10-edit]]

LINKS:
[[game-03-program]]
[[game-10-edit]]
[[game-11-constraint]]

BIBTEX:
@book{mcgann1983critique,
  author    = {Jerome J. McGann},
  title     = {A Critique of Modern Textual Criticism},
  year      = {1983},
  publisher = {University of Chicago Press},
  address   = {Chicago}
}
```
