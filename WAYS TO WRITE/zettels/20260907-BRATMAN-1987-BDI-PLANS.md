```text
ZETTEL

ID: 20260907-BRATMAN-1987-BDI-PLANS

TITLE:
Future-directed intentions function as stabilizing execution anchors that limit the cognitive cost of continuous deliberation.

SOURCE:
Bratman, Michael E. — Intention, Plans, and Practical Reason — 1987 — Chapter 2: "The Plan Distinction", pp. 14–22.

PASSAGE:
[QUOTE]
"Rational agents like us are planning agents. We form future-directed intentions, and these intentions are elements of larger, partial plans... Intentions are not merely desires or beliefs; they possess a characteristic stability. Once an agent forms an intention to act, this intention resists reconsideration in the face of minor fluctuations in desires. The functional role of plans is to coordinate our activities over time and with other agents, by settling in advance what we will do, thereby pruning the tree of alternatives that must be evaluated at every passing second."

RESEARCH OBJECT:
The commitment-filter function of intentions in resource-bounded agents, preventing computational exhaustion from ceaseless re-deliberation.

LOCAL MOVE:
Bratman establishes the Belief-Desire-Intention (BDI) architecture in philosophy of mind, showing that intentions are functional commitments that restrict future practical reasoning to options compatible with the prior plan.

SOURCE TERMS:
future-directed intention; plan; practical reason; stability; reconsideration; commitment filter; coordination; resource-bounded agent.

WHAT BECAME STRANGE:
An agent deliberates not to find the optimal decision at each millisecond, but to stop deliberating so that action becomes computationally affordable.

QUESTION:
When an autonomous AI agent encounters a tool error, how does it compute the threshold between stubbornly executing its existing plan versus completely re-planning from scratch?

DEEPER QUESTION:
Can an autoregressive model exhibit genuine Bratmanian intention if its context window re-evaluates all historical tokens at every forward pass?

MECHANISM:
1. Agent deliberates over options $\{O_1, ..., O_n\}$ given Beliefs $B$ and Desires $D$.
2. Agent adopts Intention $I = O_k$, embedding it into Plan $P$.
3. Time advances to $t+1$. New options $O'$ evaluated:
   - Filter Condition: If $O'_j$ is incompatible with $I$, reject $O'_j$ without computing its expected utility.
   - Non-reconsideration: Re-open deliberation only if an unexpected environmental shock exceeds threshold $\Theta$.

FORMAL SHIFT:
<CONTINUOUS RE-DELIBERATION OVERLOAD>
→ <FUTURE-DIRECTED INTENTION ADOPTION>
→ [COMPATIBILITY PRUNING FILTER]
→ <STABILIZED TEMPORAL COORDINATION>

SOURCE FORMALISM:
$P = \langle Subgoals, Commitments angle \quad 	ext{where } orall a \in Actions, 	ext{Consistent}(a, P) = 	ext{True}$

OUR FORMALIZATION:
[OUR FORMALIZATION — NOT SOURCE SYNTAX]
Choice(t) = rg\max_{a \in Filter(Actions, Plan_t)} Utility(a) \quad 	ext{where } Filter(a, P) = \{a \mid 	ext{Consistent}(a, P)\}

TENSION:
Suchman (1987) shows that holding fast to intentions in dynamic social environments produces blindness to immediate emergent affordances.

MISSING:
The exact mathematical threshold $\Theta$ that defines when an environmental change is "significant enough" to justify discarding a plan.

BOUNDARY:
Bratman’s framework assumes a single unified agent mind; it requires modification when distributed multi-agent systems negotiate overlapping conflicting plans.

CITATION TRAIL:
Suchman, Lucy A. (1987), Plans and Situated Actions; Rao, A. S. and Georgeff, M. P. (1995), "BDI Agents: From Theory to Practice".

TEST:
Implement a coding agent with an explicit Bratmanian commitment filter that rejects re-planning unless compilation fails 3 consecutive times. Compare token consumption against an agent that re-plans after every single tool call.

PLATFORM:
[[game-04-plan]]

LINKS:
[[game-01-instruction]]
[[game-04-plan]]
[[game-11-constraint]]

BIBTEX:
@book{bratman1987intention,
  author    = {Michael E. Bratman},
  title     = {Intention, Plans, and Practical Reason},
  year      = {1987},
  publisher = {Harvard University Press},
  address   = {Cambridge, MA}
}
```
