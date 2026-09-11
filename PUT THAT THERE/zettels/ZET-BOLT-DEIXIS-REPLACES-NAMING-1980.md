ZETTEL

ID:
ZET-BOLT-DEIXIS-REPLACES-NAMING-1980

TITLE:
Pointing Can Remove the Need to Know What the Object Is Called

SOURCE:
Richard A. Bolt - “Put-That-There: Voice and Gesture at the Graphics Interface” - SIGGRAPH 1980. ([MIT Media Lab](https://www.media.mit.edu/speech/papers/1980/bolt_SIGGRAPH80_put-that-there.pdf))

PASSAGE:
Bolt says the user can omit colour and shape words and “need not even know what the thing is, or what it is called.”

RESEARCH OBJECT:
Deixis as replacement for explicit object categorization.

LOCAL MOVE:
Strengthens description migration: pointing does not merely compress coordinates; it can bypass lexical classification of the selected object.

SOURCE TERMS:
that; pointing; intended referent; ostensively defined; graphics world; pronomialization.

WHAT BECAME STRANGE:
A supposedly underspecified pronoun can require less ontology from the user than an explicit noun phrase.

QUESTION:
What information must the system possess for “that” to outperform a categorical description?

DEEPER QUESTION:
Can deictic interfaces reduce the requirement that humans adopt the software system’s ontology?

MECHANISM:
The pointing event restricts the candidate referent set sufficiently that lexical attributes become unnecessary for selection.

FORMAL SHIFT:
DESCRIBE OBJECT → SELECT OBJECT IN SITUATION.

SOURCE FORMALISM:
Bolt treats “that” as whatever is pointed out within the alternatives present in the scene.

OUR FORMALIZATION:
[OUR FORMALIZATION - NOT SOURCE SYNTAX]
REFERENT = resolve(pointing_event, scene_state)
rather than
REFERENT = resolve(type + colour + symbolic name).

TENSION:
The reduction in user description is purchased by increased sensing, scene representation, and reference-resolution machinery.

MISSING:
Exact implementation of referent disambiguation when multiple objects intersect or nearly intersect the pointing ray.

BOUNDARY:
Bolt’s claim concerns a deliberately simple graphical microworld.

CITATION TRAIL:
Bolt 1980 → deictic reference → description migration → requisite description.

TEST:
Construct scenes with progressively more candidate objects and measure when pointing alone ceases to supply enough requisite distinction.

PLATFORM:
Multimodal HCI.

LINKS:
ZET-WITTGENSTEIN-DEIXIS-008; ZET-DESCRIPTION-MIGRATION; ZET-LAW-REQUISITE-DESCRIPTION; ZET-YELLOW-CIRCLE.

BIBTEX:
@inproceedings{Bolt1980PutThatThere, author={Richard A. Bolt}, title={Put-That-There: Voice and Gesture at the Graphics Interface}, booktitle={SIGGRAPH}, year={1980}}
```

```text
