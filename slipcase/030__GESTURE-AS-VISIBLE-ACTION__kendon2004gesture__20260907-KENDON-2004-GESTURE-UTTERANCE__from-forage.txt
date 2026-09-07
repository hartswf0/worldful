ZETTEL

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
Utterance = \langle Token(t), Kinesic\_Vector(t), Spatial\_Coordinate(t) \rangle
where \text{Sync}(Token_{stress}, Kinesic_{stroke}) \le \Delta t_{threshold}

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
}
