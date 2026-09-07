# LANGUAGE GAME 10: EDIT

> **Origin:** Extracted from [`WAYS TO WRITE/builders-games.md`](file:///Users/gaia/WORLDFUL/WAYS%20TO%20WRITE/builders-games.md)  
> **Part of:** The Twelve Language Games of Generative Systems  

---

## SECTION 1: THE EMPIRICAL CARD (CASE STUDIES & EPISTEMIC TRADE-OFFS)

### ​Card 10: A Prompt is an Edit
 
​The prompt-as-edit archetype approaches language as an in-place delta operation performed on an existing artifact. The prompt does not initiate an open generative space; it executes localized operations such as deletions, stylistic substitutions, refactoring, and targeted structural patches.
 
​This model is confirmed in software development workflows and digital image inpainting. A programmer highlights a localized method within an enterprise codebase and enters the prompt: "Refactor this synchronous database query to use connection pooling and an asynchronous pattern, retaining all existing error types." The prompt functions as a precision surgical patch, bound strictly to the syntax of the input code.
 
​The counterexample is the pervasive phenomenon of contextual drift and silent hallucination during natural language text editing. When an author supplies a complex, 5,000-word academic paper and instructs a language model to "change all passive-voice sentences in Section 3 to active voice," the model frequently regenerates the text while subtly altering nuanced claims, deleting parenthetical citations, or hallucinating new literature references in Section 1. Because foundation models regenerate the entire sequence token-by-token rather than executing deterministic, in-place diffs, the metaphor of the surgical edit conceals the fact that the entire artifact is continually re-imagined from scratch.
 
​The edit metaphor makes visible differential workflows, revision mechanics, and the primacy of the pre-existing artifact. It erases the generative architecture of autoregressive systems, which have no innate mechanism for localized state mutation unless enforced by external computational wrappers.

---

## SECTION 2: THE CORE GAME SPECIFICATION

# 10 — EDIT

**The game:**
Something already exists. Language specifies a delta.

**Human role:** editor
**Machine role:** transformer
**Direction of fit:** artifact₀ → instruction → artifact₁
**Valid move:** revision
**Success condition:** requested differences appear and unrequested differences do not.

**Structural diagnosis:**
The edit game has a conservation law:

**Change this. Preserve the rest.**

That second clause is frequently implicit and therefore frequently violated.

**Characteristic trap:**
**Regeneration disguised as mutation.**

**Counter-framing strategy:**
**Make preservation explicit and inspect the delta.**

**Confirming case:**
“Change only the database call in this function. Preserve its interface and error behavior.”

**Breakdown case:**
“Fix the passive voice in section three” quietly changes claims, citations, or material elsewhere.

**What it makes visible:** difference, conservation, revision.

**What it conceals:** how readily generative systems reconstitute the whole while appearing to alter a part.

**Drift trigger:**
When preservation requirements become absolute machine-enforced rules, **Edit → Constraint**.

**Sovereign question:**
**What changed that I did not authorize?**

---

---

## SECTION 3: ANCESTRAL LINEAGE & MIGRATION MAP

# 10 — EDIT

## Lineage

**Revision → textual comparison → edit distance → diff/patch → generative transformation**

### Ancestral formalisms

Editing begins from a conservation problem:

**alter some portion while preserving the rest.**

Computer science gives this an unusually precise lineage.

File-comparison systems represent revision as a delta between two states.

**Myers, 1986** formalizes the shortest edit script through an edit graph and shows the relationship between sequence comparison and minimal transformations.

This is exactly the formal imagination hidden beneath words like:

```text
change
replace
remove
refactor
fix
```

### Migration map

```text
REVISION
→ TEXTUAL DIFFERENCE
→ EDIT DISTANCE
→ DIFF / PATCH
→ STRUCTURED TRANSFORMATION
→ NATURAL-LANGUAGE EDIT
```

### Inherited invariant

Let:

```text
A = original artifact
Δ = authorized change
B = result
```

A true edit wants:

```text
B = A + Δ
```

while minimizing unauthorized:

```text
Δ'
```

### Generative rupture

An autoregressive model may satisfy the requested difference by regenerating much more of the surrounding artifact than the user conceptually authorized.

The formal edit lineage therefore exposes exactly what prompting obscures:

**the complement of the edit is supposed to be conserved.**

### Card inheritance

This card should inherit directly from **diff**, **edit distance**, and **patch**, not primarily from writing advice.

Its governing question becomes:

**Show me the delta.**

### Lineage tags

`#edit-distance #diff #patch #minimal-delta #conservation`

---

---

## SECTION 4: THE FORMAL ECHO & LITERATURE GROUNDING

# 10 — EDIT

### `TEXTUAL VARIANTS → GENETIC CRITICISM → LEVENSHTEIN → MYERS DIFF → VERSION CONTROL → LLM EDIT`

Myers formalizes difference itself as an object: transforming one sequence into another can be represented through a shortest edit script. That is a much stronger ancestor for this card than generic “AI editing.” ([Janelia][12])

```yaml
title: The Politics of the Delta
seed: Editing is defined not only by what changes but by what is conserved; generative rewriting destabilizes that supposedly quiet remainder.

ancestral_thinkers:
  key_sources:
    - "textual criticism traditions"
    - "genetic criticism"
    - "Vladimir Levenshtein — edit distance"
    - "Eugene Myers — difference algorithm"
    - "version-control traditions"
  inherited_lessons:
    - "Variants are evidence."
    - "Revision has a history."
    - "Minimal change can be explicitly represented."
  governing_impressions:
    - "Every edit creates two objects: the new text and the difference."

origin_conditions:
  first_questions:
    - "What changed?"
    - "What was supposed to remain untouched?"
  first_conflicts:
    - "revision vs replacement"
    - "authorized vs unauthorized delta"
  first scenes:
    - "manuscript draft"
    - "diff viewer"
    - "pull request"
  first_methods:
    - "textual comparison"
    - "genetic criticism"
    - "algorithmic difference"
  first_memories:
    - "Preserve the rest is the hidden half of every edit command."

disciplinary_matrix:
  home_fields:
    - "textual scholarship"
    - "computer science"
    - "software engineering"
  adjacent_fields:
    - "writing studies"
    - "HCI"
  key vocabularies:
    - "variant"
    - "delta"
    - "patch"
    - "revision"
  archives_objects:
    - "drafts"
    - "diffs"
    - "commits"
    - "LLM edits"
  explanatory_pressures:
    - "make unrequested changes visible"

epochs:
  - period: "pre-digital–20th century"
    stage: "archival formation"
    locale: "textual and genetic criticism"
    primary_sources:
      - "manuscript scholarship"
    dominant_questions:
      - "How does a work become itself through revision?"
    methods:
      - "variant comparison"
    conceptual_distinctions:
      - "draft/work"
    institutions:
      - "archive"
    writing habits:
      - "forensic"
    tensions:
      - "final text/process"
    influence_weight: 85

  - period: "1960s–1990s"
    stage: "formalization"
    locale: "algorithms and software"
    primary_sources:
      - "Levenshtein"
      - "Myers"
    dominant_questions:
      - "How can difference be represented efficiently?"
    methods:
      - "edit distance"
      - "diff"
    conceptual_distinctions:
      - "source/target"
    institutions:
      - "computer science"
    writing habits:
      - "formal"
    tensions:
      - "minimal edit/semantic edit"
    influence_weight: 100

  - period: "2020s"
    stage: "generative mutation"
    locale: "AI-assisted editing"
    primary_sources:
      - "LLM coding and writing tools"
    dominant_questions:
      - "How do we detect collateral regeneration?"
    methods:
      - "natural-language transformations"
    conceptual_distinctions:
      - "requested/unrequested change"
    institutions:
      - "editors and IDEs"
    writing habits:
      - "inline assistance"
    tensions:
      - "convenience/conservation"
    influence_weight: 100

migration_map:
  - from: "diff"
    to: "generative edit"
    reason: "natural language becomes a revision interface"
    intellectual_shift: "minimal explicit mutation becomes probabilistic reconstitution"

citation_axis:
  core_citations:
    - "Levenshtein"
    - "Myers"
    - "textual criticism"
  shadow_citations:
    - "genetic criticism"
    - "version-control studies"
  adversaries:
    - "final-output-only evaluation"
  possible_syntheses:
    - "genetic criticism + software diff + LLM evaluation"

evidence_stack:
  primary_materials:
    - "before/after artifacts"
    - "token and semantic diffs"
  secondary_materials:
    - "textual scholarship"
    - "algorithmic edit theory"
  research_surfaces:
    - "hidden collateral changes"
    - "commit histories"
  composition_pipeline:
    - "artifact"
    - "authorized delta"
    - "generated revision"
    - "difference audit"

vibe_clusters:
  - "delta-forensics"
  - "genetic-criticism"
mood_families:
  - "precise"
  - "forensic"

idea_jukebox_timeline:
  - year: 1966
    slot: "J1"
    source: "Levenshtein — edit distance"
    why: "Transformation becomes measurable."
  - year: 1986
    slot: "J2"
    source: "Myers — O(ND) difference"
    why: "Minimal edit scripts become computationally practical."
  - year: 1990
    slot: "J3"
    source: "version-control culture"
    why: "The delta becomes a normal unit of accountability."
  - year: 2020
    slot: "J4"
    source: "generative editing"
    why: "The edit interface hides whole-text regeneration."

signature_thesis_ecology:
  dominant_entities:
    - "original"
    - "delta"
    - "revision"
    - "conservation"
  problem_logic: "Generative editing obscures unauthorized change."
  method_logic: "Audit semantic as well as textual deltas."
  archive_logic: "Versions are primary evidence."
  conflict_logic: "edit vs regeneration"
  intervention_logic: "Evaluate preservation, not merely improvement."
  scale_logic: "artifact"
  style_logic: "forensic"
  temporal_logic: "versioned"
  epistemic_logic: "difference is inspectable evidence"
  political_logic: "silent edits undermine human editorial sovereignty"
  symbolic_logic: "change/preserve"

writing_bias:
  output_mode: "paper"
  density: "medium"
  realism_mode: "empirical"
  abstraction_level: "medium"
  intervention_pressure: "high"

tagline: "#diff #genetic-criticism #authorized-delta #editorial-sovereignty"
ttl: 1
```

**RESEARCH ECHO:** Put genetic criticism and version control in the same room. Evaluate AI editing not by whether judges prefer the final document but by whether the system respects the conservation boundary implied by an edit request. Build semantic diffs that classify every changed proposition as requested, necessary collateral, harmless drift or unauthorized mutation. The intervention is an **ethics of the delta: what the user did not ask to change remains under human jurisdiction.** `#diff #authorized-delta #editorial-sovereignty`

---

---

## SECTION 5: THEORY OF THE PROGRAM & COMPUTATIONAL ONTOLOGY

# 10 — EDIT

## <Initial Interpretation>

This is a program for applying an <authorized delta> while preserving the complement.

The hidden requirement of every edit is:

**change this; do not casually change everything else.**

## <Theory Skeleton>

### <entities>

* <artifact₀>
* <selection>
* <edit instruction>
* <authorized delta>
* <preservation set>
* <artifact₁>
* <actual delta>
* <collateral change>

### [operations]

* [select]
* [compare]
* [transform]
* [preserve]
* [diff]
* [validate]
* [accept]
* [revert]

### <states>

```text
original
→ edit request
→ candidate revision
→ delta inspection
→ accepted | rejected | repaired
```

### <constraints>

Unrequested changes require justification.

### <invariants>

```text
∀x ∈ preservation_set:
artifact₀(x) = artifact₁(x)
```

unless explicitly authorized otherwise.

## <Assumption Ledger>

<safe> Editing implies conservation.

<safe> Before/after comparison is valuable evidence.

<uncertain> Semantic equivalence can always be measured automatically.

<requires-user-decision> Which collateral transformations are acceptable when required by coherence?

## <Operational Description>

```text
<artifact₀>
+
<authorized delta>
[should-produce]
<artifact₁>

<artifact₀, artifact₁>
[produce]
<actual delta>

<actual delta>
[is-compared-with]
<authorized delta>
```

## <Failure Description>

### Silent regeneration

Large regions change without permission.

Response:

Expose the full delta before acceptance.

### Preservation failure

Citations, behavior, formatting or claims disappear.

Response:

Reject or repair.

### Local fix, global contradiction

The requested change creates downstream inconsistency.

Response:

Surface dependent consequences rather than silently rewriting them.

## <Change Test>

If preservation requirements become mechanically guaranteed, <Edit> approaches <Constraint>.

If the artifact does not yet exist and the user delegates its production broadly, <Edit> becomes <Commission>.

## <Residual Human Theory>

Humans know that some changes are “the same idea said better” and others alter substance. That distinction remains partly interpretive.

---

---

## SECTION 6: RESIDUAL HUMAN THEORY (THE IRREDUCIBLE STAKES)

# 10 — EDIT

## PURPOSE

Apply an authorized delta while conserving everything outside it.

```text
ENTITY(original artifact)
+
ENTITY(authorized delta)
OP(produces)
ENTITY(revised artifact)
```

## ENTITIES

`ENTITY(original)`
`ENTITY(selection)`
`ENTITY(edit instruction)`
`ENTITY(authorized delta)`
`ENTITY(preservation set)`
`ENTITY(revision)`
`ENTITY(collateral change)`

## OPERATIONS

`OP(select)`
`OP(transform)`
`OP(preserve)`
`OP(diff)`
`OP(validate)`
`OP(revert)`

## INVARIANT

For every element outside the authorized delta:

```text
ENTITY(original state)
=
ENTITY(revised state)
```

unless explicitly justified.

## STATE FLOW

```text
original
→ edit request
→ candidate revision
→ delta inspection
→ accepted | repaired | rejected
```

## FAILURE

**Regeneration disguised as edit.**

**Silent collateral change.**

SYSTEM RESPONSE:

```text
OP(show)
ENTITY(actual delta)
```

before acceptance.

## DRIFT

Edit → Constraint when preservation requirements become hard guarantees.

## SOVEREIGN QUESTION

**What changed that I did not authorize?**

---

---

## SECTION 7: PLAY DYNAMICS, PUZZLE & FUN THEORY

# 10 — EDIT

## THE FUN IS FINDING THE MINIMUM CHANGE

### Cognitive puzzle

The player learns to transform one thing while preserving everything that gives it identity.

### PATTERNS

`PATTERN(original)`
`PATTERN(target difference)`
`PATTERN(conservation)`
`PATTERN(dependency)`
`PATTERN(collateral effect)`

### LEARNING

`LEARN(isolate cause)`
`LEARN(change minimally)`
`LEARN(compare versions)`
`LEARN(preserve dependencies)`
`LEARN(repair collateral damage)`

### POSSIBILITY SPACE

```text
SPACE{
minimal fix,
overcorrection,
hidden dependency,
regression,
elegant transformation,
local fix/global failure
}
```

### OPTIMAL PATH

The player will search for the smallest possible delta.

That remains interesting only while “smallest” and “best” are not identical.

### BOREDOM THRESHOLD

Editing dies when every requested transformation has a known one-click operation.

### LEARNING TRANSITION

```text
whole artifact
→ dependency recognition
→ target isolation
→ minimal intervention
→ conservation mastery
```

### FAILURE

If every edit unexpectedly breaks unrelated things, the system feels arbitrary.

If every edit is perfectly local, there is no systems reasoning.

### ARTISTIC OPENING

Sometimes the best edit is not minimal.

It changes one thing and reveals that the surrounding form was wrong too.

### EXPERIENCE DESIGN

Make dependencies visible enough to infer but not fully explicit.

The player learns the structure by observing what moves when one part changes.

### RESIDUAL HUMAN ELEMENT

The question “Is this still the same work?” remains interpretive.

---

