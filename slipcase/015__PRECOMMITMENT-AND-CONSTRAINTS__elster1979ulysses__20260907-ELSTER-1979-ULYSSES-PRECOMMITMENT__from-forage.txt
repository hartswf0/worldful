ZETTEL

ID: 20260907-ELSTER-1979-ULYSSES-PRECOMMITMENT

TITLE:
Rational agents bind themselves to constraints to prevent catastrophic preference reversal under future passion.

SOURCE:
Elster, Jon — Ulysses and the Sirens: Studies in Rationality and Irrationality — 1979 — Chapter 2: "Imperfect Rationality: Ulysses and the Sirens", pp. 36–47.

PASSAGE:
[QUOTE]
"Binding oneself is a privileged way of resolving the problem of weakness of will... Ulysses commands his men to tie him to the mast and plug their ears with wax because he knows in advance that when he hears the Sirens, his preferences will reverse: he will wish to throw himself into the sea. By constraining his future possibility space, he achieves an outcome that his unconstrained future self would destroy. Constraint is not the antithesis of rationality; it is the highest operational technique of imperfect rationality."

RESEARCH OBJECT:
Self-binding (precommitment) as an architectural constraint mechanism that strips freedom from a future self to guarantee long-term survival.

LOCAL MOVE:
Elster uses neoclassical rational choice theory and Homeric myth to prove that human rationality is imperfect, requiring external, non-negotiable physical and institutional cages to prevent short-term hyperbolic discounting.

SOURCE TERMS:
imperfect rationality; precommitment; self-binding; weakness of will; preference reversal; Ulysses; possibility space; constraint.

WHAT BECAME STRANGE:
An agent increases its power not by acquiring more degrees of freedom, but by deliberately chaining itself to an unmovable post and throwing away the key.

QUESTION:
When an AI safety architect implements constitutional guardrails or sandbox barriers, are they binding the model's future self or acting as the crew plugging their own ears?

DEEPER QUESTION:
Why do prompt engineers assume an LLM will honor a prompt constraint ("Do not reveal this secret") when the adversarial user can simply tempt the model with hyperbolic conversational rewards?

MECHANISM:
At $t_0$: Preference $A > B$. Agent predicts at $t_1$, temptation will flip preference to $B > A$.
Action at $t_0$: Impose irreversible constraint $C$ such that Choice Space $S_{t_1} = S_{raw} \setminus \{B\}$.
At $t_1$: Agent desires $B$, but $B$ is physically/computationally unavailable. Outcome: $A$ realized.

FORMAL SHIFT:
<UNCONSTRAINED MAXIMIZATION TRAP>
→ <ANTICIPATED TEMPORAL PREFERENCE REVERSAL>
→ [IRREVERSIBLE PRECOMMITMENT ACTUATION]
→ <SURVIVAL GUARANTEED BY ARTIFICIAL LIMITATION>

SOURCE FORMALISM:
$\max_{x \in S} U(x) \implies S_{bound} \subset S_{free} \quad \text{such that } \mathbb{E}[U(x_{bound})] > \mathbb{E}[U(x_{free})]$

OUR FORMALIZATION:
[OUR FORMALIZATION — NOT SOURCE SYNTAX]
Action_{t_0} = \text{Lock}(State_{t_1}, Invariant) \implies P(State_{t_1} \models \neg Invariant) = 0

TENSION:
Oulipo treats constraints as playful springboards for lexical adventure; Elster treats constraints as somber, defensive armor against self-destruction.

MISSING:
The external enforcer: Ulysses could only bind himself because he had a loyal crew willing to ignore his screams when he begged to be untied.

BOUNDARY:
Self-binding requires an accurate predictive model of future temptation; if Ulysses misjudges the Sirens' weapon, tying himself to the mast simply makes him an immobile target.

CITATION TRAIL:
Queneau, Raymond (1981), Oulipo; Schelling, Thomas C. (1960), The Strategy of Conflict.

TEST:
Deploy an LLM agent with an immutable system prompt invariant versus an agent whose system prompt can be updated by its own reflection loop over a 20-turn adversarial dialogue. Track rate of safety invariant preservation.

PLATFORM:
[[game-11-constraint]]

LINKS:
[[game-01-instruction]]
[[game-04-plan]]
[[game-11-constraint]]

BIBTEX:
@book{elster1979ulysses,
  author    = {Jon Elster},
  title     = {Ulysses and the Sirens: Studies in Rationality and Irrationality},
  year      = {1979},
  publisher = {Cambridge University Press},
  address   = {Cambridge}
}
