ZETTEL

ID:
ZET-BOLT-EXEMPLAR-AS-PROGRAM-1980

TITLE:
Put-That-There Already Makes One Artifact a Model for Changing Another

SOURCE:
Richard A. Bolt - “Put-That-There: Voice and Gesture at the Graphics Interface” - SIGGRAPH 1980. ([MIT Media Lab](https://www.media.mit.edu/speech/papers/1980/bolt_SIGGRAPH80_put-that-there.pdf))

PASSAGE:
Bolt proposes “Make that ... like that”; the second pointed item becomes the system’s “model” for changing the first.

RESEARCH OBJECT:
The exemplar as operative description.

LOCAL MOVE:
Pushes artifact-as-prompt backward to 1980: an existing graphical object can supply transformation criteria without those criteria being verbalized.

SOURCE TERMS:
make that; like that; model; copy; pointing; attributes.

WHAT BECAME STRANGE:
The artifact is no longer merely output. It becomes an instruction source for subsequent transformation.

QUESTION:
Which properties of the exemplar are transferred, and which are ignored?

DEEPER QUESTION:
When an example acts as a program, where is the transformation grammar that determines what “like” preserves?

MECHANISM:
One gesture binds the target; another binds an exemplar; the application maps attributes from exemplar to target.

FORMAL SHIFT:
TEXTUAL SPECIFICATION → EXEMPLAR-BASED SPECIFICATION.

SOURCE FORMALISM:
Bolt states that the second referenced item becomes the “model” for change and replaces the first in a copy-like operation.

OUR FORMALIZATION:
[OUR FORMALIZATION - NOT SOURCE SYNTAX]
TRANSFORM(target, exemplar, transfer_policy).

TENSION:
An exemplar cannot specify its own relevance relation; a transfer policy must still decide which similarities count.

MISSING:
Implementation details defining the attribute set copied in the Media Room system.

BOUNDARY:
This is not a quine and does not show that artifacts intrinsically contain their own instructions.

CITATION TRAIL:
Bolt 1980 → exemplar transformation → Geertz model-for/model-of → generative reference prompting.

TEST:
Use the same yellow-circle exemplar under commands “make that like that,” “same colour,” “same shape,” and “copy that”; compare which invariants must be supplied linguistically.

PLATFORM:
Multimodal graphics / exemplar programming.

LINKS:
ZET-YELLOW-CIRCLE; ZET-MODEL-OF-MODEL-FOR; ZET-QUINE-LANGUAGE-GAME; ZET-OPERATIVE-DESCRIPTION.

BIBTEX:
@inproceedings{Bolt1980PutThatThere, author={Richard A. Bolt}, title={Put-That-There: Voice and Gesture at the Graphics Interface}, booktitle={SIGGRAPH}, year={1980}}
```

```text
