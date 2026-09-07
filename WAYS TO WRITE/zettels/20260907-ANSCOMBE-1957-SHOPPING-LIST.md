```text
ZETTEL

ID: 20260907-ANSCOMBE-1957-SHOPPING-LIST

TITLE:
Direction of fit originates in the asymmetry of mistake location between shopping list and detective log.

SOURCE:
Anscombe, G. E. M. — Intention — 1957 — §32, pp. 56–57.

PASSAGE:
[QUOTE]
"Let us consider a man going round a town with a shopping list in his hand. Now it is clear that the relation of this list to the things he buys and of his list to what he buys is different from the relation of a list which a detective following him might make of what he buys. If the list and the things that the man buys do not agree, and if this and this alone constitutes a mistake, then the mistake is not in the list but in the man's performance... whereas if the detective's record and what the man bought do not agree, then the mistake is in the record."

RESEARCH OBJECT:
The location of the error when token and world diverge as the criterion separating imperative directive from empirical report.

LOCAL MOVE:
Anscombe introduces two physically identical inscriptions carried through space to prove that intentionality cannot be discovered by examining the syntactic surface of the text alone, but only by locating where corrective revision must fall when world and text disagree.

SOURCE TERMS:
shopping list; detective's list; mistake in performance; mistake in the record; relation of list to things.

WHAT BECAME STRANGE:
The two lists can contain the exact same strings in the exact same order ("butter, milk, bread"), yet the operational semantics are inverted: one obligates reality to conform to ink, while the other obligates ink to conform to reality.

QUESTION:
If an autoregressive model produces a sequence of tokens, does the sequence inherit its direction of fit from the user prompt, the model weights, or the executing runtime environment?

DEEPER QUESTION:
Can an agent determine whether a string is a command or an observation without external knowledge of who bears the obligation to revise upon failure?

MECHANISM:
Mismatch detected between symbolic list L and physical item set W:
If actor is Shopper: Delta(W) <- execute(L); error(W) = W \ L.
If actor is Detective: Delta(L) <- record(W); error(L) = L \ W.

FORMAL SHIFT:
<IDENTICAL TOKEN SEQUENCE S>
→ <DUAL ACTOR ROLE: SHOPPER vs DETECTIVE>
→ [MISMATCH ARBITRATION]
→ <LOCUS OF REVISION: WORLD vs INSCRIPTION>

SOURCE FORMALISM:
NONE

OUR FORMALIZATION:
[OUR FORMALIZATION — NOT SOURCE SYNTAX]
Fit(S, W) = {
  World-to-Word (Directive): Cost(Delta W) < Cost(Delta S) = Invariant(S),
  Word-to-World (Assertive): Cost(Delta S) < Cost(Delta W) = Invariant(W)
}

TENSION:
Searle (1979) formalizes this as arrows (Downwards/Upwards), but Anscombe insists the distinction is not a property of the linguistic symbol but of the practical practical reasoning of an embodied agent capable of error.

MISSING:
The mechanism of enforcement: who compels the shopper to discard margarine and purchase butter, and what happens when the shopper refuses?

BOUNDARY:
Anscombe does not license treating the shopping list as an algorithm or machine program; it remains situated in human voluntary action.

CITATION TRAIL:
Searle, John R. (1975), "A Taxonomy of Illocutionary Acts"; Austin, J. L. (1962), How to Do Things with Words.

TEST:
Feed an identical ambiguous sentence ("The door is closed") to an execution harness with two different error handlers: one that actuates a servo to close the door, and one that logs an alert when the sensor reads open. Test whether prompt text alone can distinguish the failure modes.

PLATFORM:
[[game-01-instruction]]

LINKS:
[[game-01-instruction]]
[[game-04-plan]]
[[game-05-query]]

BIBTEX:
@book{anscombe1957intention,
  author    = {G. E. M. Anscombe},
  title     = {Intention},
  year      = {1957},
  publisher = {Basil Blackwell},
  address   = {Oxford}
}
```
