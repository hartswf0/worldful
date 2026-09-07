```text
ZETTEL

ID: 20260907-WINOGRAD-1986-COMMITMENT-MACHINE

TITLE:
Language is a dance of social commitments mapped through a state machine of speech acts, not information transfer.

SOURCE:
Winograd, Terry and Flores, Fernando — Understanding Computers and Cognition: A New Foundation for Design — 1986 — Chapter 5: "Interaction, Language, and Design", pp. 58–64.

PASSAGE:
[QUOTE]
"In developing a design for interaction, we must recognize that language is not a transmission of information, but a network of human commitments. When one person makes a request of another, they enter into a conversation for action... The network of speech acts consists of explicit state transitions: Request, Negotiation (Promise or Decline), Performance (Assertion of Completion), and Assessment (Declaration of Satisfaction). In breakdown, this network of commitments becomes visible."

RESEARCH OBJECT:
The formal modeling of cooperative workflow as a state automaton of mutual communicative obligations.

LOCAL MOVE:
Winograd abandons his earlier symbolic AI microworld system (SHRDLU) in favor of hermeneutic phenomenology (Heidegger) and speech act theory (Austin/Searle), proving that computing systems must coordinate social commitments rather than process disembodied representations.

SOURCE TERMS:
conversation for action; commitment; breakdown; ready-to-hand; present-at-hand; request; promise; declination; satisfaction.

WHAT BECAME STRANGE:
An interactive software program is not a data calculator; it is an administrative clerk recording who has promised what to whom and what remains unfulfilled.

QUESTION:
What happens when an autonomous agent is prompted to "promise" an action but possesses no legal liability or bodily vulnerability if it reneges?

DEEPER QUESTION:
Can a machine make a promise in Winograd’s sense if it cannot experience a social breakdown (*Unzuhandenheit*)?

MECHANISM:
State 1: Speaker A makes Request to B.
Branch 1: B Promises -> State 2.
Branch 2: B Declines -> State 3 (Terminal).
Branch 3: B Counter-offers -> Loop to State 1.
From State 2: B Asserts Completion -> State 4.
From State 4: A Declares Satisfaction -> State 5 (Terminal).

FORMAL SHIFT:
<UNSTRUCTURED NATURAL DIALOGUE>
→ <EXPLICIT SPEECH-ACT STATE MACHINE>
→ [COMMITMENT TRACKING]
→ <AUDITABLE ORGANIZATIONAL CLOSURE>

SOURCE FORMALISM:
Conversation-for-Action Transition Graph:
A: Request -> B: Promise | Decline | Counter
B: Assert Completion -> A: Declare Satisfaction | Dispute

OUR FORMALIZATION:
[OUR FORMALIZATION — NOT SOURCE SYNTAX]
State_{t+1} = \delta(State_t, Act(Speaker, Addressee, Type))
where Type \in \{Request, Promise, Decline, Counter, Assert, Declare\}

TENSION:
Suchman (1987) critiques Winograd’s Coordinator system for forcing fluid human interaction into rigid pre-programmed categorical boxes, creating bureaucratic paralysis.

MISSING:
The informal grease: human conversations routinely resolve tasks without explicitly entering formal declaration states.

BOUNDARY:
The model requires institutional enforceability; if B's declaration of completion cannot be legally challenged, the state machine degenerates into meaningless text strings.

CITATION TRAIL:
Searle, John R. (1969), Speech Acts; Suchman, Lucy A. (1987), Plans and Situated Actions.

TEST:
Build an agent communication protocol where tasks are dispatched strictly via Winograd commitment states. Measure whether error cascades decrease compared to raw unstructured chat dispatching.

PLATFORM:
[[game-01-instruction]]

LINKS:
[[game-01-instruction]]
[[game-04-plan]]
[[game-09-conversation]]

BIBTEX:
@book{winograd1986understanding,
  author    = {Terry Winograd and Fernando Flores},
  title     = {Understanding Computers and Cognition: A New Foundation for Design},
  year      = {1986},
  publisher = {Ablex Publishing Corporation},
  address   = {Norwood, NJ}
}
```
