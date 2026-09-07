# LANGUAGE GAME 07: GESTURE

> **Origin:** Extracted from [`WAYS TO WRITE/builders-games.md`](file:///Users/gaia/WORLDFUL/WAYS%20TO%20WRITE/builders-games.md)  
> **Part of:** The Twelve Language Games of Generative Systems  

---

## SECTION 1: THE EMPIRICAL CARD (CASE STUDIES & EPISTEMIC TRADE-OFFS)

### ​Card 7: A Prompt is a Gesture
 
​Framed as a gesture, the prompt acts as a deictic pointer, directing computational attention to an already present artifact, visual element, or context window segment. Its primary semiotic function is indexical rather than descriptive, relying entirely on co-presence and shared attention. 
 
​The strongest confirming case appears in multimodal human-computer interaction, specifically spatial visual prompting. A specialist reviewing an MRI scan circles an indeterminate shadow with a digital stylus and enters the single-word prompt: "Evaluate." The linguistic token contains almost no independent semantic information; it operates purely as an indexical gesture, focusing the cross-attention mechanisms of the vision-language model on the spatial coordinates defined by the coordinate mask.
 
​The counterexample is the phenomenon of indexical collapse in cold, context-free textual interfaces. When a user opens a brand-new chat interface and enters a deictic reference—such as "Rewrite that paragraph to sound more authoritative" or "What should we do about this?"—the interaction breaks down immediately. Stripped of an accessible context history or shared visual substrate, the indexical gesture points into an empty vacuum, forcing the system to return an error or prompt for context.
 
​The gesture metaphor makes visible the embodied, indexical, and attentional nature of interaction, demonstrating that language often functions as a pointer rather than a self-contained container of meaning. However, it erases the extensive syntactic, axiomatic, and counterfactual power of natural language, which can construct complex imaginary domains entirely detached from immediate reference points.

---

## SECTION 2: THE CORE GAME SPECIFICATION

# 07 — GESTURE

**The game:**
Meaning depends on shared attention.

**Human role:** pointer
**Machine role:** attender
**Direction of fit:** sign → present object
**Valid move:** deixis
**Success condition:** both parties orient toward the same thing.

**Structural diagnosis:**
The utterance carries less information than the surrounding situation.

“Here.”
“That.”
“This part.”
“Again.”

These work only because the field is already shared.

**Characteristic trap:**
**Context appropriation.** Systems pretend to share a referential field they cannot actually access.

**Counter-framing strategy:**
**Expose the index.** Make the referent explicit whenever shared access is uncertain.

**Confirming case:**
A user circles part of an image and says, “Remove this.”

**Breakdown case:**
A fresh session receives: “Make that section less aggressive.”

There is no “that.”

**What it makes visible:** attention, embodiment, co-presence.

**What it conceals:** the dependence of language on shared worlds.

**Drift trigger:**
When the pointed object becomes material for transformation, **Gesture → Edit**.

**Sovereign question:**
**What exactly are we both looking at?**

---

---

## SECTION 3: ANCESTRAL LINEAGE & MIGRATION MAP

# 07 — GESTURE

## Lineage

**Index → deixis → joint attention → pointing interface → multimodal prompt**

### Ancestral formalisms

**Peirce’s index.**
A sign may refer not by resemblance or convention alone but through an existential or contextual connection to its object.

**Bühler’s deixis.**
Words such as *here*, *there*, *this*, and *that* operate from an orienting center and depend upon a shared deictic field; later work extends this to imagined as well as immediately visible spaces.

Then HCI makes it executable.

**Richard Bolt, “Put-that-there,” 1980.**
Voice and pointing are deliberately combined so pronouns can function economically: gesture supplies the referent that speech leaves underspecified.

This is almost embarrassingly close to contemporary multimodal prompting.

### Migration map

```text
INDEX
→ DEIXIS
→ JOINT ATTENTION
→ "PUT THAT THERE"
→ MULTIMODAL REFERENCE
→ VISUAL PROMPT
```

### Inherited invariant

```text
gesture succeeds iff
speaker_reference
=
system_reference
```

### Generative rupture

The text itself may be nearly semantically empty:

```text
this
there
make it bigger
again
that one
```

Its computational meaning lives in cursor position, mask, selection, gaze, image region, prior turn, or spatial state.

The “prompt” therefore cannot be reconstructed from the string alone.

### Card inheritance

This card should visibly point back to **Put-that-there**.

It proves that multimodal prompting did not suddenly appear with vision-language models.

### Lineage tags

`#peirce-index #deixis #joint-attention #put-that-there #multimodal-reference`

---

---

## SECTION 4: THE FORMAL ECHO & LITERATURE GROUNDING

# 07 — GESTURE

### `PEIRCE → BÜHLER → JOINT ATTENTION → PUT-THAT-THERE → MULTIMODAL MODELS`

Bolt’s *Put-that-there* is a direct ancestor: speech and pointing were combined so pronouns could remain economical because gesture supplied referential precision. ([DOI][8])

```yaml
title: The Prompt That Points
seed: Gesture exposes the fiction that prompt meaning can be recovered from language alone; sometimes the operative content resides in a shared field of attention.

ancestral_thinkers:
  key_sources:
    - "Charles S. Peirce — indexical signs"
    - "Karl Bühler — deictic field"
    - "Erving Goffman — interaction order"
    - "Richard Bolt — Put-that-there"
    - "Charles Goodwin — Professional Vision"
    - "Paul Dourish — Where the Action Is"
  inherited_lessons:
    - "Reference can depend on indexical relation rather than description."
    - "Meaning is distributed across modalities."
    - "Shared attention is an interactional achievement."
  governing_impressions:
    - "The word 'that' is tiny because the world is doing the rest."

origin_conditions:
  first_questions:
    - "How can a minimal utterance carry rich operational content?"
    - "Where is the referent stored?"
  first_conflicts:
    - "symbol vs index"
    - "text vs co-presence"
  first scenes:
    - "pointing finger"
    - "shared screen"
    - "Put-that-there room"
  first_methods:
    - "semiotics"
    - "interaction analysis"
    - "multimodal HCI"
  first_memories:
    - "There is no 'that' without a field."

disciplinary_matrix:
  home_fields:
    - "semiotics"
    - "interaction studies"
    - "HCI"
  adjacent_fields:
    - "linguistic anthropology"
    - "computer vision"
  key vocabularies:
    - "deixis"
    - "index"
    - "joint attention"
    - "reference"
  archives_objects:
    - "cursor positions"
    - "masks"
    - "gaze"
    - "gesture-video"
  explanatory_pressures:
    - "recover the multimodal event surrounding the utterance"

epochs:
  - period: "late 19th–mid 20th century"
    stage: "semiotic formation"
    locale: "semiotics and linguistics"
    primary_sources:
      - "Peirce"
      - "Bühler"
    dominant_questions:
      - "How does language point?"
    methods:
      - "semiotic analysis"
    conceptual_distinctions:
      - "symbol/index"
    institutions:
      - "linguistics"
    writing habits:
      - "taxonomic theory"
    tensions:
      - "representation/context"
    influence_weight: 90

  - period: "1980"
    stage: "prototype"
    locale: "MIT Architecture Machine Group"
    primary_sources:
      - "Bolt — Put-that-there"
    dominant_questions:
      - "Can voice and gesture jointly control graphics?"
    methods:
      - "multimodal interface design"
    conceptual_distinctions:
      - "speech/pointing"
    institutions:
      - "HCI laboratory"
    writing habits:
      - "demonstration"
    tensions:
      - "recognition/context"
    influence_weight: 100

  - period: "2020s"
    stage: "scaling"
    locale: "multimodal foundation models"
    primary_sources:
      - "vision-language interaction"
    dominant_questions:
      - "What exactly is included in the prompt event?"
    methods:
      - "cross-modal attention"
    conceptual_distinctions:
      - "text/context"
    institutions:
      - "model platforms"
    writing habits:
      - "multimodal benchmark"
    tensions:
      - "string/event"
    influence_weight: 100

migration_map:
  - from: "deictic gesture"
    to: "multimodal prompt"
    reason: "computational systems gain access to shared visual surfaces"
    intellectual_shift: "prompt becomes distributed across coordinates and modalities"

citation_axis:
  core_citations:
    - "Peirce"
    - "Bühler"
    - "Bolt"
    - "Goodwin"
  shadow_citations:
    - "Dourish"
    - "Suchman"
  adversaries:
    - "prompt-as-self-contained-string"
  possible_syntheses:
    - "linguistic anthropology + multimodal HCI"

evidence_stack:
  primary_materials:
    - "screen recordings"
    - "pointer trajectories"
    - "visual selections"
  secondary_materials:
    - "semiotics"
    - "embodied interaction"
  research surfaces:
    - "cursor logs"
    - "misreference repair"
  composition_pipeline:
    - "field"
    - "gesture"
    - "utterance"
    - "alignment"
    - "repair"

vibe_clusters:
  - "indexical-interface"
  - "embodied-reference"
mood_families:
  - "precise"
  - "situated"

idea_jukebox_timeline:
  - year: 1934
    slot: "G1"
    source: "Bühler — Sprachtheorie"
    why: "Reference is organized around a deictic field."
  - year: 1980
    slot: "G2"
    source: "Bolt — Put-that-there"
    why: "Voice and gesture jointly become executable reference."
  - year: 1994
    slot: "G3"
    source: "Goodwin — Professional Vision"
    why: "Seeing together is socially organized."
  - year: 2020
    slot: "G4"
    source: "multimodal prompting"
    why: "Shared attention becomes machine-readable."

signature_thesis_ecology:
  dominant_entities:
    - "pointer"
    - "referent"
    - "field"
    - "attention"
  problem_logic: "Text-only prompt archives amputate the referential situation."
  method_logic: "Record gesture, coordinates and context as part of the utterance."
  archive_logic: "The multimodal event is primary evidence."
  conflict_logic: "string vs situation"
  intervention_logic: "Redefine the prompt as distributed indexical action."
  scale_logic: "micro-interaction"
  style_logic: "ethnographic"
  temporal_logic: "event-based"
  epistemic_logic: "reference succeeds through achieved joint orientation"
  political_logic: "interfaces decide which forms of pointing become legible"
  symbolic_logic: "index/referent"

writing_bias:
  output_mode: "paper"
  density: "medium"
  realism_mode: "empirical"
  abstraction_level: "high"
  intervention_pressure: "high"

tagline: "#deixis #put-that-there #joint-attention #multimodal-prompt"
ttl: 1
```

**RESEARCH ECHO:** Stop collecting prompts as strings. Reconstruct the deictic event: what was visible, selected, circled, pointed toward, recently mentioned, or spatially co-present when “move that there” became meaningful. Put Peirce and Bühler beside Bolt and Goodwin, then treat multimodal model interaction as a contemporary laboratory of indexicality. The intervention is methodological: **a transcript without its field of attention can be as incomplete as a photograph of a pointing hand cropped at the wrist.** `#deixis #joint-attention #multimodal-prompt`

---

---

## SECTION 5: THEORY OF THE PROGRAM & COMPUTATIONAL ONTOLOGY

# 07 — GESTURE

## <Initial Interpretation>

This is a program for aligning <attention> across a shared <field>.

The utterance may carry almost no meaning independently.

The real operation is **reference**.

## <Theory Skeleton>

### <entities>

* <actor>
* <field>
* <referent>
* <pointer>
* <selection>
* <utterance>
* <coordinate>
* <shared context>
* <attention state>

### [operations]

* [point]
* [select]
* [circle]
* [refer]
* [align]
* [disambiguate]
* [shift-attention]

### <states>

```text
unshared attention
→ candidate referent
→ aligned attention
→ operation on referent
```

### <constraints>

The system may not invent a referent when no shared referential field exists.

### <invariants>

```text
human_referent = machine_referent
```

must hold before referent-sensitive action proceeds.

## <Assumption Ledger>

<safe> Meaning may be distributed across language, image, cursor, selection, and history.

<safe> Deictic terms depend on context.

<uncertain> Machine and human salience maps correspond even when coordinates do.

<requires-user-decision> How aggressively should ambiguous pointing be resolved automatically?

## <Operational Description>

```text
<actor>
[points-to]
<region>

<utterance>
[indexes]
<region>

<region>
[resolves-to]
<referent>

<referent>
[becomes]
<current focus>

<subsequent operation>
[acts-on]
<current focus>
```

## <Failure Description>

### Indexical collapse

“That” has no resolvable object.

Response:

Ask for or expose the missing field.

### Coordinate/reference mismatch

The same region contains several plausible objects.

Response:

Make candidate referents visible.

### Context expiration

The pointer once made sense but the field changed.

Response:

Invalidate stale reference.

## <Change Test>

If the pointed object is then transformed, <Gesture> becomes <Edit>.

If pointing merely establishes a boundary around legal possibilities, <Gesture> can become <Constraint>.

## <Residual Human Theory>

Humans share attention through posture, timing, gaze, habit, expertise, and social expectation. Coordinates capture only part of pointing.

---

---

## SECTION 6: RESIDUAL HUMAN THEORY (THE IRREDUCIBLE STAKES)

# 07 — GESTURE

## PURPOSE

Align attention around a shared referent.

```text
ENTITY(actor)
OP(points toward)
ENTITY(referent)

ENTITY(system)
OP(resolves)
ENTITY(reference)
```

## ENTITIES

`ENTITY(field)`
`ENTITY(pointer)`
`ENTITY(referent)`
`ENTITY(selection)`
`ENTITY(coordinate)`
`ENTITY(shared context)`
`ENTITY(attention state)`

## OPERATIONS

`OP(point)`
`OP(select)`
`OP(circle)`
`OP(resolve)`
`OP(disambiguate)`
`OP(shift attention)`

## INVARIANT

```text
ENTITY(human referent)
=
ENTITY(machine referent)
```

before referent-sensitive action proceeds.

## STATE FLOW

```text
unshared attention
→ candidate referent
→ aligned attention
→ action on referent
```

## FAILURE

**Indexical collapse:** “that” points nowhere.

**Stale reference:** the field has changed since the gesture occurred.

## DRIFT

Gesture → Edit when the selected referent becomes the object of transformation.

## SOVEREIGN QUESTION

**What exactly are we both looking at?**

---

---

## SECTION 7: PLAY DYNAMICS, PUZZLE & FUN THEORY

# 07 — GESTURE

## THE FUN IS SHARED ATTENTION

### Cognitive puzzle

The player learns what another intelligence is attending to without fully describing it.

### PATTERNS

`PATTERN(referent)`
`PATTERN(pointer)`
`PATTERN(field)`
`PATTERN(shared attention)`
`PATTERN(ambiguity)`

### LEARNING

`LEARN(point)`
`LEARN(infer)`
`LEARN(disambiguate)`
`LEARN(use context economically)`
`LEARN(repair reference)`

### POSSIBILITY SPACE

```text
SPACE{
obvious referent,
competing referents,
stale referent,
hidden referent,
misalignment,
joint discovery
}
```

### OPTIMAL PATH

The player will develop a shorthand.

That shorthand is itself the reward—until it becomes perfectly stable.

### BOREDOM THRESHOLD

When:

```text
gesture X
always means
object Y
```

gesture becomes command notation.

### LEARNING TRANSITION

```text
pointing ambiguity
→ contextual clue
→ shared convention
→ shorthand
→ effortless coordination
```

### FAILURE

Constant misunderstanding creates frustration.

Perfect reference eliminates attention as a puzzle.

### ARTISTIC OPENING

The most interesting gestures can legitimately point to more than one thing.

### EXPERIENCE DESIGN

Make reference depend on position, history, visual field and previous coordination.

The player learns the other participant's attention habits.

### RESIDUAL HUMAN ELEMENT

A glance can mean:

> look there

> did you see that?

> don't look there

> we both know what that means.

Coordinates cannot contain all four.

---

