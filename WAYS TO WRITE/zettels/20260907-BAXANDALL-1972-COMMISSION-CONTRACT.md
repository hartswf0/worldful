```text
ZETTEL

ID: 20260907-BAXANDALL-1972-COMMISSION-CONTRACT

TITLE:
The Quattrocento art contract shifted value from material ostentation to specified individual skill.

SOURCE:
Baxandall, Michael — Painting and Experience in Fifteenth-Century Italy — 1972 — Chapter 1: "Conditions of Trade", pp. 11–17.

PASSAGE:
[QUOTE]
"In the fifteenth-century art contract, the money changed its role. In the earlier part of the century, the client's money was spent primarily on buying expensive materials—gold leaf and genuine ultramarine made from powdered lapis lazuli... By the end of the century, the contracts show a different balance: the client spends less on raw materials and more on the painter's individual skill. The insistence is no longer 'use good gold,' but 'paint the figures with your own hand' (di mano propria)."

RESEARCH OBJECT:
The institutional and economic structure of the commission contract that mediates between patron demand and producer execution.

LOCAL MOVE:
Baxandall conducts a materialist economic reading of surviving Quattrocento notary contracts, demonstrating that the emergence of modern "artistic genius" was driven by commercial clients seeking social distinction through purchasing human labor time rather than hoarded bullion.

SOURCE TERMS:
commission; client; painter; ultramarine; gold leaf; skill; di mano propria; contract; period eye.

WHAT BECAME STRANGE:
In generative AI, we have experienced a violent re-inversion: client expenditure on human skill (prompt engineer labor) is being discarded in favor of raw computational capital (GPU hours, cluster scale, token expenditure)—a return to buying "gold and ultramarine."

QUESTION:
What is the structural contract between a prompt author (patron) and a generative model (contractor)?

DEEPER QUESTION:
Why do prompt engineering demand "di mano propria" guarantees (system prompts demanding specific stylistic signatures) while simultaneously delegating the actual execution to a blind mechanical apprentice?

MECHANISM:
Phase 1 Contract: Value = Quantity(Gold) + Quantity(Ultramarine) + Basic Guild Day-Rate.
Phase 2 Contract: Value = Base Pigment + Penalty(Subcontracting) + Premium(Personal Hand of Master).
Client inspection verifies brushwork density rather than chemical purity of blue pigment.

FORMAL SHIFT:
<PATRON CAPITAL ACCUMULATION>
→ <LEGAL NOTARIZED BRIEF>
→ [DIVISION OF LABOR: MASTER vs BOTTEGA APPRENTICE]
→ <HYBRID MATERIAL-AESTHETIC ARTIFACT>

SOURCE FORMALISM:
NONE

OUR FORMALIZATION:
[OUR FORMALIZATION — NOT SOURCE SYNTAX]
Contract(Client, Producer) = {
  Deliverable: D,
  Invariants: { Pigment \ge Grade_A, Attribution == Master\_Only },
  Penalty_Clause: \text{If Subcontracted to Apprentice then Pay} = 0.5 \cdot Base
}

TENSION:
Howard Becker’s Art Worlds (1982) argues that artistic production is always collective and distributed across support personnel; Baxandall demonstrates that the legal contract artificially consolidates this collective labor into a single accountable name.

MISSING:
The client's cognitive feedback loop: how did fifteenth-century patrons evaluate whether the figures were truly painted "di mano propria" or quietly assigned to studio assistants?

BOUNDARY:
Baxandall’s evidence is drawn from merchant-class contracts in republican Florence and princely Ferrara; it cannot be uncritically generalized to non-commercial religious folk art or modern industrial design.

CITATION TRAIL:
Becker, Howard S. (1982), Art Worlds; Bourdieu, Pierre (1993), The Field of Cultural Production.

TEST:
Analyze 1,000 prompt marketplaces (e.g., PromptBase) to test whether economic price correlates with the complexity of the prompt's logical instructions (skill) or with the cost-per-token of the foundation model running it (material compute).

PLATFORM:
[[game-08-commission]]

LINKS:
[[game-01-instruction]]
[[game-08-commission]]
[[game-12-performance]]

BIBTEX:
@book{baxandall1972painting,
  author    = {Michael Baxandall},
  title     = {Painting and Experience in Fifteenth-Century Italy: A Primer in the Social History of Pictorial Style},
  year      = {1972},
  publisher = {Oxford University Press},
  address   = {Oxford}
}
```
