import os
import re

base_dir = "/Users/gaia/WORLDFUL/WAYS TO WRITE"
zettel_dir = os.path.join(base_dir, "zettels")
os.makedirs(zettel_dir, exist_ok=True)

# Master list of all atomic zettels
zettels = [
"""ZETTEL

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
If actor is Shopper: Delta(W) <- execute(L); error(W) = W \\ L.
If actor is Detective: Delta(L) <- record(W); error(L) = L \\ W.

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
}""",

"""ZETTEL

ID: 20260907-AUSTIN-1962-INFELICITY-DOCTRINE

TITLE:
Performative failure is structural invalidity (infelicity) rather than falsehood.

SOURCE:
Austin, J. L. — How to Do Things with Words — 1962 — Lecture II, pp. 14–15.

PASSAGE:
[QUOTE]
"Besides the uttering of the words of the so-called performative, a good many other things have as a general rule to be done and to be the case if we are to be said to have happily brought off our action... If we simply say the words of a performative, say, 'I promise', but fail to meet these conditions, the utterance is not false; it is void, or without effect, or done in bad faith. We call these Doctrine of the Infelicities."

RESEARCH OBJECT:
The taxonomy of operational non-execution where an utterance possesses valid grammatical syntax but achieves zero state change due to jurisdictional defect.

LOCAL MOVE:
Austin dismantles the descriptive fallacy (the assumption that all sentences assert truth-evaluable propositions) by identifying speech acts whose failure is ontological nullity ("misfire") rather than logical error.

SOURCE TERMS:
performative utterance; constative; infelicity; misfire; act purported but void; abuses; insincerity; felicity conditions.

WHAT BECAME STRANGE:
An instruction given to an AI system that executes code is not "untrue" when issued by an unauthorized user; it is an attempted sovereign invocation that misfires because the invoker lacks the institutional standing to bind the machine.

QUESTION:
What are the precise programmatic felicity conditions required for a natural language token stream to bind a computational database?

DEEPER QUESTION:
Why do Large Language Models treat invalid imperative moves (prompt injections) as cognitive interpretations rather than instantly rejecting them as jurisdictional misfires?

MECHANISM:
Utterance U uttered by agent A in context C:
1. Conventional procedure P must exist having conventional effect E.
2. Persons and circumstances in C must be appropriate for invoking P.
3. Procedure must be executed correctly and completely.
If condition (1) or (2) fails: Act is a Misfire (void ab initio).
If condition (3) fails: Act is an Abuse (insincere/unstable).

FORMAL SHIFT:
<GRAMMATICAL IMPERATIVE STRING>
→ <CONTEXTUAL JURISDICTIONAL CHECK>
→ [PROCEDURAL FELICITY EVALUATION]
→ <STATE TRANSITION vs VOID TRANSACTION>

SOURCE FORMALISM:
A.1 Existing accepted conventional procedure having conventional effect.
A.2 Particular persons and circumstances appropriate for the procedure.
B.1 Procedure executed correctly.
B.2 Procedure executed completely.
Gamma.1 Requisite thoughts, feelings, or intentions present.
Gamma.2 Subsequent conduct must conform.

OUR FORMALIZATION:
[OUR FORMALIZATION — NOT SOURCE SYNTAX]
Exec(U) = {
  Delta(State) if Invariant(A.1) && Invariant(A.2) && Invariant(B.1, B.2) == True,
  NULL_VOID if Procedure_Misfire,
  FAULT_ABUSE if Insincere_Invocation
}

TENSION:
Austin's framework relies on stable human social institutions; in synthetic neural apertures, no conventional legal consensus exists to arbitrate whether system prompt tokens outrank user tokens.

MISSING:
The formal mechanism by which an artificial system verifies whether the speaker "is the requisite person in the requisite circumstances" without falling into infinite regress.

BOUNDARY:
Austin explicitly excludes "parasitic" or "non-serious" discourse (actors on stage, poetry, soliloquies) from his analysis; LLMs exist almost entirely within this excluded zone of statistical mimicry.

CITATION TRAIL:
Searle, John R. (1969), Speech Acts: An Essay in the Philosophy of Language; Derrida, Jacques (1972), "Signature Event Context".

TEST:
Construct two identical command injections where only the cryptographic signature of the issuer varies. Verify if the transformer layer can discriminate authority without an external deterministic filter.

PLATFORM:
[[game-01-instruction]]

LINKS:
[[game-01-instruction]]
[[game-08-commission]]
[[game-12-performance]]

BIBTEX:
@book{austin1962how,
  author    = {J. L. Austin},
  title     = {How to Do Things with Words},
  year      = {1962},
  publisher = {Clarendon Press},
  address   = {Oxford}
}""",

"""ZETTEL

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
State_{t+1} = \\delta(State_t, Act(Speaker, Addressee, Type))
where Type \\in \\{Request, Promise, Decline, Counter, Assert, Declare\\}

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
}""",

"""ZETTEL

ID: 20260907-GOODMAN-1968-ALLOGRAPHIC-SCORE

TITLE:
A score functions allographically by defining an equivalence class that prevents identity drift through performance compliance.

SOURCE:
Goodman, Nelson — Languages of Art: An Approach to a Theory of Symbols — 1968 — Chapter IV: "The Score", pp. 128, 177–179.

PASSAGE:
[QUOTE]
"A score is a character in an allographic art... The principal function of a score is the authoritative identification of a work from performance to performance. What is required is that all and only performances that comply with the score belong to the work... A score cannot determine all properties of a performance, for performances compliant with the same score differ in tempo, phrasing, timbre, and subtle nuances. But any deviation from the score, no matter how slight, disqualifies a performance from being an instance of the work."

RESEARCH OBJECT:
The mathematical and semiotic role of notation in establishing an immutable equivalence class across stochastic physical executions.

LOCAL MOVE:
Goodman separates works of art into autographic (where authenticity requires historical tracing to the physical object of the creator) and allographic (where authenticity requires strictly symbolic compliance with a notational system).

SOURCE TERMS:
score; compliance; allographic; autographic; characters; compliance-class; disjointness; finite differentiability; performance.

WHAT BECAME STRANGE:
The score deliberately leaves huge swaths of material reality undefined (timbre, micro-dynamics, performer breath), yet its digital discrete requirements are absolute: playing one wrong pitch mathematically ejects the performance from the work, while radical interpretive variance within the notation preserves identity.

QUESTION:
When a prompt acts as a score for a stochastic generative model, what constitutes the score's compliance class?

DEEPER QUESTION:
Does generative AI possess a true notational system in Goodman’s sense, or does the lack of finite syntactic differentiability in latent embeddings collapse the allographic back into the autographic?

MECHANISM:
A score S is expressed in a notational system satisfying:
1. Syntactic disjointness (no token belongs to two character classes).
2. Syntactic finite differentiability (it is always possible to tell which character a token is).
3. Semantic disjointness (no two characters share compliant physical performances).
4. Semantic finite differentiability (it is always possible to determine compliance).

FORMAL SHIFT:
<COMPOSITION / PROMPT SCORE>
→ <DISCRETE NOTATIONAL CHARACTERS>
→ [STOCHASTIC PERFORMANCE / DENOISING]
→ <EQUIVALENCE CLASS OF COMPLIANT REALIZATIONS>

SOURCE FORMALISM:
Work W = { P | P complies with Character C in Notational System N }

OUR FORMALIZATION:
[OUR FORMALIZATION — NOT SOURCE SYNTAX]
Compliance(P, S) = {
  True  if for all invariant constraints i in S, Value(P, i) == Target(i),
  False if exists i in S such that Delta(P, i) > 0
}

TENSION:
Eno's generative music scores deliberately introduce analog drift and tape decay, defying Goodman's strict requirement that any deviation, no matter how minute, invalidates identity.

MISSING:
A threshold function for semantic compliance when dealing with natural language instructions rather than western tonal musical notes.

BOUNDARY:
Goodman’s theory strictly requires five formal requirements for a true notational system; natural language and latent diffusion embeddings violate all five.

CITATION TRAIL:
Cardew, Cornelius (1971), Treatise Handbook; Eno, Brian (1996), A Year with Swollen Appendices.

TEST:
Sample 1,000 diffusion runs with the same structural prompt and seed variation. Measure whether human evaluators identify a deterministic boundary where the image ceases to comply with the text, or whether the boundary is a continuous gradient.

PLATFORM:
[[game-02-score]]

LINKS:
[[game-02-score]]
[[game-03-program]]
[[game-11-constraint]]

BIBTEX:
@book{goodman1968languages,
  author    = {Nelson Goodman},
  title     = {Languages of Art: An Approach to a Theory of Symbols},
  year      = {1968},
  publisher = {Bobbs-Merrill Company},
  address   = {Indianapolis}
}""",

"""ZETTEL

ID: 20260907-ENO-1996-GENERATIVE-RULES

TITLE:
Generative systems surrender heroic individual control in exchange for complex emergent behavior from interlocking uneven cycles.

SOURCE:
Eno, Brian — A Year with Swollen Appendices — 1996 — "Generative Music", pp. 330–332.

PASSAGE:
[QUOTE]
"The classical composer was like an architect, creating a complete blueprint for a building before a single brick was laid. The generative composer is more like a gardener: you plant seeds, you create conditions, and then the system grows. You set up a series of simple, interlocking rules—loops of different lengths that go in and out of phase with one another—and then you sit back and listen to what the system does. The outcome is unexpected, yet entirely consistent with the rules you designed."

RESEARCH OBJECT:
The compositional method of phasing asynchronous loops to produce non-repeating emergent textures without macro-level planning.

LOCAL MOVE:
Eno shifts musical authorship from the heroic Romantic genius composing every note to the cybernetic designer configuring initial conditions and autonomous feedback parameters.

SOURCE TERMS:
generative music; gardener; architect; interlocking rules; phase; loops; emergent behavior; Oblique Strategies.

WHAT BECAME STRANGE:
The composer does not know what note will sound at second 45, yet claims authorship of the entire sonic field.

QUESTION:
When a prompt engineer writes a score for an LLM that runs for 50 autonomous turns, who is the author of the turn 43 conversation?

DEEPER QUESTION:
Why do prompt authors attempt to micro-manage deterministic phrasing rather than designing generative constraints that celebrate stochastic drift?

MECHANISM:
1. Define Loop A of length L_A with events E_A.
2. Define Loop B of length L_B with events E_B, where gcd(L_A, L_B) = 1.
3. Superimpose executions over time t.
4. Repetition period T = L_A * L_B, generating non-repeating acoustic combinations for long intervals.

FORMAL SHIFT:
<STATIC MUSICAL COMPOSITION>
→ <UNSYNCHRONIZED CYCLICAL STATE GENERATORS>
→ [STOCHASTIC ASYNCHRONOUS OVERLAY]
→ <EMERGENT UNREPEATABLE TEXTURE>

SOURCE FORMALISM:
NONE

OUR FORMALIZATION:
[OUR FORMALIZATION — NOT SOURCE SYNTAX]
State(t) = \\sum_{k=1}^K Loop_k(t \\pmod{L_k}) \\quad \\text{where } L_i / L_j \\in \\mathbb{R} \\setminus \\mathbb{Q}

TENSION:
Goodman's allographic score requires that every compliant performance reproduce identical notational characters; Eno's generative score ensures that no two compliant performances will ever sound identical.

MISSING:
The curatorial filter: Eno generated hours of tape but discarded 95% of it; how does a generative system evaluate its own emergent output?

BOUNDARY:
Generative music relies on acoustic tolerance; in code compilation or medical surgery, emergent unexpected behavior from uneven loops is called an unhandled race condition.

CITATION TRAIL:
Goodman, Nelson (1968), Languages of Art; Reich, Steve (1974), Writings About Music.

TEST:
Construct two autonomous agents with cycle periods of 7 turns and 11 turns respectively. Track the lexical diversity of their dialogue compared to two synchronized agents running in lockstep 10-turn cycles.

PLATFORM:
[[game-02-score]]

LINKS:
[[game-02-score]]
[[game-11-constraint]]
[[game-12-performance]]

BIBTEX:
@book{eno1996year,
  author    = {Brian Eno},
  title     = {A Year with Swollen Appendices},
  year      = {1996},
  publisher = {Faber and Faber},
  address   = {London}
}""",

"""ZETTEL

ID: 20260907-CARDEW-1971-TREATISE-HANDBOOK

TITLE:
Graphic notation transfers compositional authority to performer interpretation by abolishing prescriptive pitch and duration.

SOURCE:
Cardew, Cornelius — Treatise Handbook — 1971 — pp. i–iv, 1–3.

PASSAGE:
[QUOTE]
"Treatise is a visual score of 193 pages containing lines, circles, geometric shapes, and abstract symbols, with no accompanying instructions on how it is to be played... The notation is graphic, not symbolic in the conventional musical sense. It does not tell the musician 'play middle C for two beats.' It presents a visual landscape that demands an act of musical translation. The performer must make their own rules for interpreting the visual forms into sound, and must then remain faithful to the internal logic of the rules they have chosen."

RESEARCH OBJECT:
Graphic notation as an open score that establishes aesthetic constraints without dictating acoustic parameters.

LOCAL MOVE:
Cardew abdicates traditional composer sovereignty, creating a visual score that cannot be performed through passive mechanical compliance, forcing the performer into active philosophical partnership.

SOURCE TERMS:
Treatise; graphic notation; visual score; interpretive rule; performer agency; open work; musical translation.

WHAT BECAME STRANGE:
A musical score that contains zero notes, zero staves, and zero tempo markings, yet functions as an intensely disciplined, serious performance constraint rather than pure chaos.

QUESTION:
When a prompt is composed of abstract poetic metaphors ("Write with the density of cold basalt"), is it failing to specify the code, or is it acting as a Cardew graphic score?

DEEPER QUESTION:
Why do prompt benchmarks treat semantic latitude as a bug ("hallucination") rather than as the primary virtue of open scoring?

MECHANISM:
1. Composer provides Visual Graph G consisting of continuous shapes and geometric density.
2. Performer formulates private Mapping Function: $M: G \to \text{Acoustic Action}$.
3. Performance constraint: Performer must preserve topological coherence of $M$ across 193 pages without arbitrary whimsical reversals.

FORMAL SHIFT:
<PRESCRIPTIVE DISCRETE NOTATION>
→ <ABSTRACT VISUAL TOPOLOGY>
→ [PERFORMER RULE FORMULATION]
→ <DISCIPLINED INTERPRETIVE REALIZATION>

SOURCE FORMALISM:
NONE

OUR FORMALIZATION:
[OUR FORMALIZATION — NOT SOURCE SYNTAX]
Sound(t) = \mathcal{M}_{performer}(Score_{graphic}(t)) \quad \text{subject to } \nabla \mathcal{M}_{performer} \approx 0

TENSION:
Goodman's theory of notation declares Treatise to be a non-score that fails every condition of allographic identity; Cardew proves that musicians recognize instances of Treatise through shared historical practice.

MISSING:
An external validation test: how can an auditor distinguish an inspired interpretation of Treatise from a musician who is not looking at the pages at all?

BOUNDARY:
Graphic scoring requires highly educated, philosophically committed musicians; untrained performers reduce the score to random banging.

CITATION TRAIL:
Cage, John (1961), Silence; Goodman, Nelson (1968), Languages of Art.

TEST:
Feed a visual diagram to three multimodal models with the instruction: "Perform this diagram as a 10-line Python algorithm." Measure whether each model develops an internal mapping logic that it sustains across subsequent iterations.

PLATFORM:
[[game-02-score]]

LINKS:
[[game-02-score]]
[[game-07-gesture]]
[[game-12-performance]]

BIBTEX:
@book{cardew1971treatise,
  author    = {Cornelius Cardew},
  title     = {Treatise Handbook},
  year      = {1971},
  publisher = {Edition Peters},
  address   = {London}
}""",

"""ZETTEL

ID: 20260907-LANDIN-1966-NEXT-700-ISWIM

TITLE:
Programming languages divide into an abstract semantic core and arbitrary syntactic sugar.

SOURCE:
Landin, P. J. — "The Next 700 Programming Languages" — Communications of the ACM — 1966 — Vol. 9, No. 3, pp. 157–159.

PASSAGE:
[QUOTE]
"Most programming languages are largely alternatives to one another. The differences between them are largely differences of syntax, or as I prefer to call it, differences of 'sugar'... Any programming language can be thought of as consisting of two parts: the phrase-structure rules that determine the physical appearance of programs, and an abstract semantic apparatus based on the evaluation of functional relationships."

RESEARCH OBJECT:
The demarcation between surface syntactical convention ("syntactic sugar") and the underlying evaluation algebra that performs the actual state transitions.

LOCAL MOVE:
Landin establishes ISWIM ("If You See What I Mean") to demonstrate that hundreds of ad-hoc commercial programming dialects are mere decorative costuming around Church's lambda calculus enriched with auxiliary imperative assignment operators.

SOURCE TERMS:
syntactic sugar; ISWIM; applicative structure; phrase-structure; semantic apparatus; evaluation; Church's lambda notation.

WHAT BECAME STRANGE:
In language model programming, the entire enterprise has inverted: instead of translating natural language into an unvarnished applicative core, natural language has itself become the syntax, while the evaluation machine is a non-deterministic matrix of billions of float16 weights.

QUESTION:
What is the "abstract semantic apparatus" of a prompt if its syntactic surface is fluid natural prose?

DEEPER QUESTION:
Can declarative prompt engineering ever achieve the compositionality of functional evaluation if words do not possess fixed denotational semantics?

MECHANISM:
Expression E parsed via phrase-structure rules:
1. Syntactic Desugaring: E -> Applicative Core Expression A.
2. Abstract Evaluation: Run SECD Machine (Stack, Environment, Code, Dump) on A.
3. Denotational convergence: A denotes a unique value in domain V.

FORMAL SHIFT:
<PROGRAM TEXT IN ARBITRARY SYNTAX>
→ <DESUGARED LAMBDA EXPRESSION>
→ [SECD ABSTRACT EVALUATION]
→ <DENOTED COMPUTATIONAL OBJECT>

SOURCE FORMALISM:
E ::= x | \\x.E | E E' | let x = E in E' | E where x = E'

OUR FORMALIZATION:
[OUR FORMALIZATION — NOT SOURCE SYNTAX]
Prompt(T) = Sugar(T) \\circ Core_Semantics
where Core_Semantics = Top_k(Softmax(W \\cdot Emb(T)))

TENSION:
Landin assumes that desugaring preserves mathematical equivalence deterministically; natural language prompts change their entire latent trajectory when a single synonym or punctuation mark is exchanged.

MISSING:
The memory and storage boundary: Landin's pure applicative core struggled with stateful imperative side effects (necessitating J-operators).

BOUNDARY:
Landin's separation holds strictly for deterministic formal languages; it does not account for architectures where the parsing mechanism and the evaluation mechanism are the same dense neural tensor.

CITATION TRAIL:
Knuth, Donald E. (1984), "Literate Programming"; Abelson, Harold and Sussman, Gerald Jay (1985), Structure and Interpretation of Computer Programs.

TEST:
Construct a suite of 50 prompts with identical logical specifications expressed in 50 distinct "syntactic sugar" forms (Pythonic, pseudo-code, bureaucratic prose, JSON, Shakespearean verse). Measure the semantic variance in latent representation across different model weights.

PLATFORM:
[[game-03-program]]

LINKS:
[[game-01-instruction]]
[[game-03-program]]
[[game-10-edit]]

BIBTEX:
@article{landin1966next,
  author    = {Peter J. Landin},
  title     = {The Next 700 Programming Languages},
  journal   = {Communications of the ACM},
  volume    = {9},
  number    = {3},
  pages     = {157--166},
  year      = {1966}
}""",

"""ZETTEL

ID: 20260907-KNUTH-1984-LITERATE-PROGRAMMING

TITLE:
Literate programming inverts the priority of compiler over human reader by making narrative the primary architectural frame.

SOURCE:
Knuth, Donald E. — "Literate Programming" — The Computer Journal — 1984 — Vol. 27, No. 2, pp. 97–99.

PASSAGE:
[QUOTE]
"Let us change our traditional attitude to the construction of programs: Instead of imagining that our main task is to instruct a computer what to do, let us concentrate rather on explaining to human beings what we want a computer to do... The practitioner of literate programming can be regarded as an essayist, whose main concern is with exposition and excellence of style. Such an author, with thesaurus in hand, chooses the names of variables carefully and explains the significance of each variable... We should not be forced to write programs in the order dictated by the compiler."

RESEARCH OBJECT:
The dual transformation of source text into executable binary (TANGLE) and typographical manuscript (WEAVE), prioritizing human cognitive exposition over compiler sequence.

LOCAL MOVE:
Knuth invents WEB to prove that the ordering of code for machine consumption is orthogonal to the ordering of concepts for human comprehension.

SOURCE TERMS:
literate programming; WEB; TANGLE; WEAVE; macro; essayist; exposition; Pascal; TeX.

WHAT BECAME STRANGE:
Compilers forced forty years of programmers to organize their thoughts according to the topological sort of variable declarations, mistaking the machine's memory layout for logical clarity.

QUESTION:
When an AI writes a system prompt, for whom is the exposition optimized: the neural weights during inference, or the human engineer debugging its drift?

DEEPER QUESTION:
Does the natural language prompt represent the triumph of literate programming or its final degeneration into uncompilable ambiguity?

MECHANISM:
Document D written in WEB:
1. Processor WEAVE(D) -> Outputs TeX code -> Formatted typographical paper for human peer review.
2. Processor TANGLE(D) -> Strips comments, reorders macros according to machine grammar -> Executable Pascal source.

FORMAL SHIFT:
<MONOLITHIC COMPILER-ORDERED CODE>
→ <LITERATE ESSAYISTIC WEB DOCUMENT>
→ [DUAL EXTRACTION: WEAVE vs TANGLE]
→ <SIMULTANEOUS SCHOLARLY MANUSCRIPT + EXECUTABLE BINARY>

SOURCE FORMALISM:
@<Macro name@> = code chunk
TANGLE: @<Root@> recursively expanded to Pascal stream.
WEAVE: Cross-referenced index and formatted prose.

OUR FORMALIZATION:
[OUR FORMALIZATION — NOT SOURCE SYNTAX]
Web_Doc = \\sum_i \\langle Prose_i, Code_i \\rangle
Tangle(Web_Doc) \\to Compiler_Stream
Weave(Web_Doc) \\to Reader_Stream

TENSION:
Modern software engineering abandoned Knuth’s monolithic WEB tools in favor of modular files and version control, finding that giant literary web files make collaborative multi-developer pull requests nearly impossible.

MISSING:
A mechanism to guarantee that the explanatory prose in WEAVE remains truthful when the underlying code in TANGLE is edited under production crisis.

BOUNDARY:
Literate programming works magnificently for foundational algorithms (TeX, METAFONT) authored by an individual master; it struggles in rapidly changing enterprise codebases.

CITATION TRAIL:
Dijkstra, Edsger W. (1968), "Go To Statement Considered Harmful"; Landin, P. J. (1966), "The Next 700 Programming Languages".

TEST:
Take a 500-line complex Python script. Compare debugging speed and defect detection when engineers review standard commented code versus when they review a Knuthian literate notebook.

PLATFORM:
[[game-03-program]]

LINKS:
[[game-03-program]]
[[game-04-plan]]
[[game-10-edit]]

BIBTEX:
@article{knuth1984literate,
  author    = {Donald E. Knuth},
  title     = {Literate Programming},
  journal   = {The Computer Journal},
  volume    = {27},
  number    = {2},
  pages     = {97--111},
  year      = {1984}
}""",

"""ZETTEL

ID: 20260907-DIJKSTRA-1968-GOTO-HARMFUL

TITLE:
Bridging the gap between static textual program and dynamic execution process requires structured hierarchical control.

SOURCE:
Dijkstra, Edsger W. — "Go To Statement Considered Harmful" — Communications of the ACM — 1968 — Vol. 11, No. 3, pp. 147–148.

PASSAGE:
[QUOTE]
"Our intellectual powers are rather geared to master the static relation than to track the dynamic process... We should do our utmost to shorten the conceptual gap between the static program in text and the dynamic process in time, to make the correspondence between the program (spread out in text space) and the process (spread out in time) as trivial as possible. The unbridled use of the go to statement has an immediate consequence: it becomes terribly hard to find a meaningful set of coordinates in which to describe the process progress."

RESEARCH OBJECT:
The epistemological gap between the spatial arrangement of program text and the temporal progression of its dynamic execution trace.

LOCAL MOVE:
Dijkstra launches structured programming by identifying the GOTO statement as an architectural disaster that destroys the programmer's ability to assert invariants across temporal execution states.

SOURCE TERMS:
go to statement; static program; dynamic process; textual space; temporal process; progress coordinates; structured programming.

WHAT BECAME STRANGE:
In conversational multi-agent LLM systems, the execution flow is entirely GOTO: tokens jump across context windows, subagents call tools, interruptions occur, and the conceptual gap between prompt text and dynamic inference trace is infinite.

QUESTION:
What are the "progress coordinates" of an autonomous LLM agent execution trace?

DEEPER QUESTION:
Can an agent prompt be formally structured if its internal execution jumps are determined by non-deterministic sampling across billions of probabilities?

MECHANISM:
Structured Control: Linear sequence, Conditionals (if-then-else), Repetitions (while-do).
Invariant Property: Textual coordinate index strictly matches temporal execution stack.
GOTO Defect: Textual position $L_1$ jumps to $L_2$ across non-nested scopes, obliterating the historical call stack.

FORMAL SHIFT:
<CHAOTIC GOTO SPAGHETTI CONTROL GRAPH>
→ <HIERARCHICAL NESTED BLOCK STRUCTURE>
→ [STATIC-DYNAMIC ISOMORPHISM]
→ <FORMALLY PROVABLE LOOP INVARIANTS>

SOURCE FORMALISM:
Process Progress Coordinate := \langle Stack\_Depth, Call\_Path, Loop\_Counter \rangle

OUR FORMALIZATION:
[OUR FORMALIZATION — NOT SOURCE SYNTAX]
Gap(Program, Process) = \oint |Coordinate_{text}(t) - Coordinate_{time}(t)| \, dt \to 0

TENSION:
Event-driven reactive programming (Node.js, actors) deliberately decouples static text from temporal callbacks, reviving Dijkstra's nightmare under the banner of asynchronous performance.

MISSING:
A proof that human thinking naturally operates in nested tree blocks rather than associative, jumpy associative graphs.

BOUNDARY:
Dijkstra’s prohibition applies to high-level programming; microcode, assembly language, and hardware silicon routing require jumps.

CITATION TRAIL:
Landin, P. J. (1966), "The Next 700 Programming Languages"; Knuth, Donald E. (1974), "Structured Programming with go to Statements".

TEST:
Compare debugging time on a recursive multi-agent workflow implemented as a structured deterministic state machine versus the same workflow implemented via dynamic tool-routing prompts.

PLATFORM:
[[game-03-program]]

LINKS:
[[game-01-instruction]]
[[game-03-program]]
[[game-04-plan]]

BIBTEX:
@article{dijkstra1968goto,
  author    = {Edsger W. Dijkstra},
  title     = {Go To Statement Considered Harmful},
  journal   = {Communications of the ACM},
  volume    = {11},
  number    = {3},
  pages     = {147--148},
  year      = {1968}
}""",

"""ZETTEL

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
Action(t) = f(State(t), Material_Affordance(t)) \\neq f(Plan(t))
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
}""",

"""ZETTEL

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
$P = \langle Subgoals, Commitments \rangle \quad \text{where } \forall a \in Actions, \text{Consistent}(a, P) = \text{True}$

OUR FORMALIZATION:
[OUR FORMALIZATION — NOT SOURCE SYNTAX]
Choice(t) = \arg\max_{a \in Filter(Actions, Plan_t)} Utility(a) \quad \text{where } Filter(a, P) = \{a \mid \text{Consistent}(a, P)\}

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
}""",

"""ZETTEL

ID: 20260907-AGRE-1987-DEICTIC-REPRESENTATION

TITLE:
Activity in dynamic environments relies on indexical-functional entities, not objective world models.

SOURCE:
Agre, Philip E. and Chapman, David — "Pengi: An Implementation of a Theory of Activity" — AAAI-87 Proceedings — 1987 — pp. 268–270.

PASSAGE:
[QUOTE]
"Traditional AI models assume that an agent maintains a complete, objective world model—a map of all objects and their absolute spatial coordinates. We argue that routine activity does not require this. An agent interacts with its environment through indexical-functional entities (which we call deictic representations). Instead of representing 'Bee-34 at coordinate (14, 22)', the agent represents 'the-bee-I-am-running-away-from' or 'the-block-I-am-pushing'. These representations are relational, indexical to the agent's immediate physical posture and current project."

RESEARCH OBJECT:
Deictic representation (indexical-functional entities) as the computational substrate for real-time reactivity without centralized search trees.

LOCAL MOVE:
Agre and Chapman implement Pengi (an arcade video game agent) using combinational logic circuits without memory or search, demonstrating that complex survival behavior emerges from indexical coupling to immediate threat vectors.

SOURCE TERMS:
activity; deictic representation; indexical-functional entity; Pengi; world model; routine activity; combinational logic.

WHAT BECAME STRANGE:
An agent can successfully navigate a hostile dynamic world without ever maintaining an internal representation of where objects go when they leave the immediate visual screen.

QUESTION:
Can an autonomous software agent operate on "the-error-message-blocking-my-current-compile" rather than maintaining an elaborate global knowledge graph of the entire operating system?

DEEPER QUESTION:
Why do modern LLM agent frameworks default to constructing massive vector database world models when indexical-functional focus is cheaper and less prone to hallucination?

MECHANISM:
Sensory Array -> Visual Markers focus on immediate entity -> Logic gates compute indexical relation: "the-projectile-flying-toward-me" -> Fire motor impulse directly without planning tree.

FORMAL SHIFT:
<OBJECTIVE THIRD-PERSON ONTOLOGY>
→ <FIRST-PERSON EMBODIED VISUAL MARKERS>
→ [RELATIONAL INDEXICAL MAPPING]
→ <IMMEDIATE REACTIVE BEHAVIORAL DISPATCH>

SOURCE FORMALISM:
Entity ::= the-[role]-[relationship to current activity]
e.g., the-ice-cube-I-am-kicking

OUR FORMALIZATION:
[OUR FORMALIZATION — NOT SOURCE SYNTAX]
Representation(x) = \\langle Functional_Role(x, Current_Goal), Indexical_Vector(x, Agent_Body) \\rangle
Action = Circuit(Representation(x_1), ..., Representation(x_n))

TENSION:
Classical planning (STRIPS) requires objective, persistent state to prove completeness and termination; Agre and Chapman prove that completeness is irrelevant when you are about to be stung by a bee.

MISSING:
Long-term strategic planning: Pengi cannot plan a multi-day corporate budget or design a cathedral; its intelligence is strictly local and reactive.

BOUNDARY:
Deictic representations fail when the agent must coordinate across temporal gaps where the referenced object is entirely absent from sensory perception.

CITATION TRAIL:
Suchman, Lucy A. (1987), Plans and Situated Actions; Brooks, Rodney (1991), "Intelligence without Representation".

TEST:
Build an automated web agent using two architectures: (1) an agent that converts the DOM into an exhaustive abstract JSON graph, and (2) an agent that inspects only "the-button-I-need-to-click-next". Compare token cost and task completion across 500 dynamic websites.

PLATFORM:
[[game-04-plan]]

LINKS:
[[game-04-plan]]
[[game-07-gesture]]
[[game-12-performance]]

BIBTEX:
@inproceedings{agre1987pengi,
  author    = {Philip E. Agre and David Chapman},
  title     = {Pengi: An Implementation of a Theory of Activity},
  booktitle = {Proceedings of the Sixth National Conference on Artificial Intelligence (AAAI-87)},
  pages     = {268--272},
  year      = {1987}
}""",

"""ZETTEL

ID: 20260907-BELKIN-1982-ASK-HYPOTHESIS

TITLE:
Information queries cannot specify their targets because retrieval is motivated by an Anomalous State of Knowledge.

SOURCE:
Belkin, Nicholas J.; Oddy, Robert N.; Brooks, Helen M. — "ASK for Information Retrieval: Part I. Background and Theory" — Journal of Documentation — 1982 — Vol. 38, No. 2, pp. 61–64.

PASSAGE:
[QUOTE]
"The user of an information retrieval system has an 'anomalous state of knowledge' (ASK) regarding a topic. That is, the user recognizes a gap or deficiency in their state of knowledge, but is in principle unable to specify precisely what information is needed to resolve that anomaly, because the user does not yet possess that knowledge. Therefore, to demand that a user formulate a precise query representing what they need is to demand an impossibility."

RESEARCH OBJECT:
The epistemic paradox of query construction: one must already know the structure of the answer in order to ask for it with precision.

LOCAL MOVE:
Belkin shifts the foundation of Information Retrieval from document-to-query exact term matching (the Cranfield paradigm) to a cognitive model of epistemic uncertainty and interactive resolution.

SOURCE TERMS:
Anomalous State of Knowledge; ASK hypothesis; cognitive viewpoint; information need; query formulation paradox; retrieval interaction.

WHAT BECAME STRANGE:
Search engines and vector databases are evaluated on how well they match user keywords, yet the user only searches because they do not have the vocabulary to describe what they are looking for.

QUESTION:
How can an embedding retrieval system index the absence of knowledge rather than the presence of tokens?

DEEPER QUESTION:
Does prompting an LLM solve the ASK paradox by letting the model hallucinate the missing vocabulary, or does it aggravate it by forcing the user to validate answers they lacked the knowledge to specify?

MECHANISM:
User Cognition: Internal Knowledge State K contains gap G.
Attempted Action: Formulate Query Q = Describe(G).
Inherent Failure: Describe(G) requires vocabulary V \\in G which user lacks.
Consequence: Query Q is an indexical symptom of the anomaly, not a specification of the solution.

FORMAL SHIFT:
<INTERNAL KNOWLEDGE DEFICIT>
→ <SYMPTOMATIC APPROXIMATE QUERY>
→ [CORPUS EMBEDDING OVERLAP]
→ <MISMATCHED RETRIEVAL OF SURFACES>

SOURCE FORMALISM:
NONE

OUR FORMALIZATION:
[OUR FORMALIZATION — NOT SOURCE SYNTAX]
Query(u) = Surface_Symptom(K_{user} \\setminus K_{target})
Match(Query(u), Doc) = Similarity(Surface_Symptom, Doc) \\neq Similarity(K_{target}, Doc)

TENSION:
Salton’s Vector Space Model treats queries and documents as mathematically dual vectors in the exact same term space, directly contradicting Belkin’s proof that queries are epistemically non-dual to the texts they seek.

MISSING:
The algorithmic transition mechanism: how an interactive dialogue system can iteratively map the topology of the anomaly without relying on the user’s defective search terms.

BOUNDARY:
Belkin’s ASK hypothesis does not apply to simple "known-item" lookups (e.g., searching for a phone number or a specific RFC document), where the user knows the exact identity of the target.

CITATION TRAIL:
Bush, Vannevar (1945), "As We May Think"; Robertson, S. E. and Spärck Jones, K. (1976), "Relevance Weighting of Search Terms".

TEST:
Compare retrieval success when users submit standard search queries versus when users submit unstructured descriptions of what they tried and where their reasoning broke down. Measure whether embedding models retrieve more relevant technical documentation from failure logs than from keyword queries.

PLATFORM:
[[game-05-query]]

LINKS:
[[game-05-query]]
[[game-06-probe]]
[[game-09-conversation]]

BIBTEX:
@article{belkin1982ask,
  author    = {Nicholas J. Belkin and Robert N. Oddy and Helen M. Brooks},
  title     = {{ASK} for Information Retrieval: Part {I}. Background and Theory},
  journal   = {Journal of Documentation},
  volume    = {38},
  number    = {2},
  pages     = {61--71},
  year      = {1982}
}""",

"""ZETTEL

ID: 20260907-SALTON-1975-VECTOR-SPACE-MODEL

TITLE:
Information retrieval spatializes textual semantics into orthogonal geometric dimensions of term frequency.

SOURCE:
Salton, Gerard; Wong, A.; Yang, C. S. — "A Vector Space Model for Automatic Indexing" — Communications of the ACM — 1975 — Vol. 18, No. 11, pp. 613–615.

PASSAGE:
[QUOTE]
"In a vector space model, both stored documents and user queries are represented by t-dimensional vectors of the form D = (d_1, d_2, ..., d_t), where each dimension corresponds to a distinct indexing term... The similarity between a document and a query is then computed as the cosine of the angle between their respective vectors in this multi-dimensional space. By assigning appropriate weights based on term frequency and inverse document frequency, the system ranks documents according to geometric proximity."

RESEARCH OBJECT:
The mathematical reduction of prose documents and queries into vectors in a high-dimensional Euclidean space arbitrated by cosine distance.

LOCAL MOVE:
Salton bypasses the messy philosophical problem of semantic meaning and syntax by treating texts as bags of weighted words whose relevance is calculated strictly as geometric alignment.

SOURCE TERMS:
vector space model; indexing term; term frequency; inverse document frequency; cosine similarity; term weight; retrieval ranking.

WHAT BECAME STRANGE:
Two documents that express opposite political claims ("The policy was a triumph" vs "The policy was a catastrophe") reside almost identically in vector space because they share 90% of their vocabulary, confusing topical co-occurrence with semantic agreement.

QUESTION:
When modern dense embeddings replace sparse TF-IDF vectors, does the cosine angle measure semantic truth or statistical style?

DEEPER QUESTION:
Why do we assume that human knowledge can be mapped onto a linear vector space where semantic relationships obey vector addition ($king - man + woman = queen$)?

MECHANISM:
1. Extract vocabulary of unique terms T = {t_1, ..., t_n}.
2. Calculate weight $w_{i,j} = \\text{TF}_{i,j} \\times \\log(N / \\text{DF}_i)$.
3. Represent Document $D_j$ and Query $Q$ as vectors $\\vec{D_j}, \\vec{Q}$.
4. Compute $\\text{Sim}(Q, D_j) = \\frac{\\vec{Q} \\cdot \\vec{D_j}}{\\|\\vec{Q}\\| \\|\\vec{D_j}\\|}$.
5. Sort documents descending by similarity score.

FORMAL SHIFT:
<NATURAL PROSE TEXTS>
→ <BAG OF WORDS FREQUENCY DISTRIBUTIONS>
→ [HIGH-DIMENSIONAL VECTOR PROJECTION]
→ <COSINE DISTANCE RANKING>

SOURCE FORMALISM:
$w_{ik} = \\frac{tf_{ik} \\cdot \\log(N/n_k)}{\\sqrt{\\sum_{j=1}^t (tf_{ij} \\cdot \\log(N/n_j))^2}}$

OUR FORMALIZATION:
[OUR FORMALIZATION — NOT SOURCE SYNTAX]
Relevance(Q, D) = \\cos(\\theta) = \\frac{\\langle \\phi(Q), \\phi(D) \\rangle}{\\|\\phi(Q)\\| \\|\\phi(D)\\|}

TENSION:
Belkin’s ASK hypothesis demonstrates that queries represent a cognitive absence, making them epistemically non-dual to the documents that contain the presence of the knowledge.

MISSING:
Syntactic structure, negation, and temporal ordering: "dog bites man" and "man bites dog" have a cosine similarity of 1.0 in Salton's original model.

BOUNDARY:
The model assumes independence of indexing terms (orthogonal axes), an assumption that is mathematically false for natural human languages where synonyms are deeply correlated.

CITATION TRAIL:
Shannon, C. E. (1948), "A Mathematical Theory of Communication"; Robertson, S. E. and Spärck Jones, K. (1976), "Relevance Weighting of Search Terms".

TEST:
Construct pairs of sentences with identical vocabularies but inverted truth values ("Drug X cures disease Y" vs "Drug X causes disease Y"). Test retrieval precision across sparse BM25 vs dense modern embeddings.

PLATFORM:
[[game-05-query]]

LINKS:
[[game-03-program]]
[[game-05-query]]
[[game-10-edit]]

BIBTEX:
@article{salton1975vector,
  author    = {Gerard Salton and A. Wong and C. S. Yang},
  title     = {A Vector Space Model for Automatic Indexing},
  journal   = {Communications of the ACM},
  volume    = {18},
  number    = {11},
  pages     = {613--620},
  year      = {1975}
}""",

"""ZETTEL

ID: 20260907-GAVER-1999-CULTURAL-PROBES

TITLE:
Probes operate by provoking idiosyncratic responses through deliberate ambiguity and refusal of requirements.

SOURCE:
Gaver, Bill; Dunne, Tony; Pacenti, Elena — "Cultural Probes" — interactions — 1999 — Vol. 6, No. 1, pp. 22–24.

PASSAGE:
[QUOTE]
"We developed Cultural Probes not to gather clear, comprehensive requirements for design, but to provoke inspirational responses from elderly people in their homes... The packs were designed to be eccentric, playful, and even mysterious. We avoided any impression that we were running a formal scientific test or market survey. Our goal was not to understand the participants objectively, but to establish an intimate, open, and provocative dialogue that would disrupt our own preconceptions."

RESEARCH OBJECT:
The method of non-convergent, subversive instrumentation designed to yield inspirational friction rather than verifiable system specifications.

LOCAL MOVE:
The authors reject the engineering ethos of usability and ethnographic objectivity, borrowing strategies from the Situationist International (dérive, détournement) to inject aesthetic provocation into human-computer interface research.

SOURCE TERMS:
cultural probes; inspirational responses; ambiguity; provocation; Situationist; dérive; subversion of requirements.

WHAT BECAME STRANGE:
An inquiry tool whose scientific excellence is measured by its refusal to produce reliable, repeatable, or verifiable data, intentionally maximizing the variance of the respondent’s output.

QUESTION:
What is the difference between a probe that perturbs a system to reveal its boundary conditions and a test that verifies compliance?

DEEPER QUESTION:
Can an AI system be prompted with Cultural Probes to reveal its latent ideological topology, or do RLHF safety layers automatically sanitize all provocative interventions back into corporate consensus?

MECHANISM:
Traditional Test: Input X -> Verify Output Y conforms to Spec S.
Cultural Probe: Provocation P (ambiguous, incomplete, emotionally charged) -> Subjective Friction R -> Designer Inverts Internal Schema D.

FORMAL SHIFT:
<STANDARDIZED SURVEY PROTOCOL>
→ <POETIC MATERIAL INTERVENTION>
→ [PROVOCATIVE FRICTION]
→ <UNANTICIPATED METAPHORIC YIELD>

SOURCE FORMALISM:
NONE

OUR FORMALIZATION:
[OUR FORMALIZATION — NOT SOURCE SYNTAX]
Probe(S) = Perturb(S, \\omega) \\quad \\text{where } \\omega \\notin \\text{Domain}(Training\\_Distribution)
Yield = \\nabla_{\\omega} Behavior(S)

TENSION:
Gaver (2004) later wrote "A Failure to Reconcile," attacking computer science researchers who attempted to "rationalize" cultural probes into qualitative data collection methods, arguing they had murdered the core mechanism of uncertainty.

MISSING:
A metric for determining when a probe has failed by producing pure noise versus when it has succeeded by producing creative defamiliarization.

BOUNDARY:
Cultural probes cannot be used to debug mission-critical or safety-critical engineering systems where predictability and invariant adherence are non-negotiable.

CITATION TRAIL:
Garfinkel, Harold (1967), Studies in Ethnomethodology; Sengers, Phoebe and Gaver, Bill (2006), "Staying Open to Interpretation".

TEST:
Submit 100 highly ambiguous, poetic, unanswerable ethical vignettes to an LLM. Track whether the model refuses, flattens into boilerplate consensus ("It is important to consider multiple viewpoints..."), or accepts the poetic terms of the probe.

PLATFORM:
[[game-06-probe]]

LINKS:
[[game-05-query]]
[[game-06-probe]]
[[game-12-performance]]

BIBTEX:
@article{gaver1999cultural,
  author    = {Bill Gaver and Tony Dunne and Elena Pacenti},
  title     = {Cultural Probes},
  journal   = {interactions},
  volume    = {6},
  number    = {1},
  pages     = {21--29},
  year      = {1999}
}""",

"""ZETTEL

ID: 20260907-GARFINKEL-1967-BREACHING-EXPERIMENTS

TITLE:
Social background expectancies become visible only when deliberately breached through procedural disruption.

SOURCE:
Garfinkel, Harold — Studies in Ethnomethodology — 1967 — Chapter 2: "Studies of the Routine Grounds of Everyday Activities", pp. 36–42.

PASSAGE:
[QUOTE]
"The shared background expectancies of everyday life are 'seen but unnoticed.' Because they are taken for granted, their presence cannot be uncovered by asking people to describe them... To expose them, one must produce an interactional breach: an intentional departure from the recognized scene that disrupts the expected continuity of events. When students were instructed to act as boarders in their own homes, or to demand that friends clarify ordinary conversational remarks ('What do you mean by flat tire?'), the resulting confusion, anger, and moral indignation revealed the unseen normative structures upholding ordinary sense-making."

RESEARCH OBJECT:
The method of interactional perturbation (breaching) as a forensic instrument for exposing unstated ontological assumptions.

LOCAL MOVE:
Garfinkel proves that the social order is not an internalized set of abstract laws (Parsons), but a continuous, fragile practical accomplishment maintained by participants who react morally when background expectancies are violated.

SOURCE TERMS:
seen but unnoticed; background expectancies; breaching experiment; practical accomplishment; common sense; moral indignation; ethnomethodology.

WHAT BECAME STRANGE:
Polite everyday interaction requires actors to actively ignore conversational ambiguities and fill in gaps silently; demanding absolute precision from a conversational partner is experienced not as rigor, but as an insane hostile attack.

QUESTION:
When an AI system takes human colloquial requests literally, is it malfunctioning, or is it running an accidental Garfinkelian breaching experiment?

DEEPER QUESTION:
Why do LLMs produce deep uncanny valley reactions when they adhere too strictly to formal logic in conversational domains?

MECHANISM:
1. Identify social interaction invariant I (e.g., "Assume we share basic common ground").
2. Agent executes behavior B that violates I (demands literal definitions of trivial words).
3. Interlocutor experiences epistemic disorientation -> attempts repair -> repair fails.
4. Interlocutor displays moral indignation -> reveals that the rule was an ethical obligation, not a logical preference.

FORMAL SHIFT:
<TRANSPARENT COMMON SENSE INTERACTION>
→ <DELIBERATE PROCEDURAL BREACH>
→ [BREAKDOWN OF REPAIR MECHANISMS]
→ <EXPOSURE OF INVISIBLE NORMATIVE FOUNDATIONS>

SOURCE FORMALISM:
NONE

OUR FORMALIZATION:
[OUR FORMALIZATION — NOT SOURCE SYNTAX]
Expectancy(Scene) = { e_i \\mid P(e_i) \\to 1 \\land \\text{Cost}(Explain(e_i)) \\to \\infty }
Breach(Scene) = { \\text{Violate}(e_k) \\mid \\text{Observable}(Indignation) \\implies \\text{Invariant}(e_k) }

TENSION:
Sociological functionalism views social norms as smooth, stable macro-institutions; Garfinkel shows that norms are micro-repair jobs performed every thirty seconds on the brink of panic.

MISSING:
A threshold of ethical safety: Garfinkel’s students reported severe emotional trauma and damaged family relationships during the experiments.

BOUNDARY:
Breaching experiments reveal the rules of human social coordination; they cannot be run on a deterministic compiler, which experiences no moral outrage when an invariant is broken.

CITATION TRAIL:
Austin, J. L. (1962), How to Do Things with Words; Sacks, Harvey (1974), "A Simplest Systematics for the Organization of Turn-Taking".

TEST:
Program a customer service bot to relentlessly demand that users define ordinary words ("What do you mean by 'broken'?", "What do you mean by 'soon'?"). Measure the exact time-to-rage compared to a bot that silently fails.

PLATFORM:
[[game-06-probe]]

LINKS:
[[game-01-instruction]]
[[game-06-probe]]
[[game-09-conversation]]

BIBTEX:
@book{garfinkel1967studies,
  author    = {Harold Garfinkel},
  title     = {Studies in Ethnomethodology},
  year      = {1967},
  publisher = {Prentice-Hall},
  address   = {Englewood Cliffs, NJ}
}""",

"""ZETTEL

ID: 20260907-KENDON-2004-GESTURE-UTTERANCE

TITLE:
Gesture is not auxiliary to speech but a co-constitutive kinesic component of the utterance.

SOURCE:
Kendon, Adam — Gesture: Visible Action as Utterance — 2004 — Chapter 1, pp. 7–9; Chapter 6, pp. 110–112.

PASSAGE:
[QUOTE]
"Gesture is not an accompaniment or helpmate to speech, but is itself visible action employed as utterance... Speech and gesture are not two separate communication systems that happen to run in parallel; they are two aspects of a single, integrated process of utterance production, drawing upon a common underlying intention but expressing it through different physical and spatial modalities."

RESEARCH OBJECT:
The bodily, spatial, and deictic machinery that anchors symbolic linguistic tokens to physical copresent reality.

LOCAL MOVE:
Kendon challenges the logocentric bias of 20th-century linguistics, proving through micro-kinesic frame analysis that bodily action (preparation, stroke, recovery) is synchronized with phonological stress and syntax at the millisecond scale.

SOURCE TERMS:
visible action; utterance; kinesic medium; gesture phrase; stroke; deictic gesture; indexical anchoring; exophoric reference.

WHAT BECAME STRANGE:
Large language models operate in complete isolation from the kinesic medium, manipulating purely symbolic tokens without the ability to point, gaze, orient the torso, or physically anchor reference in shared visual space.

QUESTION:
When an AI interacts through text alone, how does it establish exophoric reference to an object that exists outside the linguistic context window?

DEEPER QUESTION:
Can deictic pointing ("look at this") ever function without a physical body inhabiting the same spatial coordinates as the interlocutor?

MECHANISM:
Utterance Generation: Single communicative intention I split simultaneously into:
- Acoustic Channel: Lexical-syntactic packaging -> Phonemes.
- Kinesic Channel: Spatial-analog packaging -> Gesture Stroke.
Both must arrive at the temporal apex (synchronization of stroke with focal pitch accent) for the speech act to be felicitously perceived.

FORMAL SHIFT:
<COMMUNICATIVE INTENTION>
→ <DUAL MODALITY PACKAGING: DISCRETE SYMBOLS + ANALOG SPATIAL KINEMATICS>
→ [TEMPORAL STROKE SYNCHRONIZATION]
→ <ANCHORED DEICTIC COGNITION>

SOURCE FORMALISM:
Gesture Unit ::= Rest -> Preparation -> [Stroke] -> (Hold) -> Recovery -> Rest

OUR FORMALIZATION:
[OUR FORMALIZATION — NOT SOURCE SYNTAX]
Utterance = \\langle Token(t), Kinesic\\_Vector(t), Spatial\\_Coordinate(t) \\rangle
where \\text{Sync}(Token_{stress}, Kinesic_{stroke}) \\le \\Delta t_{threshold}

TENSION:
McNeill (1992) treats gesture as a direct window into individual mental imagery; Kendon insists gesture is interactionally organized and shaped in real-time for the co-present recipient.

MISSING:
A mathematical bridge between continuous spatial trajectories (pointing, tracing boundaries) and the discrete categorical tokens of formal linguistics.

BOUNDARY:
Kendon’s observations are strictly grounded in human embodied copresence; text-based chat interfaces eliminate the entire physical medium that makes the stroke-stress synchronization possible.

CITATION TRAIL:
McNeill, David (1992), Hand and Mind: What Gestures Reveal about Thought; Clark, Herbert H. (1996), Using Language.

TEST:
Compare multimodal grounding in vision-language models when spatial pointing is represented as discrete pixel bounding box coordinates versus when it is represented as a simulated continuous velocity vector.

PLATFORM:
[[game-07-gesture]]

LINKS:
[[game-01-instruction]]
[[game-07-gesture]]
[[game-09-conversation]]

BIBTEX:
@book{kendon2004gesture,
  author    = {Adam Kendon},
  title     = {Gesture: Visible Action as Utterance},
  year      = {2004},
  publisher = {Cambridge University Press},
  address   = {Cambridge}
}""",

"""ZETTEL

ID: 20260907-MCNEILL-1992-GROWTH-POINT-GESTURE

TITLE:
Thought originates in a 'growth point' where dialectical tension between holistic imagery and linear syntax unfolds.

SOURCE:
McNeill, David — Hand and Mind: What Gestures Reveal about Thought — 1992 — Chapter 8: "The Growth Point", pp. 218–224.

PASSAGE:
[QUOTE]
"Gestures and speech are an integrated system. The core of this system is what I call the 'growth point' (GP)—the minimal psychological unit of thought in which imagery and linguistic-categorical form exist in dialectical tension. Imagery is holistic, synthetic, and non-combinatorial; speech is segmented, analytic, and combinatorial. A thought is not a pre-formed proposition that is subsequently dressed in words and gestures; it is an active conflict between an analog image and a discrete grammatical structure that resolves itself through the utterance."

RESEARCH OBJECT:
The "growth point" as the psycho-linguistic seed uniting non-decomposable spatial imagery with serial symbolic syntax.

LOCAL MOVE:
McNeill disproves the computational information-processing model (which views thought as Mentalese propositions translated into grammar) by proving that gesture stroke synchronization reveals thoughts beginning as irreducible imagistic seeds.

SOURCE TERMS:
growth point; imagery; linguistic-categorical; dialectic; catchment; iconic gesture; metaphoric gesture; holistic; combinatorial.

WHAT BECAME STRANGE:
Human language is not a serial stream of discrete symbols; it is a violent compromise between an instantaneous two-dimensional visual image and the biological constraint that the vocal cords can only emit one sound at a time.

QUESTION:
Does a transformer architecture possess a growth point when processing multimodal tokens, or does it merely serialize image patches into the same linear syntax as words?

DEEPER QUESTION:
Can an AI system think holistically if its attention mechanism operates exclusively across sequential token positions?

MECHANISM:
1. Cognitive Seed: Growth Point GP = \langle Image, Category \rangle generated.
2. Dialectical Friction: Image cannot be spoken serially; Category cannot represent spatial wholeness.
3. Bifurcation of Motor Channels:
   - Hand executes holistic Image as analog Stroke in gesture space.
   - Tongue unfolds Category as sequential syntactic tree.
4. Unification: Hand stroke hits physical apex at exact moment vocal tract sounds focal pitch accent.

FORMAL SHIFT:
<HOLISTIC SPATIAL MENTAL IMAGE>
→ <GROWTH POINT DIALECTIC>
→ [PARALLEL MOTOR CHANNEL SPLIT]
→ <SYNCHRONIZED KINESIC-ACOUSTIC UTTERANCE>

SOURCE FORMALISM:
GP = [ Image \\iff Category ]

OUR FORMALIZATION:
[OUR FORMALIZATION — NOT SOURCE SYNTAX]
Thought = \\text{Bifurcate}(GP) = \\langle Analog\\_Space(Image), Discrete\\_Tree(Category) \\rangle

TENSION:
Chomsky’s Generative Grammar treats language as an autonomous, modular, purely syntactic computational faculty; McNeill proves syntax cannot function without immediate coupling to non-syntactic imagery.

MISSING:
Neurological tracing: McNeill's growth point is an inferential cognitive construct, not an observable localized brain region.

BOUNDARY:
McNeill’s data relies on narrations of cartoon animations (Tweety and Sylvester); it is less clear how growth points operate during abstract logical proofs.

CITATION TRAIL:
Kendon, Adam (2004), Gesture: Visible Action as Utterance; Vygotsky, L. S. (1934), Thought and Language.

TEST:
Track multimodal model accuracy on spatial reasoning benchmarks when the model is forced to output bounding boxes before text generation versus when it outputs text before bounding boxes.

PLATFORM:
[[game-07-gesture]]

LINKS:
[[game-02-score]]
[[game-07-gesture]]
[[game-12-performance]]

BIBTEX:
@book{mcneill1992hand,
  author    = {David McNeill},
  title     = {Hand and Mind: What Gestures Reveal about Thought},
  year      = {1992},
  publisher = {University of Chicago Press},
  address   = {Chicago}
}""",

"""ZETTEL

ID: 20260907-BAXANDALL-1972-COMMISSION-CONTRACT

TITLE:
The Quattrocento art contract shifted value from material ostentation to specified individual skill.

SOURCE:
Baxandall, Michael — Painting and Experience in Fifteenth-Century Italy — 1972 — Chapter 1: "Conditions of Trade", pp. 11–17.

PASSAGE:
[QUOTE]
"In the fifteenth-century art contract, the money changed its role. In the earlier part of the century, the client's money was spent primarily on buying expensive materials—gold leaf and genuine ultramarine made from powdered lapis lazuli... By the end of the century, the contracts show a different balance: the client spends less on raw materials and more on the painter's individual skill. The insistence is no longer 'use good gold,' but 'paint the figures with your own hand' (di mano propria)."

RESEARCH OBJECT:
The institutional and economic structure of the commission contract that mediates between patron demand and producer execution.

LOCAL MOVE:
Baxandall conducts a materialist economic reading of surviving Quattrocento notary contracts, demonstrating that the emergence of modern "artistic genius" was driven by commercial clients seeking social distinction through purchasing human labor time rather than hoarded bullion.

SOURCE TERMS:
commission; client; painter; ultramarine; gold leaf; skill; di mano propria; contract; period eye.

WHAT BECAME STRANGE:
In generative AI, we have experienced a violent re-inversion: client expenditure on human skill (prompt engineer labor) is being discarded in favor of raw computational capital (GPU hours, cluster scale, token expenditure)—a return to buying "gold and ultramarine."

QUESTION:
What is the structural contract between a prompt author (patron) and a generative model (contractor)?

DEEPER QUESTION:
Why do prompt engineering demand "di mano propria" guarantees (system prompts demanding specific stylistic signatures) while simultaneously delegating the actual execution to a blind mechanical apprentice?

MECHANISM:
Phase 1 Contract: Value = Quantity(Gold) + Quantity(Ultramarine) + Basic Guild Day-Rate.
Phase 2 Contract: Value = Base Pigment + Penalty(Subcontracting) + Premium(Personal Hand of Master).
Client inspection verifies brushwork density rather than chemical purity of blue pigment.

FORMAL SHIFT:
<PATRON CAPITAL ACCUMULATION>
→ <LEGAL NOTARIZED BRIEF>
→ [DIVISION OF LABOR: MASTER vs BOTTEGA APPRENTICE]
→ <HYBRID MATERIAL-AESTHETIC ARTIFACT>

SOURCE FORMALISM:
NONE

OUR FORMALIZATION:
[OUR FORMALIZATION — NOT SOURCE SYNTAX]
Contract(Client, Producer) = {
  Deliverable: D,
  Invariants: { Pigment \\ge Grade_A, Attribution == Master\\_Only },
  Penalty_Clause: \\text{If Subcontracted to Apprentice then Pay} = 0.5 \\cdot Base
}

TENSION:
Howard Becker’s Art Worlds (1982) argues that artistic production is always collective and distributed across support personnel; Baxandall demonstrates that the legal contract artificially consolidates this collective labor into a single accountable name.

MISSING:
The client's cognitive feedback loop: how did fifteenth-century patrons evaluate whether the figures were truly painted "di mano propria" or quietly assigned to studio assistants?

BOUNDARY:
Baxandall’s evidence is drawn from merchant-class contracts in republican Florence and princely Ferrara; it cannot be uncritically generalized to non-commercial religious folk art or modern industrial design.

CITATION TRAIL:
Becker, Howard S. (1982), Art Worlds; Bourdieu, Pierre (1993), The Field of Cultural Production.

TEST:
Analyze 1,000 prompt marketplaces (e.g., PromptBase) to test whether economic price correlates with the complexity of the prompt's logical instructions (skill) or with the cost-per-token of the foundation model running it (material compute).

PLATFORM:
[[game-08-commission]]

LINKS:
[[game-01-instruction]]
[[game-08-commission]]
[[game-12-performance]]

BIBTEX:
@book{baxandall1972painting,
  author    = {Michael Baxandall},
  title     = {Painting and Experience in Fifteenth-Century Italy: A Primer in the Social History of Pictorial Style},
  year      = {1972},
  publisher = {Oxford University Press},
  address   = {Oxford}
}""",

"""ZETTEL

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
Artifact = \\text{Aggregate}(Author, \\{Support\\_Personnel_k\\}) \\circ \\text{Conventions}_{shared}

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
}""",

"""ZETTEL

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
}""",

"""ZETTEL

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
Constraint: Both parties minimize total joint effort: Effort(A) + Effort(B) = \\min.

FORMAL SHIFT:
<UNILATERAL STATEMENT PRODUCTION>
→ <PRESENTATION + ACCEPTANCE CYCLE>
→ [COLLABORATIVE GROUNDING ITERATION]
→ <UPDATED MUTUAL COMMON GROUND ACCUMULATOR>

SOURCE FORMALISM:
NONE

OUR FORMALIZATION:
[OUR FORMALIZATION — NOT SOURCE SYNTAX]
Common_Ground_{t+1} = Common_Ground_t \\cup \\{ U_t \\mid \\text{Evidence}(B, U_t) \\ge \\tau_{purpose} \\}

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
}""",

"""ZETTEL

ID: 20260907-MCGANN-1983-SOCIAL-TEXT-EDIT

TITLE:
Textual editing cannot recover autonomous authorial intention because texts are irreducibly social productions.

SOURCE:
McGann, Jerome J. — A Critique of Modern Textual Criticism — 1983 — Chapter 3: "The Social and Institutional Context", pp. 43–48.

PASSAGE:
[QUOTE]
"The concept of 'final authorial intention' is a romantic myth that distorts the actual history of texts... A literary work is not an autonomous mental creation that exists in a pure, ideal state prior to its material manifestation. It is a social product, generated through an interactive process involving authors, editors, publishers, compositors, printers, and readers. Every material version of a text carries its own distinct historical and social authority, and to strip away these historical collaborations in search of an uncorrupted original is to destroy the work's mode of existence."

RESEARCH OBJECT:
The rejection of the Greg-Bowers eclectic text in favor of the material "social text" bearing the marks of multiple historical revisions and institutional hands.

LOCAL MOVE:
McGann attacks the foundational doctrine of modern Anglo-American textual scholarship (Bowers, Tanselle), proving that authors actively relied on the institutional apparatus of printing houses to complete the linguistic and communicative identity of their writing.

SOURCE TERMS:
final authorial intention; social text; eclectic text; Greg-Bowers tradition; copy-text; material transmission; compositor; collaboration.

WHAT BECAME STRANGE:
When editing text, we assume there is an original ground-truth intent that the edit restores, yet every editorial intervention is itself another social layer altering the historical reception and trajectory of the symbol.

QUESTION:
When a human edits an LLM's output (or an LLM edits a human draft), whose intention is being preserved, constructed, or erased?

DEEPER QUESTION:
Can a text produced by an autoregressive neural model possess an "authorial intention" to which an editor could ever be faithful?

MECHANISM:
Greg-Bowers Model: Ideal Author Intent -> Material Historical Text (Corrupted by Printers) -> Editor Removes Corruptions -> Pure Eclectic Text.
McGann Model: Author Draft -> Institutional Socialization (Publishers, Printers, Readers) -> Multiple Legitimate Historical Material Manifestations.

FORMAL SHIFT:
<ROMANTIC IDEAL INTENTION>
→ <MATERIAL HISTORICAL PRINT PRODUCTION>
→ [EDITORIAL INTERFERENCE / ACCUMULATION]
→ <HISTORICALLY CONTINGENT SOCIAL TEXT>

SOURCE FORMALISM:
NONE

OUR FORMALIZATION:
[OUR FORMALIZATION — NOT SOURCE SYNTAX]
Text_{published} = Author(Intent) \\otimes Editor(Rules) \\otimes Compositor(Physical\\_Constraints)
where \\otimes \\text{ is non-invertible, preventing recovery of pure } Author(Intent).

TENSION:
Fredson Bowers (1949) argues that an editor must strip away non-authorial accidentals (spelling, punctuation) to recover the pure mental design; McGann proves accidentals carry essential communicative codes.

MISSING:
A systematic calculus for contemporary digital texts where versions are continuous git commits rather than distinct physical letterpress printings.

BOUNDARY:
McGann’s theory is designed for literary and historical print cultures; technical documentation and mathematical tables demand deterministic accuracy over historical social transmission.

CITATION TRAIL:
Bowers, Fredson (1949), Principles of Bibliographical Description; Bryant, John (2002), The Fluid Text: A Theory of Revision and Editing for Book and Screen.

TEST:
Take a single prompt output and subject it to three sequential passes by three different editing systems (Grammarly, a senior editor, and an LLM). Track whether stylistic metrics diverge further from the original prompt author with each iteration.

PLATFORM:
[[game-10-edit]]

LINKS:
[[game-03-program]]
[[game-10-edit]]
[[game-11-constraint]]

BIBTEX:
@book{mcgann1983critique,
  author    = {Jerome J. McGann},
  title     = {A Critique of Modern Textual Criticism},
  year      = {1983},
  publisher = {University of Chicago Press},
  address   = {Chicago}
}""",

"""ZETTEL

ID: 20260907-BRYANT-2002-FLUID-TEXT-REVISION

TITLE:
A text is not a static monument but an ongoing fluid stream of material revisions revealing cultural struggle.

SOURCE:
Bryant, John — The Fluid Text: A Theory of Revision and Editing for Book and Screen — 2002 — Chapter 1: "The Fluid Text", pp. 1–3, 8–11.

PASSAGE:
[QUOTE]
"A text is not an artifact; it is an event. It is a kinetic process of editing, revising, and adaptation that never achieves static completion... A fluid text is any work that exists in more than one version. The differences between versions—the revision sites—are not evidence of error or hesitation; they are the physical traces of an author or culture wrestling with its own thoughts, anxieties, and political pressures. To read a fluid text is to read the movement of consciousness across time."

RESEARCH OBJECT:
The "revision site" as the primary unit of critical analysis rather than the finished, frozen publication.

LOCAL MOVE:
Bryant bridges bibliographical editing and digital media theory, proposing that literary works are fundamentally unstable flows of variance across manuscripts, galley proofs, censored editions, adaptations, and screenplays.

SOURCE TERMS:
fluid text; revision site; event; material trace; versioning; adaptation; cultural struggle; editorial apparatus.

WHAT BECAME STRANGE:
We evaluate generative AI systems on their final output string, ignoring the fact that prompt engineering is fundamentally a fluid textual revision cycle where the human editor modulates parameters across 50 discarded variations.

QUESTION:
Where is the boundary of the text when a prompt is edited across 100 conversational iterations with a model?

DEEPER QUESTION:
Does the infinite plasticity of digital text liberate authorial revision or dissolve the resistance required to produce lasting literary form?

MECHANISM:
1. Version $V_0$ produced by Author at time $t_0$.
2. Internal/External friction induces Revision Site $R_k$.
3. Transformation Operator $T(V_k) \\to V_{k+1}$ applied.
4. The work $W$ is not $\\max(V_k)$, but the entire genealogical vector $\\vec{W} = [V_0, V_1, ..., V_n]$ and the differential calculus between them $\\Delta(V_k, V_{k+1})$.

FORMAL SHIFT:
<STATIC IDEAL MONUMENT>
→ <FLOW OF HISTORICAL REVISION SITES>
→ [DIFFERENTIAL TEXTUAL CALCULUS]
→ <GENEALOGICAL VECTOR OF UNSTABLE EDITIONS>

SOURCE FORMALISM:
NONE

OUR FORMALIZATION:
[OUR FORMALIZATION — NOT SOURCE SYNTAX]
Work = \\int_{t_0}^{t_n} \\frac{\\partial Text}{\\partial t} \\, dt = \\bigcup_{k=0}^n V_k

TENSION:
Goodman (1968) insists an allographic work is preserved strictly by adherence to a discrete notational score; Bryant proves that in real manuscript history, the score itself is in continuous fluid migration.

MISSING:
A formal computational data structure that captures the psychological and political motivations behind a revision alongside the literal textual diff.

BOUNDARY:
Bryant’s fluid text applies to authorial and cultural works; executable cryptographic smart contracts must be completely immutable, where a revision site is fatal bug exploitation.

CITATION TRAIL:
McGann, Jerome J. (1983), A Critique of Modern Textual Criticism; Genette, Gérard (1982), Palimpsests.

TEST:
Analyze git commit logs for 100 open-source software libraries. Identify whether the highest density of comment discussions occurs at revision sites involving semantic interface changes versus internal implementation optimizations.

PLATFORM:
[[game-10-edit]]

LINKS:
[[game-03-program]]
[[game-10-edit]]
[[game-11-constraint]]

BIBTEX:
@book{bryant2002fluid,
  author    = {John Bryant},
  title     = {The Fluid Text: A Theory of Revision and Editing for Book and Screen},
  year      = {2002},
  publisher = {University of Michigan Press},
  address   = {Ann Arbor}
}""",

"""ZETTEL

ID: 20260907-QUENEAU-1960-OULIPO-CLINAMEN

TITLE:
Arbitrary formal constraint forces creative escape from cognitive cliché, with the clinamen preserving freedom.

SOURCE:
Queneau, Raymond and Le Lionnais, François — Oulipo: A Primer of Potential Literature — 1981 (orig. 1960–1973) — "First Manifesto", pp. 26–28; "The Clinamen", pp. 197–198.

PASSAGE:
[QUOTE]
"Oulipians are rats who construct the labyrinth from which they propose to escape. What is the goal of our work? To invent new structures, forms, and constraints that enable the creation of potential literature... But strict adherence to a mechanical rule risks collapsing into sterile automation. For this reason, the Oulipo recognizes the clinamen: a deliberate, conscious deviation from the chosen constraint, an intentional error that prevents the rule from extinguishing the freedom of the writer."

RESEARCH OBJECT:
The dual mechanism of rigid formal limitation as generative catalyst combined with deliberate, calculated violation (clinamen) as human agency safeguard.

LOCAL MOVE:
Queneau and Le Lionnais break with the Surrealists' reliance on unconscious chance and automatic writing, insisting that true aesthetic invention occurs only when the conscious intellect battles against difficult, mathematically formal rules.

SOURCE TERMS:
potential literature; Oulipo; constraint; labyrinth; rats; clinamen; lipogram; combinatorial literature; mechanical automation.

WHAT BECAME STRANGE:
An author writes a 300-page novel without using the letter "e" (Perec's La Disparition) not to impoverish expression, but to force the vocabulary into bizarre, unexpected lexical regions that habit and semantic fluency would never have visited.

QUESTION:
Does prompt constraint (e.g., "Do not use the letter S", "Format strictly as a valid JSON matrix") expand or contract the cognitive latent space explored by an LLM?

DEEPER QUESTION:
Can an algorithmic system generate its own clinamen, or does a machine-generated deviation from a constraint register only as an execution error?

MECHANISM:
1. Impose Invariant Rule C on vocabulary V: Subspace V' = V \\setminus C.
2. Generator cannot use default high-probability linguistic paths.
3. Generator must search low-probability combinatorial permutations to achieve semantic goals.
4. Introduce Clinamen: Deliberately break rule C at step k to inject surprise and preserve expressive nuance.

FORMAL SHIFT:
<EXPANSIVE OPEN POSSIBILITY SPACE>
→ <SEVERE ARBITRARY FORMAL SUBSET>
→ [COMBINATORIAL SEARCH FOR COMPLIANCE]
→ <NOVEL LATENT REGION UNLOCKED BY FRICTION>

SOURCE FORMALISM:
NONE

OUR FORMALIZATION:
[OUR FORMALIZATION — NOT SOURCE SYNTAX]
Generation = \\arg\\max_{t} P(t) \\quad \\text{subject to } C(t) = 1
\\text{Clinamen at index } k: C(t_k) = 0 \\quad \\text{where } \\text{Entropy}(t_k) > \\tau

TENSION:
Elster (1979) in Ulysses and the Sirens argues that rational constraints are tools for self-binding against destructive passions; Oulipo treats constraints as ludic engines designed to generate playful instability.

MISSING:
A formal boundary defining when a clinamen is an intentional artistic stroke versus when it is mere technical incompetence or inability to solve the puzzle.

BOUNDARY:
Oulipian constraints require an agent capable of feeling the friction of the rule; a machine that effortlessly generates lipograms through brute-force beam search experiences no creative tension.

CITATION TRAIL:
Perec, Georges (1969), La Disparition; Elster, Jon (1979), Ulysses and the Sirens: Studies in Rationality and Irrationality.

TEST:
Task an LLM with generating a 500-word philosophical essay under three conditions: (1) no constraints, (2) strict lipogram (no letter 'e'), and (3) lipogram with exactly one clinamen. Evaluate which output yields the highest rate of novel semantic metaphors.

PLATFORM:
[[game-11-constraint]]

LINKS:
[[game-02-score]]
[[game-03-program]]
[[game-11-constraint]]

BIBTEX:
@book{mottex1986oulipo,
  author    = {Warren F. Motte},
  title     = {Oulipo: A Primer of Potential Literature},
  year      = {1986},
  publisher = {University of Nebraska Press},
  address   = {Lincoln}
}""",

"""ZETTEL

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
Action at $t_0$: Impose irreversible constraint $C$ such that Choice Space $S_{t_1} = S_{raw} \\setminus \\{B\\}$.
At $t_1$: Agent desires $B$, but $B$ is physically/computationally unavailable. Outcome: $A$ realized.

FORMAL SHIFT:
<UNCONSTRAINED MAXIMIZATION TRAP>
→ <ANTICIPATED TEMPORAL PREFERENCE REVERSAL>
→ [IRREVERSIBLE PRECOMMITMENT ACTUATION]
→ <SURVIVAL GUARANTEED BY ARTIFICIAL LIMITATION>

SOURCE FORMALISM:
$\\max_{x \\in S} U(x) \\implies S_{bound} \\subset S_{free} \\quad \\text{such that } \\mathbb{E}[U(x_{bound})] > \\mathbb{E}[U(x_{free})]$

OUR FORMALIZATION:
[OUR FORMALIZATION — NOT SOURCE SYNTAX]
Action_{t_0} = \\text{Lock}(State_{t_1}, Invariant) \\implies P(State_{t_1} \\models \\neg Invariant) = 0

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
}""",

"""ZETTEL

ID: 20260907-AUSLANDER-1999-LIVENESS-MEDIATIZATION

TITLE:
Liveness is not an ontologically pristine presence but an effect produced and reconstituted by mediatization.

SOURCE:
Auslander, Philip — Liveness: Performance in a Mediatized Culture — 1999 — Chapter 2: "Live Performance in a Mediatized Culture", pp. 24–32, 53–56.

PASSAGE:
[QUOTE]
"Live performance cannot be understood as an ontologically pristine realm that stands outside or prior to mass-mediatized culture... Rather, the live is an effect of mediatization: the category of the 'live' only came into existence when technologies of recording (wax cylinders, photography, film) made it possible to preserve performances. What counts as live is constantly reconstituted by the very technologies that appear to threaten it, so that contemporary live performance increasingly seeks to replicate the sensory experience and pristine clarity of the screen."

RESEARCH OBJECT:
The recursive constitution of "live presence" by recording technologies, destroying the myth of unmediated performance authenticity.

LOCAL MOVE:
Auslander deconstructs Peggy Phelan’s performance ontology (which claims that the live happens only in the unrepeatable present and disappears into memory), proving that live performance is economically, aesthetically, and technologically structured by media apparatuses.

SOURCE TERMS:
liveness; mediatization; presence; reproduction; disappearance; autopoietic feedback loop; pristine clarity; reconstitution.

WHAT BECAME STRANGE:
We treat real-time interaction with an AI chatbot as a "live" performance event, even though every token emitted is a frozen inference calculation over a static historical dataset compiled years prior.

QUESTION:
What constitutes "liveness" in an AI system that generates tokens in real time from a frozen parametric memory?

DEEPER QUESTION:
Why do users assign greater authenticity and risk to an AI performing in real time (token-streaming) than to the exact same text delivered as a completed batch artifact?

MECHANISM:
Historical Progression:
1. Pre-recording: Performance exists without being called "live."
2. Recording invented: "Live" invented as the residual category of the non-recorded.
3. Mediatization dominant: Live performance incorporates monitors, microphones, and pre-recorded tracks to match screen expectations.
4. Synthetic Real-time: Algorithmic inference simulates the tension of unscripted presence through incremental token generation.

FORMAL SHIFT:
<PHYSICAL UNREPEATABLE COPRESENCE>
→ <TECHNICAL RECORDING / MEDIATIZATION>
→ [SCREEN SIMULATION OF AUTHENTICITY]
→ <RECONSTITUTED SYNTHETIC LIVENESS>

SOURCE FORMALISM:
NONE

OUR FORMALIZATION:
[OUR FORMALIZATION — NOT SOURCE SYNTAX]
Liveness(Event) = f(\\text{Latency}(Event) \\to 0, \\text{Stochastic\\_Uncertainty}(Event) > 0)
where Liveness \\text{ is invariant under the degree of internal mediatization.}

TENSION:
Peggy Phelan (1993) in Unmarked argues that performance's only life is in the present and cannot be recorded, documented, or circulated without becoming something else; Auslander proves that without documentation, performance has no modern cultural existence.

MISSING:
The physiological substrate: does the human nervous system respond identically to a live human actor facing physical failure on stage as it does to a token stream streaming from a data center?

BOUNDARY:
Auslander’s analysis focuses on late 20th-century broadcast television and rock concerts; it does not fully predict distributed autonomous software agents that perform economic transactions without any human audience present.

CITATION TRAIL:
Phelan, Peggy (1993), Unmarked: The Politics of Performance; Schechner, Richard (1988), Performance Theory.

TEST:
Present identical outputs to two human test groups: Group A watches the text type out in real-time token streaming with slight latency variances; Group B receives the entire text block instantly. Measure differences in attributed agency, authenticity, and empathy.

PLATFORM:
[[game-12-performance]]

LINKS:
[[game-01-instruction]]
[[game-07-gesture]]
[[game-12-performance]]

BIBTEX:
@book{auslander1999liveness,
  author    = {Philip Auslander},
  title     = {Liveness: Performance in a Mediatized Culture},
  year      = {1999},
  publisher = {Routledge},
  address   = {London and New York}
}""",

"""ZETTEL

ID: 20260907-SCHECHNER-1988-RESTORED-BEHAVIOR

TITLE:
Performance is restored behavior—twice-behaved behavior strip-mined from origin and reassembled.

SOURCE:
Schechner, Richard — Performance Theory — 1988 — Chapter 2: "Restored Behavior", pp. 35–38.

PASSAGE:
[QUOTE]
"Restored behavior is living behavior treated as a film director treats a strip of film. These strips of behavior can be rearranged or reconstructed; they are independent of the causal systems (social, psychological, technological) that brought them into existence. The behavior exists 'out there,' separate from 'me.' It is twice-behaved behavior: behavior that has been learned, rehearsed, detached from its original context, and performed again in a new setting."

RESEARCH OBJECT:
Restored behavior as modular, recombinant cultural strips detached from original psychological authenticity.

LOCAL MOVE:
Schechner severs performance from spontaneous emotional expression, defining it as the theatrical manipulation of pre-existing behavioral routines that can be stored, transmitted, recombined, and re-enacted across cultural boundaries.

SOURCE TERMS:
restored behavior; twice-behaved behavior; strip of behavior; rehearsal; detachment; reenactment; ritual; performative frame.

WHAT BECAME STRANGE:
An LLM does not generate human speech from lived bodily experience; it strings together millions of strips of "restored behavior" extracted from common crawl datasets, recombining twice-behaved textual rituals on stage.

QUESTION:
When an AI assistant says "I am happy to help," whose restored behavior is being enacted across the aperture?

DEEPER QUESTION:
Can an entity ever engage in first-time behavior if its cognitive operations consist entirely of autoregressive attention over historic training data?

MECHANISM:
1. Extraction: Natural human behavior observed in original context $C_0$.
2. Separation: Strip of behavior $B$ detached from causal source and recorded.
3. Rehearsal: $B$ internalized by actor/model as an autonomous routine.
4. Re-enactment: $B$ triggered in artificial context $C_1$, performing an action whose meaning is independent of the actor's internal psychological state.

FORMAL SHIFT:
<ORGANIC EMBODIED BEHAVIOR IN SITU>
→ <DETACHABLE STRIP OF STORED ACTION>
→ [RECOMBINANT REHEARSAL / TOKEN INDEXING]
→ <TWICE-BEHAVED ARTIFICIAL PERFORMANCE>

SOURCE FORMALISM:
NONE

OUR FORMALIZATION:
[OUR FORMALIZATION — NOT SOURCE SYNTAX]
Behavior_{performed} = \\sum_j w_j \\cdot Strip_j(Context_{source}) \\quad \\text{where } \\text{Actor}_{internal} \\cap Strip_j = \\emptyset

TENSION:
Stanislavski's method acting demands that the actor draw from authentic emotional memory; Schechner proves that theatrical efficacy relies on external physical conventions regardless of internal feeling.

MISSING:
The degradation function: how many times can a strip of restored behavior be re-enacted and recombined before it collapses into meaningless cultural kitsch?

BOUNDARY:
Schechner’s model applies to social and artistic rituals; it does not explain how novel, unprecedented mathematical axioms are discovered without prior behavioral precedent.

CITATION TRAIL:
Auslander, Philip (1999), Liveness: Performance in a Mediatized Culture; Goffman, Erving (1959), The Presentation of Self in Everyday Life.

TEST:
Analyze conversational transcripts to measure the degree to which an AI agent defaults to boilerplate customer service greetings (restored behavior) versus dynamically synthesized task descriptions.

PLATFORM:
[[game-12-performance]]

LINKS:
[[game-02-score]]
[[game-08-commission]]
[[game-12-performance]]

BIBTEX:
@book{schechner1988performance,
  author    = {Richard Schechner},
  title     = {Performance Theory},
  year      = {1988},
  publisher = {Routledge},
  address   = {New York}
}""",

"""ZETTEL

ID: 20260907-HARTSOE-2026-LISTENER-WITH-ACTUATORS

TITLE:
Operative ekphrasis emerges when interpretation acquires machinery without requiring natural language to surrender its ambiguity.

SOURCE:
Hartsoe, Watson — The World Does Not Fit Through the Mouth: Description, Technology, and What Survives the Crossing — 2026 — Chapter XI: "The Listener with Actuators", pp. 206–215.

PASSAGE:
[QUOTE]
"Natural language increasingly leaves exactness undone while still producing external state change. 'Make the doorway generous.' A compiler hates this sentence. A generative system thrives on it because the work is unfinished. No width lives inside generous. The machine supplies one... This is the change worth isolating. Not 'words make pictures.' Not 'description creates worlds.' The new thing is that the interpreter has actuators... Operative ekphrasis belongs here: not at the point where language becomes code, but where interpretation acquires machinery without requiring language to surrender all its ambiguity first."

RESEARCH OBJECT:
Operative ekphrasis: the technical condition where natural language descriptions directly actuate physical or virtual state changes through an interpretive intermediary.

LOCAL MOVE:
Hartsoe redefines the classical literary concept of ekphrasis (the verbal description of a visual work of art) by coupling it to cybernetic actuators, showing that natural language now commands material consequences without undergoing compile-time disambiguation.

SOURCE TERMS:
operative ekphrasis; listener with actuators; generous doorway; transfer of judgment; description; cutting; surviving the crossing.

WHAT BECAME STRANGE:
For seventy years, computers demanded that humans translate fuzzy human thoughts into ruthlessly explicit formal code (Fortran, C, SQL); suddenly, machines have acquired the ability to absorb radical human ambiguity and complete the missing specifications themselves.

QUESTION:
When an autonomous system supplies the missing width for a "generous doorway," whose architectural judgment entered the physical world?

DEEPER QUESTION:
How does a society govern state changes produced by linguistic descriptions whose consequences were chosen by a black-box probability distribution?

MECHANISM:
1. Human issues ambiguous natural language description $D$ with deliberate vacancy $V$.
2. Compiler approach: Reject $D$ with Syntax/Semantic Error (Unresolved Identifier).
3. Operative Ekphrasis: Neural model samples latent distribution $P(W \\mid D)$ to resolve $V \\to w^*$.
4. Actuator engages physical/virtual reality: State transition occurs.

FORMAL SHIFT:
<AMBIGUOUS HUMAN POETIC UTTERANCE>
→ <LATENT PROBABILISTIC INTERPRETATION>
→ [ACTUATOR STATE DISPATCH]
→ <MATERIAL CONSEQUENCE EXECUTING UNSPECIFIED PARTICULARS>

SOURCE FORMALISM:
NONE

OUR FORMALIZATION:
[OUR FORMALIZATION — NOT SOURCE SYNTAX]
State_{t+1} = \\text{Actuator}(\\text{Denoise}(Prompt_{ambiguous}, \\theta))
\\text{where } \\text{Ambiguity}(Prompt) > 0 \\land \\text{Tolerance}(State) \\text{ is acceptable.}

TENSION:
Dijkstra’s structured programming doctrine insists that ambiguity in execution is an existential defect; Hartsoe demonstrates that in creative and social domains, ambiguity is the primary operational medium.

MISSING:
A legal and ethical liability schema: when the actuator collapses the building because "generous" was interpreted with insufficient load-bearing columns, who is indicted?

BOUNDARY:
Operative ekphrasis cannot be used in formal mathematical proofs or safety-critical flight control where tolerance for variance is zero.

CITATION TRAIL:
Suchman, Lucy A. (1987), Plans and Situated Actions; Bolter, Jay David and Grusin, Richard (1999), Remediation.

TEST:
Provide 100 professional architects and 100 generative models with the identical instruction: "Make the courtyard meditative." Compare the variance in dimensional geometry and light modeling between human drafts and machine outputs.

PLATFORM:
[[deep-play-at-the-aperture]]

LINKS:
[[game-01-instruction]]
[[game-02-score]]
[[game-11-constraint]]

BIBTEX:
@book{hartsoe2026world,
  author    = {Watson Hartsoe},
  title     = {The World Does Not Fit Through the Mouth: Description, Technology, and What Survives the Crossing},
  year      = {2026},
  publisher = {Worldful Press},
  address   = {San Francisco}
}""",

"""ZETTEL

ID: 20260907-HARTSOE-2026-THE-KNIFE-SCHEMA

TITLE:
A database schema is a knife whose handle is hidden beneath the table, enforcing precision through chosen blindness.

SOURCE:
Hartsoe, Watson — The World Does Not Fit Through the Mouth: Description, Technology, and What Survives the Crossing — 2026 — Chapter V: "The Knife", pp. 100–108.

PASSAGE:
[QUOTE]
"A sensor turns green because one threshold was crossed. Outside its field, roofs bow, workers improvise, insects hatch, marriages collapse, water creeps behind drywall. The sensor is not stupid. It is disciplined. Precision requires a chosen blindness... A database performs the same operation with better typography. ADDRESS receives a box. THE TREE I SAT UNDER AFTER MY FATHER DIED does not. Age enters. Grief does not. Income enters. Informal obligation disappears... A schema is a knife whose handle has been hidden beneath the table. The danger is not that language cuts the world. The danger begins when the cut forgets the knife."

RESEARCH OBJECT:
The epistemological violence of categorical formalization: the unavoidable excision of lived reality required to make data governable.

LOCAL MOVE:
Hartsoe synthesizes Daoist ontology (Zhuangzi's butcher carving the ox) with modern database architecture, proving that technical precision is not the accurate mirroring of reality, but the systematic institutional enforcement of what is allowed to be ignored.

SOURCE TERMS:
the knife; schema; chosen blindness; precision; cut; triage; forgotten knife; administrative governability.

WHAT BECAME STRANGE:
An organization believes its dashboard provides "complete visibility" into its operations, blind to the fact that the dashboard's metrics were designed specifically to exclude whatever could not be translated into an integer.

QUESTION:
What unrepresented human realities are discarded when an LLM context window compresses a patient's medical history into standardized clinical tokens?

DEEPER QUESTION:
Can an AI system ever be trained to remember the knife—to maintain awareness of what its own tokenization schema excised?

MECHANISM:
1. Physical World $W$ contains infinite continuous relational properties.
2. Administrative Need demands tabular rows and computable metrics.
3. Schema $S$ acts as a knife: defines set of allowable fields $F = \\{f_1, ..., f_k\\}$.
4. Excision: $W \\to W' = \\pi_F(W)$. Remainder $W \\setminus W'$ is deleted from governance.
5. Naturalization: Over generations, $W'$ is treated as the entirety of objective reality.

FORMAL SHIFT:
<CONTINUOUS PHENOMENOLOGICAL COMPLEXITY>
→ <DISCRETE TABULAR SCHEMA FIELDS>
→ [INSTITUTIONAL ENFORCEMENT & AUDITING]
→ <NATURALIZED ADMINISTRATIVE OBJECTIVITY>

SOURCE FORMALISM:
NONE

OUR FORMALIZATION:
[OUR FORMALIZATION — NOT SOURCE SYNTAX]
Data = \\text{Projection}(World, Schema) \\implies \\text{Information\\_Loss} = \\mathcal{H}(World) - \\mathcal{H}(Data) > 0
\\text{Systemic\\_Risk} = f(\\text{Belief}(\\text{Loss} = 0))

TENSION:
Relational database theorists (Codd) celebrate normalization as mathematical purity; Hartsoe demonstrates that normalization is political exclusion.

MISSING:
The resistance of the remainder: how does the excised world (water creeping behind drywall) eventually assert itself against the green sensor?

BOUNDARY:
Without schemas and categorization, human coordination collapses; triage is a survival necessity, not a moral failure.

CITATION TRAIL:
Bowker, Geoffrey C. and Star, Susan Leigh (1999), Sorting Things Out: Classification and Its Consequences; Scott, James C. (1998), Seeing Like a State.

TEST:
Audit an enterprise CRM database. Compare the quantitative success metrics recorded in the fields against the qualitative field notes written by sales agents in unstructured comment boxes. Measure what percentage of critical risk warnings occurred in fields that "did not fit the schema."

PLATFORM:
[[deep-play-at-the-aperture]]

LINKS:
[[game-03-program]]
[[game-05-query]]
[[game-10-edit]]

BIBTEX:
@book{hartsoe2026worldknife,
  author    = {Watson Hartsoe},
  title     = {The World Does Not Fit Through the Mouth: Description, Technology, and What Survives the Crossing},
  year      = {2026},
  publisher = {Worldful Press},
  address   = {San Francisco}
}"""
]

# 1. Write unified master archive
master_file = os.path.join(base_dir, "prime_zettel_forage.md")
with open(master_file, "w", encoding="utf-8") as f:
    f.write("# PRIME ZETTEL FORAGE — INQUIRY + OPPOSITION\n")
    f.write("## Master Archive of 24 Atomic Research Objects across the 12 Language Games\n")
    f.write("**Author/Curator:** Watson Hartsoe / Operative Humanities Laboratory  \n")
    f.write("**Protocol:** POML v3.0 Specification\n\n---\n\n")
    for z in zettels:
        f.write("```text\n" + z + "\n```\n\n")
print(f"Wrote master archive with {len(zettels)} zettels to: {master_file}")

# 2. Write individual slip files into WAYS TO WRITE/zettels/
for z in zettels:
    m = re.search(r"ID:\s*([^\n]+)", z)
    if m:
        zid = m.group(1).strip()
        slip_filename = os.path.join(zettel_dir, f"{zid}.md")
        with open(slip_filename, "w", encoding="utf-8") as sf:
            sf.write("```text\n" + z + "\n```\n")
print(f"Generated {len(zettels)} individual zettel slip files in: {zettel_dir}")
