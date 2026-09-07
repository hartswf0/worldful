```text
ZETTEL

ID: 20260907-SACKS-1974-TURN-TAKING-SYSTEMATICS

TITLE:
Conversation allocates turns locally and recursively through projected Transition-Relevance Places without centralized governance.

SOURCE:
Sacks, Harvey; Schegloff, Emanuel A.; Jefferson, Gail — "A Simplest Systematics for the Organization of Turn-Taking for Conversation" — Language — 1974 — Vol. 50, No. 4, pp. 700–706.

PASSAGE:
[QUOTE]
"The turn-taking organization for conversation is locally managed, party-administered, and interactionally controlled... The basic component is the turn-constructional unit (TCU). At the possible completion of a TCU occurs a transition-relevance place (TRP). The rules governing turn allocation apply recursively at each TRP: (1) If the turn-so-far is so constructed as to involve the use of a 'current speaker selects next' technique, then the party so selected has the right and obligation to take the next turn; (2) If the turn is not so constructed, then self-selection may (but need not) be instituted; (3) If neither applies, the current speaker may continue."

RESEARCH OBJECT:
The decentralized, real-time algorithmic state machine that coordinates human spoken interaction with zero central arbiter and minimal gap/overlap.

LOCAL MOVE:
The authors formulate a rigorous, mechanical model of turn-allocation rules that operate strictly at transition boundaries, treating conversation as an autonomous social engineering feat rather than chaotic psychological expression.

SOURCE TERMS:
Turn-Constructional Unit (TCU); Transition-Relevance Place (TRP); current speaker selects next; self-selection; recipient design; local management.

WHAT BECAME STRANGE:
Human conversation operates with typical gaps between turns of less than 200 milliseconds, meaning the listener must predict the exact syntactic completion of the speaker's TCU long before the speaker finishes speaking.

QUESTION:
How can conversational turn-taking occur in human-LLM interaction when the machine cannot listen and compute its next turn while the human is speaking?

DEEPER QUESTION:
Why do chat interfaces model conversation as a rigid ping-pong document exchange rather than as a continuous negotiate-to-hold floor mechanism?

MECHANISM:
At each TRP:
Rule 1:
  (a) Current speaker selects next? -> Selected speaker must speak.
  (b) Current speaker does not select? -> First starter acquires turn rights.
  (c) Nobody self-selects? -> Current speaker may (but need not) continue.
Rule 2:
  If 1(c) occurs, the rules apply recursively at the next TRP.

FORMAL SHIFT:
<CONTINUOUS PHONOLOGICAL STREAM>
→ <PROJECTABLE TURN-CONSTRUCTIONAL UNITS>
→ [RECURSIVE RULE RESOLUTION AT TRP]
→ <SPEAKER TRANSITION WITH ZERO GAP/OVERLAP>

SOURCE FORMALISM:
State S_0: Speaker A produces TCU.
Boundary: Event TRP occurs.
Branch:
  If Target == B then State S_1: Speaker B.
  Else If B self-selects then State S_1: Speaker B.
  Else State S_1: Speaker A continues TCU.

OUR FORMALIZATION:
[OUR FORMALIZATION — NOT SOURCE SYNTAX]
Allocate_Turn(TRP_t) = {
  B      if Selects_Next(A, B) == True,
  First(Self_Select(\{Interlocutors\})) if Selects_Next(A) == False,
  A      if Timeout(\Delta t_{gap}) && Continue(A) == True
}

TENSION:
Grice's cooperative principle assumes actors maximize informational efficiency (maxims of quantity, quality, relation, manner); Conversation Analysis shows actors frequently sacrifice efficiency to preserve turn order and social face.

MISSING:
The mechanism of interruption and competitive overlap: how does the system arbitrate when two speakers self-select simultaneously at the exact same millisecond?

BOUNDARY:
The "simplest systematics" model applies specifically to natural informal conversation; institutional talk (courtrooms, debates, classrooms) relies on external pre-allocated turn structures.

CITATION TRAIL:
Grice, H. P. (1975), "Logic and Conversation"; Schegloff, Emanuel A. (2007), Sequence Organization in Interaction.

TEST:
Measure the latency of conversational voice agents during user pauses. Determine whether user frustration spikes when the agent treats a mid-TCU syntactic pause as a TRP and speaks out of turn.

PLATFORM:
[[game-09-conversation]]

LINKS:
[[game-01-instruction]]
[[game-07-gesture]]
[[game-09-conversation]]

BIBTEX:
@article{sacks1974simplest,
  author    = {Harvey Sacks and Emanuel A. Schegloff and Gail Jefferson},
  title     = {A Simplest Systematics for the Organization of Turn-Taking for Conversation},
  journal   = {Language},
  volume    = {50},
  number    = {4},
  pages     = {696--735},
  year      = {1974}
}
```
