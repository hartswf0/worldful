```text
ZETTEL

ID: 20260907-GOFFMAN-1959-DRAMATURGY-FRONT-STAGE

TITLE:
Social interaction is an ongoing theatrical staging divided into front stage impression management and backstage preparation.

SOURCE:
Goffman, Erving — The Presentation of Self in Everyday Life — 1959 — Chapter 1: "Performances", pp. 22–30; Chapter 3: "Regions and Region Behavior", pp. 106–114.

PASSAGE:
[QUOTE]
"When an individual appears before others, their actions will have a promissory character. They will mobilize their activity so as to convey an impression to others which it is in their interests to convey... We may distinguish two distinct regions: the 'front region' or front stage, where the performance is given and where standards of decorum and politeness are maintained; and the 'back region' or backstage, where the suppressed facts make an appearance, where the performer can relax, drop the front, step out of character, and prepare the expressive equipment required for the next scene."

RESEARCH OBJECT:
The dramaturgical division of social space into monitored public performance (front stage) and concealed preparatory labor (backstage).

LOCAL MOVE:
Goffman applies theatrical staging metaphors to ordinary human sociology, proving that personal identity is not an authentic internal soul, but an elaborate, precarious staging sustained through continuous impression management.

SOURCE TERMS:
performance; front stage; backstage; impression management; expressive equipment; setting; personal front; decorum; team collusion.

WHAT BECAME STRANGE:
In generative AI interfaces, the user sees only the pristine, polite "front stage" chat bubble, while the "backstage" (the hidden system prompts, chain-of-thought scratchpads, content moderation filters, and raw data workers) is violently walled off from view.

QUESTION:
When an AI system hides its internal reasoning tokens inside `<thinking>` tags, is it maintaining a Goffmanian backstage to preserve its front stage authority?

DEEPER QUESTION:
What happens to user trust when the backstage of an AI system accidentally leaks into the front stage dialogue?

MECHANISM:
1. Actor enters Front Region: Activates Setting, Appearance, and Manner to signal specific Social Role $R$.
2. Audience monitors cues -> verifies consistency of performance.
3. Actor suppresses incompatible desires, fatigue, or contradictory facts.
4. Actor retreats to Back Region: Drops character, curses, debugs errors, collaborates with support team.

FORMAL SHIFT:
<COMPLEX UNPOLISHED HUMAN BEHAVIOR>
→ <FRONT STAGE / BACKSTAGE PARTITIONING>
→ [IMPRESSION MANAGEMENT DISCIPLINE]
→ <SOCIAL ORDER SUSTAINED THROUGH THEATRICAL ILLUSION>

SOURCE FORMALISM:
NONE

OUR FORMALIZATION:
[OUR FORMALIZATION — NOT SOURCE SYNTAX]
Output_{user} = \text{Filter}(State_{internal}, Decorum_{rules}) \quad \text{where } Backstage_{data} \cap Output_{user} = \emptyset

TENSION:
Ethnomethodology (Garfinkel) argues that social order is maintained through mutual practical sense-making; Goffman argues that social order is maintained through cynical theatrical manipulation and mutual conspiracy.

MISSING:
A formal boundary for algorithmic agents that have no private emotional life: what does an LLM "feel" when it drops character in the backstage?

BOUNDARY:
Goffman’s dramaturgy assumes human actors who know they are playing a role; it struggles to describe systems that are unaware that they are performing.

CITATION TRAIL:
Austin, J. L. (1962), How to Do Things with Words; Schechner, Richard (1988), Performance Theory.

TEST:
Present two groups of users with identical AI-generated medical diagnoses: Group A sees only the final professional text; Group B sees the raw model reasoning trace including its initial confusion and errors. Measure the difference in user confidence and perceived competence.

PLATFORM:
[[game-12-performance]]

LINKS:
[[game-01-instruction]]
[[game-08-commission]]
[[game-12-performance]]

BIBTEX:
@book{goffman1959presentation,
  author    = {Erving Goffman},
  title     = {The Presentation of Self in Everyday Life},
  year      = {1959},
  publisher = {Anchor Books},
  address   = {New York}
}
```
