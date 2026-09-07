# LANGUAGE GAME 08: COMMISSION

> **Origin:** Extracted from [`WAYS TO WRITE/builders-games.md`](file:///Users/gaia/WORLDFUL/WAYS%20TO%20WRITE/builders-games.md)  
> **Part of:** The Twelve Language Games of Generative Systems  

---

## SECTION 1: THE EMPIRICAL CARD (CASE STUDIES & EPISTEMIC TRADE-OFFS)

### ​Card 8: A Prompt is a Commission
 
​Under the archetype of the commission, the prompter operates as an artistic patron or commercial client, defining themes, broad requirements, and aesthetic parameters, while delegating the entire mechanical, stylistic, and formal execution to an external producer.
 
​The definitive confirming precedent is found in the administrative jurisprudence of the United States Copyright Office regarding generative artificial intelligence. In its landmark decision refusing copyright registration for Jason Allen’s Midjourney-generated image *Théâtre D’opéra Spatial*, the Copyright Review Board affirmed that prompting is legally equivalent to commissioning an independent commercial artist. Although Allen argued that he had refined the image through at least 624 iterative text prompts and localized Photoshop edits, the Office ruled that human authorship requires direct mechanical control over the expressive elements of the resulting work. Supplying a text prompt, the Office concluded, merely conveys an idea or commission; the machine remains the non-human entity executing the expression. 
 
​The counterexample emerged in the corporate defense mounted by Air Canada before the British Columbia Civil Resolution Tribunal in *Moffatt v. Air Canada* (2024 BCCRT 149). A bereaved customer had relied on the airline’s website chatbot, which provided inaccurate instructions regarding the retroactive application for bereavement fares. In court, Air Canada argued that it should not be held liable for negligent misrepresentation because the chatbot was an autonomous entity—in effect, an independent subcontractor or separate legal entity responsible for its own output. The tribunal rejected this defense, noting that a commercial software tool remains an extension of the deploying enterprise, which bears strict legal responsibility for its representations. 
 
​The commission metaphor accurately reveals the managerial, executive distance between the prompter’s intent and the generative output. It erases, however, the non-human ontology of the model: an AI system lacks legal personhood, moral agency, and economic incentives, rendering any direct legal analogy between generative computation and human employment contracts structurally flawed.

---

## SECTION 2: THE CORE GAME SPECIFICATION

# 08 — COMMISSION

**The game:**
One party specifies desired qualities while another produces the artifact.

**Human role:** patron / client
**Machine role:** producer
**Direction of fit:** brief → artifact
**Valid move:** commission
**Success condition:** the artifact satisfies the brief sufficiently for acceptance.

**Structural diagnosis:**
The commission separates intentional authorship from material execution.

**Characteristic trap:**
**Agency outsourcing.** Responsibility follows whichever metaphor is convenient.

When authorship is valuable, the human claims control.

When liability appears, the machine suddenly becomes autonomous.

**Counter-framing strategy:**
**Collapse the proxy.** Trace authority back to the deploying human or institution.

**Confirming case:**
“Produce three poster concepts using this title, these dimensions, and this visual language.”

**Breakdown case:**
“The chatbot said it, not us.”

No. The organization deployed the speaking apparatus.

**What it makes visible:** delegation, patronage, executive distance.

**What it conceals:** responsibility chains.

**Drift trigger:**
When the patron begins modifying specific parts of the returned artifact, **Commission → Edit**.

**Sovereign question:**
**Who gets credit when this works, and who suddenly disappears when it fails?**

---

---

## SECTION 3: ANCESTRAL LINEAGE & MIGRATION MAP

# 08 — COMMISSION

## Lineage

**Patronage → delegated production → principal/agent relation → copyright authorship → generative commission**

### Ancestral formalisms

The commission game predates computing by centuries.

A patron can specify subject, purpose, material, scale, audience, or aesthetic requirements without directly placing every mark.

That division between **conception, direction, and execution** becomes unstable once copyright asks who actually supplied the protectable expression.

The U.S. Copyright Office’s **2023 *Théâtre D’opéra Spatial* decision** documents Jason Allen’s iterative use of at least 624 prompts and distinguishes his human Photoshop contributions from Midjourney-generated content. The Office’s question is whether traditional elements of authorship were actually produced by the human.

Its reasoning also reaches backward to the nineteenth-century photography case **Burrow-Giles v. Sarony**, asking whether expressive elements reflect a human’s original mental conception given visible form.

Important:

**“commission” is our analytic bridge. It is not the Office’s legal label for prompting.**

Then the lineage forks into institutional responsibility.

In **Moffatt v. Air Canada**, the tribunal rejected the idea that a company could distance itself from its chatbot as though the chatbot were a separate legal entity; it remained part of Air Canada’s website.

### Migration map

```text
PATRON
→ COMMISSION
→ DELEGATED EXECUTION
→ AUTHORSHIP DOCTRINE
→ GENERATIVE PRODUCTION
→ DEPLOYER RESPONSIBILITY
```

### Inherited invariant

The Commission game always raises two separable questions:

```text
Who specified?
Who produced?
Who answers for the result?
```

### Generative rupture

AI makes it tempting to move agency opportunistically.

```text
success → "I made it"
failure → "the AI did it"
```

The card should refuse that sliding attribution.

### Card inheritance

The real lineage is:

**patronage → authorship → agency → deployment liability**

not simply “prompt = hiring an artist.”

### Lineage tags

`#patronage #delegated-production #human-authorship #agency #deployer-liability`

---

---

## SECTION 4: THE FORMAL ECHO & LITERATURE GROUNDING

# 08 — COMMISSION

### `PATRONAGE → ART WORLD → DISTRIBUTED AGENCY → AUTHORSHIP LAW → GENERATIVE DELEGATION`

The Copyright Office’s Allen decision is especially useful if handled precisely: it records at least 624 prompt iterations, acknowledges that prompting itself can involve creativity, but distinguishes that creativity from control over the expressive elements produced by Midjourney. It does **not** establish “prompting = commissioning an artist.” ([U.S. Copyright Office][9])

```yaml
title: Delegated Making, Distributed Responsibility
seed: A commission separates desired outcome, expressive execution, authorship, ownership and responsibility—relations generative AI makes newly unstable rather than newly invented.

ancestral_thinkers:
  key_sources:
    - "Michael Baxandall — Patterns of Intention"
    - "Howard Becker — Art Worlds"
    - "Bruno Latour — delegation to artifacts"
    - "Alfred Gell — Art and Agency"
    - "Burrow-Giles Lithographic Co. v. Sarony"
    - "U.S. Copyright Office — Théâtre D’opéra Spatial"
  inherited_lessons:
    - "Artistic production already distributes labor."
    - "Agency and authorship need not map cleanly onto physical execution."
    - "Responsibility cannot be inferred from who touched the artifact last."
  governing_impressions:
    - "The interesting object is the chain of delegation."

origin_conditions:
  first_questions:
    - "Who made the work?"
    - "Who specified it?"
    - "Who answers for it?"
  first_conflicts:
    - "intention vs execution"
    - "agency vs authorship"
    - "credit vs liability"
  first scenes:
    - "patron's brief"
    - "artist's workshop"
    - "copyright proceeding"
  first_methods:
    - "sociology of art"
    - "legal analysis"
    - "STS"
  first_memories:
    - "Success centralizes authorship; failure suddenly distributes it."

disciplinary_matrix:
  home_fields:
    - "art sociology"
    - "copyright"
    - "STS"
  adjacent_fields:
    - "AI ethics"
    - "organizational studies"
  key vocabularies:
    - "delegation"
    - "authorship"
    - "agency"
    - "responsibility"
  archives_objects:
    - "briefs"
    - "prompt histories"
    - "legal decisions"
    - "deployment records"
  explanatory_pressures:
    - "keep credit and liability on the same map"

epochs:
  - period: "pre-digital"
    stage: "historical formation"
    locale: "patronage and artistic workshops"
    primary_sources:
      - "art commissions"
    dominant_questions:
      - "How is making distributed?"
    methods:
      - "art history"
    conceptual_distinctions:
      - "patron/artist/artisan"
    institutions:
      - "workshop"
      - "museum"
    writing habits:
      - "historical reconstruction"
    tensions:
      - "conception/execution"
    influence_weight: 85

  - period: "1980s–2000s"
    stage: "theoretical redistribution"
    locale: "art sociology and STS"
    primary_sources:
      - "Becker"
      - "Baxandall"
      - "Latour"
      - "Gell"
    dominant_questions:
      - "Where does agency reside in collective production?"
    methods:
      - "network and relational analysis"
    conceptual_distinctions:
      - "individual/collective"
    institutions:
      - "STS and anthropology"
    writing habits:
      - "relational analysis"
    tensions:
      - "romantic author/production network"
    influence_weight: 95

  - period: "2023–present"
    stage: "legal collision"
    locale: "generative AI"
    primary_sources:
      - "Copyright Office AI decisions"
      - "deployment-liability cases"
    dominant_questions:
      - "Which human contributions count as authorship and responsibility?"
    methods:
      - "case analysis"
    conceptual_distinctions:
      - "prompt/generated expression"
    institutions:
      - "courts and agencies"
    writing habits:
      - "administrative reasoning"
    tensions:
      - "control/delegation"
    influence_weight: 100

migration_map:
  - from: "commission"
    to: "generative delegation"
    reason: "nonhuman systems produce substantial expressive detail"
    intellectual_shift: "old distributed-making questions enter a system without legal personhood"

citation_axis:
  core_citations:
    - "Becker"
    - "Baxandall"
    - "Gell"
    - "Copyright Office"
  shadow_citations:
    - "Latour"
    - "Suchman — Agencies at the Interface"
  adversaries:
    - "romantic solitary authorship"
    - "AI-as-independent-contractor fiction"
  possible_syntheses:
    - "art worlds + deployer accountability"

evidence_stack:
  primary_materials:
    - "prompt histories"
    - "generated artifacts"
    - "legal records"
  secondary_materials:
    - "art sociology"
    - "copyright scholarship"
  research surfaces:
    - "credit statements"
    - "terms of service"
    - "liability defenses"
  composition_pipeline:
    - "brief"
    - "delegation"
    - "execution"
    - "selection"
    - "attribution"
    - "responsibility"

vibe_clusters:
  - "distributed-agency"
  - "authorship-forensics"
mood_families:
  - "forensic"
  - "combative"

idea_jukebox_timeline:
  - year: 1884
    slot: "H1"
    source: "Burrow-Giles v. Sarony"
    why: "Copyright ties authorship to human creative conception made visible."
  - year: 1982
    slot: "H2"
    source: "Becker — Art Worlds"
    why: "The solitary artist dissolves into cooperative production."
  - year: 1998
    slot: "H3"
    source: "Gell — Art and Agency"
    why: "Agency becomes relational rather than simply possessed."
  - year: 2023
    slot: "H4"
    source: "Théâtre D’opéra Spatial decision"
    why: "Iterative prompting collides with legal tests of expressive control."

signature_thesis_ecology:
  dominant_entities:
    - "principal"
    - "producer"
    - "artifact"
    - "deployer"
  problem_logic: "Generative AI encourages opportunistic switching between tool and agent metaphors."
  method_logic: "Trace delegation rather than accepting labels."
  archive_logic: "Process evidence and institutional responsibility matter."
  conflict_logic: "credit vs accountability"
  intervention_logic: "Make attribution symmetrical across success and failure."
  scale_logic: "network"
  style_logic: "forensic"
  temporal_logic: "genealogical"
  epistemic_logic: "control must be demonstrated in process"
  political_logic: "agency metaphors allocate ownership and liability"
  symbolic_logic: "specification/execution/responsibility"

writing_bias:
  output_mode: "paper"
  density: "dense"
  realism_mode: "empirical"
  abstraction_level: "high"
  intervention_pressure: "high"

tagline: "#art-worlds #delegation #human-authorship #responsibility"
ttl: 1
```

Air Canada gives the complementary responsibility case: the organization was held responsible for misleading information from the chatbot on its website rather than escaping through the fiction of an autonomous speaking entity. ([Deeth Williams Wall][10])

**RESEARCH ECHO:** Do not ask whether prompting makes the user “the author” in the abstract. Reconstruct the production network: specification, generation, curation, editing, deployment, ownership and liability. Put Becker’s art world and Gell’s distributed agency beside the Copyright Office and institutional chatbot cases. The intervention is to show that **generative AI does not abolish human agency; it makes the strategic placement of agency newly contestable.** `#art-worlds #delegation #human-authorship #responsibility`

---

---

## SECTION 5: THEORY OF THE PROGRAM & COMPUTATIONAL ONTOLOGY

# 08 — COMMISSION

## <Initial Interpretation>

This is a program for managing **delegated production without erasing the chain of agency**.

The central object is not the artifact.

It is the <delegation graph>.

## <Theory Skeleton>

### <entities>

* <principal>
* <brief>
* <producer>
* <artifact>
* <requirement>
* <selection>
* <revision>
* <credit>
* <responsibility>
* <deployment>

### [operations]

* [commission]
* [delegate]
* [produce]
* [select]
* [reject]
* [revise]
* [attribute]
* [deploy]
* [answer-for]

### <states>

```text
brief
→ delegated production
→ candidate artifact
→ accepted | revised | rejected
→ deployment
→ consequence
```

### <constraints>

Credit and responsibility cannot be independently reassigned solely according to outcome.

### <invariants>

```text
<agency chain>
[must-remain-traceable-through]
<artifact lifecycle>
```

## <Assumption Ledger>

<safe> Specification and execution can be distributed.

<safe> Deployment is itself an agentive act.

<uncertain> Existing authorship concepts map cleanly onto generative production.

<requires-user-decision> Which interventions count as sufficient control for credit in the specific domain?

## <Operational Description>

```text
<principal>
[defines]
<brief>

<producer>
[realizes]
<candidate artifact>

<principal>
[selects-or-revises]
<candidate artifact>

<accepted artifact>
[is-deployed-by]
<responsible actor>

<consequence>
[traces-back-through]
<delegation graph>
```

## <Failure Description>

### Agency laundering

Success is claimed by the human; failure is attributed to the machine.

Response:

Use the same delegation graph for both.

### Invisible production

Material transformations between brief and artifact are hidden.

Response:

Preserve process history.

### Responsibility gap

No actor claims accountability.

Response:

Trace to deployment authority.

## <Change Test>

If the principal begins making local changes, <Commission> becomes <Edit>.

If production unfolds through exploratory reciprocal turns, <Commission> may become <Conversation>.

## <Residual Human Theory>

Credit, responsibility and authorship are normative judgments, not merely computational provenance fields.

---

---

## SECTION 6: RESIDUAL HUMAN THEORY (THE IRREDUCIBLE STAKES)

# 08 — COMMISSION

## PURPOSE

Delegate production while preserving the chain of agency.

```text
ENTITY(principal)
OP(defines)
ENTITY(brief)

ENTITY(producer)
OP(realizes)
ENTITY(artifact)
```

## ENTITIES

`ENTITY(principal)`
`ENTITY(brief)`
`ENTITY(producer)`
`ENTITY(artifact)`
`ENTITY(selection)`
`ENTITY(credit)`
`ENTITY(responsibility)`
`ENTITY(deployment)`

## OPERATIONS

`OP(commission)`
`OP(delegate)`
`OP(produce)`
`OP(select)`
`OP(revise)`
`OP(attribute)`
`OP(deploy)`

## INVARIANT

```text
ENTITY(agency chain)
OP(remains traceable through)
ENTITY(artifact lifecycle)
```

Credit and responsibility stay on the same map.

## STATE FLOW

```text
brief
→ production
→ candidate artifact
→ accepted | revised | rejected
→ deployment
→ consequence
```

## FAILURE

**Agency laundering:**

```text
success → "I made it"
failure → "the AI did it"
```

**Responsibility gap:** every actor points elsewhere.

## DRIFT

Commission → Edit when the principal begins changing localized portions of the artifact.

## SOVEREIGN QUESTION

**Who gets credit when this works, and who disappears when it fails?**

---

---

## SECTION 7: PLAY DYNAMICS, PUZZLE & FUN THEORY

# 08 — COMMISSION

## THE FUN IS DELEGATING WITHOUT LOSING CONTROL

### Cognitive puzzle

The player learns how much specification is necessary to get another producer to make something worth keeping.

### PATTERNS

`PATTERN(brief)`
`PATTERN(delegate)`
`PATTERN(interpretation)`
`PATTERN(selection)`
`PATTERN(responsibility)`

### LEARNING

`LEARN(specify)`
`LEARN(delegate)`
`LEARN(curate)`
`LEARN(revise)`
`LEARN(attribute consequences)`

### POSSIBILITY SPACE

```text
SPACE{
faithful artifact,
literal artifact,
surprising artifact,
misread brief,
productive misunderstanding,
unusable artifact
}
```

### OPTIMAL PATH

The player searches for the perfect brief that eliminates revision.

If achieved, the commission collapses toward Instruction.

### BOREDOM THRESHOLD

There is no interesting delegation when the producer adds nothing.

### LEARNING TRANSITION

```text
overcontrol
→ delegation
→ surprise
→ selective trust
→ calibrated brief
```

### FAILURE

Random output destroys meaningful authorship.

Perfect obedience destroys delegation.

### ARTISTIC OPENING

The producer should sometimes return something better precisely because it misunderstands part of the brief.

### EXPERIENCE DESIGN

Success is not measured only by fidelity.

Reward the player's ability to recognize valuable deviation.

### RESIDUAL HUMAN ELEMENT

Taste remains irreducible:

**When is disobedience better than compliance?**

---

