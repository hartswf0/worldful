```text
ZETTEL

ID: 20260907-SUCHMAN-1987-SITUATED-ACTIONS

TITLE:
Plans are derivative representations and retrospective accounts of situated action, not generative control structures.

SOURCE:
Suchman, Lucy A. — Plans and Situated Actions: The Problem of Human-Machine Communication — 1987 — Chapter 3: "Plans", pp. 49–52.

PASSAGE:
[QUOTE]
"Plans are representations of situated actions... Rather than determining action, plans are best viewed as resources for action. They are retrospective reconstructions of past action, or prospective projections of anticipated action, but in the course of action itself, the contingency of the physical and social world constantly outruns the plan's capacity to specify what should happen next."

RESEARCH OBJECT:
The radical inversion of the planning paradigm from internal computational blueprint to external communicative resource.

LOCAL MOVE:
Suchman critiques the classic Artificial Intelligence planning paradigm (STRIPS, Newell & Simon) by observing human users trying to operate an interactive photocopier, demonstrating that plan-following is fundamentally an improvisational navigation of immediate material affordances.

SOURCE TERMS:
situated action; plan; resource for action; retrospective reconstruction; contingency; indexicality; photocopier breakdown.

WHAT BECAME STRANGE:
AI agents are routinely designed on the assumption that writing down a multi-step plan guarantees execution fidelity, whereas in lived practice, every intermediate step encounters environmental perturbations that make the original plan obsolete.

QUESTION:
When an LLM generates a "Chain-of-Thought" plan, is that plan acting as an executable algorithmic control loop, or as a situated discursive resource that the next autoregressive token simply improvises against?

DEEPER QUESTION:
Why do contemporary multi-agent frameworks continue to treat plans as control programs rather than as indexical communicative gestures?

MECHANISM:
Classic AI: Plan P -> Execute(P_1) -> Execute(P_2) -> ... -> Goal State.
Suchman: Situation S_0 -> Improvisation A_0 -> Situation S_1 -> Consult Plan Resource P -> Improvisation A_1.
The action A_t is governed by the immediate indexical environment, not the symbolic step P_t.

FORMAL SHIFT:
<COMPUTATIONAL PLAN BLUEPRINT>
→ <SITUATED MATERIAL FRICTION>
→ [LOCAL CONTINGENCY NEGOTIATION]
→ <POST-HOC RATIONALIZATION>

SOURCE FORMALISM:
NONE

OUR FORMALIZATION:
[OUR FORMALIZATION — NOT SOURCE SYNTAX]
Action(t) = f(State(t), Material_Affordance(t)) \neq f(Plan(t))
Plan(t) = Rationalize(Action(t-1), Action(t-2), ..., Action(0))

TENSION:
Bratman (1987) argues that plans must have rational stability to prevent agentic deliberation paralysis; Suchman demonstrates that strict adherence to plan stability guarantees system failure in open environments.

MISSING:
A formal computational model of how an agent decides when to abandon a plan resource versus when to force the situation to fit the plan.

BOUNDARY:
Suchman’s analysis was conducted on human-machine interaction around physical machines (photocopiers); purely virtual closed-world environments (chess, compiler loops) can sustain deterministic plan execution.

CITATION TRAIL:
Bratman, Michael E. (1987), Intention, Plans, and Practical Reason; Agre, Philip E. and Chapman, David (1987), "Pengi: An Implementation of a Theory of Activity".

TEST:
Deploy an autonomous code-generation agent with a fixed 10-step plan versus an agent equipped only with reactive local error-recovery heuristics across 100 messy software refactoring tasks. Compare completion rates when APIs return undocumented responses.

PLATFORM:
[[game-04-plan]]

LINKS:
[[game-01-instruction]]
[[game-04-plan]]
[[game-09-conversation]]

BIBTEX:
@book{suchman1987plans,
  author    = {Lucy A. Suchman},
  title     = {Plans and Situated Actions: The Problem of Human-Machine Communication},
  year      = {1987},
  publisher = {Cambridge University Press},
  address   = {Cambridge}
}
```
