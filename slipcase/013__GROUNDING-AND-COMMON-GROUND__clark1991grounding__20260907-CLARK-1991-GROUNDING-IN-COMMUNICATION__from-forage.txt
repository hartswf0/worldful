ZETTEL

ID: 20260907-CLARK-1991-GROUNDING-IN-COMMUNICATION

TITLE:
Conversation requires continuous mutual grounding coordinated through the principle of least collaborative effort.

SOURCE:
Clark, Herbert H. and Brennan, Susan E. — "Grounding in Communication" — Perspectives on Socially Shared Cognition — 1991 — Chapter 7, pp. 127–130.

PASSAGE:
[QUOTE]
"Communication is a collective activity. It requires coordinated action by all participants... To communicate is to establish and update 'common ground'—the mutual knowledge, mutual beliefs, and mutual assumptions that the contributors share. Contributing to conversation is not just producing an utterance; it is establishing the mutual belief that the listeners have understood what the speaker meant well enough for current purposes. This process is called grounding, and participants coordinate it in accordance with the principle of least collaborative effort."

RESEARCH OBJECT:
The interactional machinery of mutual evidence (acknowledgments, backchannels, repairs) required to establish common ground.

LOCAL MOVE:
The authors refute the "conduit metaphor" of communication (where information packets are shipped across a wire), proving that human conversation is a joint labor where both parties continually invest effort to confirm shared understanding before advancing.

SOURCE TERMS:
grounding; common ground; principle of least collaborative effort; presentation phase; acceptance phase; positive evidence; backchannel; repair.

WHAT BECAME STRANGE:
A user says "yeah" or nods while reading an AI response, but the AI possesses no sensory apparatus to receive this positive evidence, continuing to output tokens in a cognitive vacuum.

QUESTION:
What constitutes "positive evidence of understanding" for an autoregressive language model?

DEEPER QUESTION:
Why do LLM dialogues suffer from catastrophic context drift if the user fails to actively re-ground terms every three turns?

MECHANISM:
Contribution Cycle:
Phase 1 (Presentation): A utters string U for B to consider.
Phase 2 (Acceptance): B provides positive evidence e that B understands U.
Criterion: Grounding achieved if and only if A believes B understands U well enough for current purposes.
Constraint: Both parties minimize total joint effort: Effort(A) + Effort(B) = \min.

FORMAL SHIFT:
<UNILATERAL STATEMENT PRODUCTION>
→ <PRESENTATION + ACCEPTANCE CYCLE>
→ [COLLABORATIVE GROUNDING ITERATION]
→ <UPDATED MUTUAL COMMON GROUND ACCUMULATOR>

SOURCE FORMALISM:
NONE

OUR FORMALIZATION:
[OUR FORMALIZATION — NOT SOURCE SYNTAX]
Common_Ground_{t+1} = Common_Ground_t \cup \{ U_t \mid \text{Evidence}(B, U_t) \ge \tau_{purpose} \}

TENSION:
Sacks et al. (1974) treat turn-taking as structural rules independent of psychological states; Clark insists turn-taking is driven by cognitive assessments of mutual belief.

MISSING:
A quantitative threshold for "well enough for current purposes": high-stakes surgical teams require 100% read-back grounding; casual pub banter accepts 30% grounding ambiguity.

BOUNDARY:
The model assumes willing cooperative partners; bad-faith interrogators and gaslighters intentionally deny positive evidence to destabilize common ground.

CITATION TRAIL:
Sacks, Harvey et al. (1974), "A Simplest Systematics for the Organization of Turn-Taking"; Grice, H. P. (1975), "Logic and Conversation".

TEST:
Test human task completion rates in collaborative coding when the AI assistant emits periodic grounding tokens ("Got it, updating line 45...") versus when it remains silent until delivering the final 100-line code block.

PLATFORM:
[[game-09-conversation]]

LINKS:
[[game-01-instruction]]
[[game-07-gesture]]
[[game-09-conversation]]

BIBTEX:
@incollection{clark1991grounding,
  author    = {Herbert H. Clark and Susan E. Brennan},
  title     = {Grounding in Communication},
  booktitle = {Perspectives on Socially Shared Cognition},
  editor    = {Lauren B. Resnick and John M. Levine and Stephanie D. Teasley},
  pages     = {127--149},
  year      = {1991},
  publisher = {American Psychological Association},
  address   = {Washington, DC}
}
