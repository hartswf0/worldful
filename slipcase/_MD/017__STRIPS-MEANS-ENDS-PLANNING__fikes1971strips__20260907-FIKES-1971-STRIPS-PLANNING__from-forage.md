ZETTEL

ID: 20260907-FIKES-1971-STRIPS-PLANNING

TITLE:
Classical planning reduces action to state transition operators defined by preconditions, add lists, and delete lists under the closed-world assumption.

SOURCE:
Fikes, Richard E. and Nilsson, Nils J. — "STRIPS: A New Approach to the Application of Theorem Proving to Problem Solving" — Artificial Intelligence — 1971 — Vol. 2, No. 3–4, pp. 189–193.

PASSAGE:
[QUOTE]
"A planning system must be able to model the effects of actions on the world without recalculating the entire state from scratch. In STRIPS, each action is represented by an operator consisting of three components: a Precondition formula, which must be true for the operator to be applied; a Delete list, specifying the predicates that cease to hold after the action; and an Add list, specifying the new predicates that become true. All other facts about the world are assumed to remain unchanged. A plan is a sequence of such operators that transforms the initial world state into a state in which the goal formula is true."

RESEARCH OBJECT:
The STRIPS operator as the foundational formal representation of planned state transformation in symbolic Artificial Intelligence.

LOCAL MOVE:
Fikes and Nilsson solve the notorious AI "Frame Problem" by asserting the default persistence assumption: an action alters only what is explicitly named in its add and delete lists; everything else remains frozen.

SOURCE TERMS:
STRIPS; operator; precondition; add list; delete list; frame problem; initial state; goal state; state space search; closed-world assumption.

WHAT BECAME STRANGE:
STRIPS assumes that pushing a block changes only the position of that block, blithely ignoring that pushing a block scratches the table, makes a sound, consumes energy, warms the air, and startles the cat.

QUESTION:
Can an LLM acting as a planner survive in real-world software engineering where code edits routinely have catastrophic side effects not listed in the "add/delete" specification?

DEEPER QUESTION:
Why do contemporary autonomous agent frameworks still model task execution as STRIPS-style goal decompositions instead of continuous ecological adaptation?

MECHANISM:
World State $S = \{p_1, p_2, ..., p_n\}$.
Operator $O = \langle Preconditions, Delete, Add \rangle$.
Execution Step:
1. Verify $Preconditions \subseteq S$.
2. Compute new state: $S' = (S \setminus Delete) \cup Add$.
3. Check if $Goal \subseteq S'$. If not, search for next operator.

FORMAL SHIFT:
<COMPLEX CONTINUOUS DYNAMIC REALITY>
→ <DISCRETE PROPOSITIONAL STATE SETS>
→ [ADD/DELETE SET MUTATION OPERATORS]
→ <LINEAR CHAIN OF DETERMINISTIC PLAN STEPS>

SOURCE FORMALISM:
$State_{k+1} = (State_k \setminus \text{Delete}(O)) \cup \text{Add}(O)$

OUR FORMALIZATION:
[OUR FORMALIZATION — NOT SOURCE SYNTAX]
Plan(S_0, G) = [O_1, ..., O_m] \iff \left(\prod_{i=1}^m O_i\right)(S_0) \models G

TENSION:
Lucy Suchman’s situated actions framework proves that environmental contingency permanently outruns the static add/delete lists of any formal operator.

MISSING:
Uncertainty and duration: STRIPS operators execute instantaneously and succeed with probability 1.0; they cannot represent actions that take 10 minutes and fail 20% of the time.

BOUNDARY:
STRIPS is mathematically complete and sound only within closed, discrete, fully observable worlds (blocks world, toy robotics).

CITATION TRAIL:
Newell, Allen and Simon, Herbert A. (1972), Human Problem Solving; Suchman, Lucy A. (1987), Plans and Situated Actions.

TEST:
Construct a benchmark where a planning agent must deploy software to a server where 5% of commands silently alter environment variables outside the command's documented output. Measure how many steps elapse before the STRIPS-based agent crashes.

PLATFORM:
[[game-04-plan]]

LINKS:
[[game-01-instruction]]
[[game-04-plan]]
[[game-09-conversation]]

BIBTEX:
@article{fikes1971strips,
  author    = {Richard E. Fikes and Nils J. Nilsson},
  title     = {{STRIPS}: A New Approach to the Application of Theorem Proving to Problem Solving},
  journal   = {Artificial Intelligence},
  volume    = {2},
  number    = {3--4},
  pages     = {189--208},
  year      = {1971}
}
