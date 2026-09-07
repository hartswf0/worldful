ZETTEL

ID: 20260907-BECKER-1982-ART-WORLDS-CONVENTIONS

TITLE:
Artistic production is coordinated through shared conventions across distributed networks of support personnel.

SOURCE:
Becker, Howard S. — Art Worlds — 1982 — Chapter 1: "Art Worlds and Collective Activity", pp. 1–3; Chapter 2: "Conventions", pp. 40–44.

PASSAGE:
[QUOTE]
"All artistic work, like all human activity, involves the joint activity of a number, often a large number, of people... The work of art is not the result of an isolated individual genius, but the product of an entire 'art world'—a network of cooperating people whose activities are coordinated through the shared use of conventions. Conventions make collective activity possible by establishing standard sizes for canvases, standard tunings for instruments, standard divisions of labor, and standard expectations of audience decorum. Without these conventions, the artist would have to reinvent the materials, notation, and distribution system for every single work."

RESEARCH OBJECT:
The material, institutional, and conventional infrastructure that coordinates distributed human labor into an aesthetic product.

LOCAL MOVE:
Becker applies symbolic interactionist sociology to high art, demystifying the romantic myth of the lone artist by cataloging the vital roles played by paint manufacturers, canvas stretchers, stagehands, instrument tuners, and ticket collectors.

SOURCE TERMS:
art world; collective activity; convention; division of labor; support personnel; distribution system; aesthetic compromise.

WHAT BECAME STRANGE:
An individual sitting alone in a room typing a prompt into a text field believes they are an isolated creator, unaware that their "creative act" relies on the conventional coordination of millions of web annotators, datacenter technicians, CUDA library authors, and electrical grid workers.

QUESTION:
What are the unstated conventions of the "Prompt Art World" that allow an LLM and a user to coordinate without explicit negotiation?

DEEPER QUESTION:
Why do software interfaces systematically erase the visibility of the support personnel whose labor trained and maintained the model weights?

MECHANISM:
1. Convention establishes standard format F (e.g., Markdown, 16:9 aspect ratio, 44.1kHz audio).
2. Creator A produces work within bounds of F.
3. Support network B manufactures tools complying with F.
4. Audience C interprets work according to expectations of F.
Outcome: Frictionless distribution and reception with zero bespoke negotiation.

FORMAL SHIFT:
<ISOLATED HEROIC AUTHORSHIP>
→ <DISTRIBUTED COLLABORATIVE NETWORK>
→ [STANDARDIZED CONVENTIONAL COORDINATION]
→ <INSTITUTIONALLY STABILIZED ART WORLD ARTIFACT>

SOURCE FORMALISM:
NONE

OUR FORMALIZATION:
[OUR FORMALIZATION — NOT SOURCE SYNTAX]
Artifact = \text{Aggregate}(Author, \{Support\_Personnel_k\}) \circ \text{Conventions}_{shared}

TENSION:
Pierre Bourdieu (1993) critiques Becker for focusing purely on horizontal cooperative interactions while ignoring the brutal vertical struggles for symbolic dominance, monopoly, and cultural gatekeeping.

MISSING:
A formal account of radical avant-garde disruption: what happens when an artist breaks 90% of an art world's conventions simultaneously?

BOUNDARY:
Becker's model describes stable institutional art worlds; it struggles to account for sudden technological ruptures where the entire infrastructure collapses within 24 months.

CITATION TRAIL:
Baxandall, Michael (1972), Painting and Experience in Fifteenth-Century Italy; Bourdieu, Pierre (1993), The Field of Cultural Production.

TEST:
Audit the commit history of open-source diffusion models to quantify the exact ratio of machine learning algorithmic commits versus data-cleaning, formatting, and packaging commits performed by support personnel.

PLATFORM:
[[game-08-commission]]

LINKS:
[[game-02-score]]
[[game-08-commission]]
[[game-10-edit]]

BIBTEX:
@book{becker1982art,
  author    = {Howard S. Becker},
  title     = {Art Worlds},
  year      = {1982},
  publisher = {University of California Press},
  address   = {Berkeley}
}
