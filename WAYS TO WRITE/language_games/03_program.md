# LANGUAGE GAME 03: PROGRAM

> **Origin:** Extracted from [`WAYS TO WRITE/builders-games.md`](file:///Users/gaia/WORLDFUL/WAYS%20TO%20WRITE/builders-games.md)  
> **Part of:** The Twelve Language Games of Generative Systems  

---

## SECTION 1: THE EMPIRICAL CARD (CASE STUDIES & EPISTEMIC TRADE-OFFS)

### ​Card 3: A Prompt is a Program
 
​The prompt-as-program archetype posits natural language as a high-level, interpreted programming code executed on a soft virtual machine. The prompt defines state variables, functional transformations, branches, and termination conditions, exhibiting a double direction of fit wherein the linguistic declaration brings its operational framework into computational existence. 
 
​This archetype is best exemplified by formal prompt-pattern engineering frameworks, such as the pattern catalogs established by Jules White and colleagues. Through structural configurations like the Flipped Interaction Pattern—where the model is instructed to take the initiative by interviewing the user until a specific data structure is fulfilled—or Meta-Language Creation, natural language mimics formal computing architectures. Users can define synthetic domain-specific notations that the model reliably parses and executes across multi-turn sessions. 
 
​The most embarrassing failure of this metaphor is the universal vulnerability of foundation models to prompt injection. In classic computing architectures following the von Neumann model, instructions and data can be segregated through hardware access controls and distinct memory segments. In an autoregressive transformer, however, instructions and data are tokenized into the exact same sequence. When external data containing subversive commands is processed, the model cannot maintain the boundary between its control flow and its operational payload, demonstrating that natural language lacks the formal encapsulation essential to true software execution. 
 
​While the program metaphor clarifies the structured, algorithmic capabilities of in-context learning, it entirely erases the absence of formal verification, memory safety, and logical determinism inherent to probabilistic token prediction.

---

## SECTION 2: THE CORE GAME SPECIFICATION

# 03 — PROGRAM

**The game:**
Language establishes temporary operational rules.

**Human role:** language designer
**Machine role:** interpreter
**Direction of fit:** declaration ↔ execution
**Valid move:** rule definition
**Success condition:** later moves behave according to the declared system.

**Structural diagnosis:**
Prompt-as-program works by creating a provisional machine inside another machine.

**Characteristic trap:**
**Syntax theater.** XML tags, JSON, capital letters, or pseudocode can resemble formal computation without possessing formal guarantees.

**Counter-framing strategy:**
**Separate inscription from enforcement.** Ask which rules are merely described and which are mechanically guaranteed outside the model.

**Confirming case:**

```text
Ask exactly one question at a time.
Maintain three state variables.
Stop when all three are resolved.
```

**Breakdown case:**
Untrusted input can alter the very rules supposedly governing its interpretation.

That is not a minor bug. It exposes the missing program/data boundary.

**What it makes visible:** state, control flow, modularity.

**What it conceals:** lack of verification, memory protection, determinism.

**Drift trigger:**
When the rules become hard boundaries enforced by the runtime, **Program → Constraint**.

**Sovereign question:**
**Which part of this system is law, and which part merely says “law”?**

---

---

## SECTION 3: ANCESTRAL LINEAGE & MIGRATION MAP

# 03 — PROGRAM

## Lineage

**Formal rule system → programming language → DSL → pattern language → prompt program**

### Ancestral formalisms

Programming makes inscriptions executable by restricting syntax, semantics, state, and legal operations.

The crucial historical move is not “writing instructions to computers.”

It is creating a language whose expressions participate in a **formal execution regime**.

Prompting inherits this imagination.

**Winograd’s SHRDLU** already blurred natural language and procedural execution inside a bounded domain.

**Software pattern languages** later provided reusable structural solutions rather than one-off programs.

**White et al., 2023**, explicitly carry that pattern tradition into prompt engineering, describing prompt patterns as reusable structures and arguing that prompts can function as a form of programming.

### Migration map

```text
FORMAL LANGUAGE
→ PROGRAM
→ DOMAIN-SPECIFIC LANGUAGE
→ SOFTWARE PATTERN
→ PROMPT PATTERN
→ DECLARATIVE PROMPT ARCHITECTURE
```

### Inherited invariant

Declared rules should remain valid across later operations.

```text
R = rule set
M₀ ... Mₙ = subsequent moves

∀Mᵢ : execution(Mᵢ) respects R
```

### Generative rupture

A prompt can *describe* a type system, state machine, hierarchy, or protocol without actually possessing one.

That yields the fundamental distinction:

```text
RULE AS TEXT
≠
RULE AS ENFORCEMENT
```

Prompt injection is devastating to the program metaphor precisely because control language and content can enter the same interpretive stream without an intrinsic privilege boundary.

### Card inheritance

This is where POML belongs historically:

not “fancy prompting,” but a contemporary attempt to recover properties lost when executable structure was poured back into unrestricted prose.

### Lineage tags

`#formal-language #dsl #pattern-language #soft-programming #declarative-runtime`

---

---

## SECTION 4: THE FORMAL ECHO & LITERATURE GROUNDING

# 03 — PROGRAM

### `FORMAL LANGUAGE → THEORY-BUILDING → PATTERN LANGUAGE → PROMPT PATTERN → POML`

White and colleagues explicitly frame prompts as a form of programming and import the software-pattern tradition into prompt engineering. ([arXiv][4])

```yaml
title: Soft Programs, Hard Pretensions
seed: Prompt programming imports the aspiration of software execution into a medium whose semantics remain contextual, probabilistic, and renegotiable.

ancestral_thinkers:
  key_sources:
    - "Alan Turing — computation"
    - "Peter Naur — Programming as Theory Building"
    - "Christopher Alexander — A Pattern Language"
    - "Winograd — procedural natural language"
    - "Jules White et al. — Prompt Pattern Catalog"
  inherited_lessons:
    - "Programs establish repeatable operational relations."
    - "Programming practice exceeds program text."
    - "Patterns carry reusable operational knowledge."
  governing_impressions:
    - "A prompt program is code whose compiler can argue with you."

origin_conditions:
  first_questions:
    - "When does natural language become executable?"
    - "What survives when syntax is formal-looking but semantics are soft?"
  first_conflicts:
    - "description vs enforcement"
    - "program text vs programmer theory"
  first scenes:
    - "compiler"
    - "pattern catalog"
    - "structured prompt"
  first_methods:
    - "programming-language design"
    - "software studies"
    - "pattern analysis"
  first_memories:
    - "Angle brackets can describe a law without making one."

disciplinary_matrix:
  home_fields:
    - "software engineering"
    - "programming languages"
    - "AI"
  adjacent_fields:
    - "media studies"
    - "philosophy of computation"
  key vocabularies:
    - "syntax"
    - "semantics"
    - "state"
    - "pattern"
    - "runtime"
  archives_objects:
    - "prompt templates"
    - "POML"
    - "system prompts"
  explanatory pressures:
    - "separate structural legibility from actual enforcement"

epochs:
  - period: "1930s–1980s"
    stage: "formalization"
    locale: "computation and programming"
    primary_sources:
      - "Turing"
      - "Naur"
    dominant_questions:
      - "What makes a symbolic procedure executable?"
    methods:
      - "formalization"
      - "programming practice"
    conceptual_distinctions:
      - "program/text"
      - "syntax/semantics"
    institutions:
      - "computer science"
    writing habits:
      - "formal and reflective"
    tensions:
      - "formal object vs tacit theory"
    influence_weight: 95

  - period: "1977–2000"
    stage: "pattern formation"
    locale: "architecture and software design"
    primary_sources:
      - "Alexander"
      - "software pattern movement"
    dominant_questions:
      - "How does reusable design knowledge travel?"
    methods:
      - "pattern languages"
    conceptual_distinctions:
      - "instance/pattern"
    institutions:
      - "software engineering"
    writing habits:
      - "catalog"
    tensions:
      - "generality/context"
    influence_weight: 85

  - period: "2023–present"
    stage: "migration"
    locale: "LLM prompting"
    primary_sources:
      - "White et al."
      - "structured prompting"
    dominant_questions:
      - "Can conversational language function as code?"
    methods:
      - "prompt patterns"
      - "declarative scaffolds"
    conceptual_distinctions:
      - "soft rule/hard rule"
    institutions:
      - "LLM engineering"
    writing habits:
      - "recipes and schemas"
    tensions:
      - "program appearance vs probabilistic execution"
    influence_weight: 100

migration_map:
  - from: "software pattern"
    to: "prompt pattern"
    reason: "reusable interaction structures migrate into LLM control"
    intellectual_shift: "deterministic implementation becomes contextual interpretation"

citation_axis:
  core_citations:
    - "Naur"
    - "Alexander"
    - "White et al."
  shadow_citations:
    - "Brian Cantwell Smith"
    - "Lucy Suchman"
  adversaries:
    - "the assumption that formal-looking markup produces formal semantics"
  possible_syntheses:
    - "software studies + prompt architecture"

evidence_stack:
  primary_materials:
    - "structured prompts"
    - "execution traces"
    - "injection failures"
  secondary_materials:
    - "programming-language theory"
    - "software patterns"
  research surfaces:
    - "prompt schemas"
    - "repair loops"
  composition_pipeline:
    - "declared rule"
    - "execution"
    - "violation"
    - "external enforcement"

vibe_clusters:
  - "soft-programming"
  - "declarative-rigor"
mood_families:
  - "austere"
  - "forensic"

idea_jukebox_timeline:
  - year: 1985
    slot: "C1"
    source: "Naur — Programming as Theory Building"
    why: "Program text is insufficient to explain programming practice."
  - year: 1977
    slot: "C2"
    source: "Alexander — A Pattern Language"
    why: "Reusable structures carry situated design intelligence."
  - year: 2023
    slot: "C3"
    source: "White et al. — Prompt Pattern Catalog"
    why: "Prompting explicitly claims programming lineage."
  - year: 2026
    slot: "C4"
    source: "declarative prompt architectures"
    why: "Structure attempts to restore inspectability to soft execution."

signature_thesis_ecology:
  dominant_entities:
    - "rule"
    - "runtime"
    - "state"
    - "schema"
  problem_logic: "Prompt programs inherit the rhetoric of code without all of code's guarantees."
  method_logic: "Trace declared rules against actual model behavior."
  archive_logic: "Use prompts plus execution traces."
  conflict_logic: "inscription vs enforcement"
  intervention_logic: "Define a category of soft programs rather than pretending prose is code."
  scale_logic: "micro-to-architecture"
  style_logic: "diagrammatic"
  temporal_logic: "genealogical"
  epistemic_logic: "rules count only insofar as violations are detectable"
  political_logic: "formal appearance can conceal discretionary execution"
  symbolic_logic: "rule/runtime"

writing_bias:
  output_mode: "dissertation chapter"
  density: "dense"
  realism_mode: "hybrid"
  abstraction_level: "very high"
  intervention_pressure: "high"

tagline: "#soft-program #pattern-language #poml #runtime-gap"
ttl: 1
```

**RESEARCH ECHO:** Put Naur’s claim that programming is theory-building beside prompt-pattern catalogs and declarative prompt markup. Treat every role tag, state declaration and nested rule as a claim about a runtime, then test where the supposed runtime fails to exist. Compare rules enforced by prose with rules enforced by parsers, validators and decoders. The intervention is a theory of **soft programming: operational language that behaves enough like code to be useful and unlike code exactly where its failures become intellectually interesting.** `#soft-program #pattern-language #runtime-gap`

---

---

## SECTION 5: THEORY OF THE PROGRAM & COMPUTATIONAL ONTOLOGY

# 03 — PROGRAM

## <Initial Interpretation>

This is a program whose subject is **the creation of temporary executable law**.

The problem is not whether natural language can resemble code.

The problem is which declared relationships actually govern later transitions.

## <Theory Skeleton>

### <entities>

* <rule>
* <state>
* <variable>
* <procedure>
* <scope>
* <input>
* <output>
* <runtime>
* <interpreter>
* <exception>

### [operations]

* [declare]
* [bind]
* [parse]
* [evaluate]
* [transition]
* [branch]
* [repeat]
* [terminate]
* [validate]

### <states>

```text
uninitialized
→ configured
→ executing
→ suspended | completed | violated
```

### <constraints>

A <rule> that can be freely ignored by the interpreter is not equivalent to an enforced computational constraint.

### <invariants>

```text
<declared semantics>
[must-remain-consistent-across]
<execution>
```

And:

```text
<data>
[must-not-silently-redefine]
<runtime semantics>
```

## <Assumption Ledger>

<safe> Natural language can establish repeatable operational patterns.

<safe> Declarative structure can improve inspectability.

<uncertain> A probabilistic interpreter can preserve rule semantics reliably across arbitrary contexts.

<requires-user-decision> Which rules must be externalized into deterministic enforcement?

## <Operational Description>

```text
<program specification>
[defines]
{roles, state, rules, termination}

<input>
[enters]
<runtime>

<runtime>
[applies]
<rules>

<state>
[transitions-to]
<new state>

<new state>
[determines]
<available next operations>
```

## <Failure Description>

### Rule/data collapse

Material being processed contains apparent control instructions.

Response:

Maintain explicit provenance and privilege boundaries outside generative interpretation.

### Semantic drift

The model gradually changes what a declared term means.

Response:

Revalidate state against an external schema.

### Nontermination

Recursive instruction continues indefinitely.

Response:

Termination belongs to the runtime, not merely to prose.

## <Change Test>

If the rules become mathematically impossible to violate, <Program> drifts toward <Constraint>.

If the rules are mainly temporary norms negotiated turn by turn, <Program> drifts toward <Conversation>.

## <Residual Human Theory>

A program description does not contain the programmer’s whole theory of the activity. Future maintainers must understand why the rules exist, not merely what the tags say.

---

---

## SECTION 6: RESIDUAL HUMAN THEORY (THE IRREDUCIBLE STAKES)

# 03 — PROGRAM

## PURPOSE

Create temporary operational law.

```text
ENTITY(specification)
OP(defines)
GROUP{state, rules, transitions}
```

## ENTITIES

`ENTITY(rule)`
`ENTITY(state)`
`ENTITY(variable)`
`ENTITY(scope)`
`ENTITY(runtime)`
`ENTITY(input)`
`ENTITY(output)`

## OPERATIONS

`OP(declare)`
`OP(bind)`
`OP(evaluate)`
`OP(branch)`
`OP(transition)`
`OP(terminate)`
`OP(validate)`

## INVARIANT

```text
ENTITY(rule)
OP(remains stable across)
ENTITY(execution)
```

And:

```text
ENTITY(data)
OP(cannot silently redefine)
ENTITY(runtime semantics)
```

## STATE FLOW

```text
uninitialized
→ configured
→ executing
→ completed | violated | suspended
```

## FAILURE

**Syntax theater:** markup looks formal but nothing enforces it.

**Rule/data collapse:** payload rewrites control logic.

## DRIFT

Program → Constraint when violating a rule becomes mechanically impossible.

## SOVEREIGN QUESTION

**Which part is law, and which part merely says “law”?**

---

---

## SECTION 7: PLAY DYNAMICS, PUZZLE & FUN THEORY

# 03 — PROGRAM

## THE FUN IS DISCOVERING WHAT THE RULES REALLY DO

### Cognitive puzzle

The player learns the operational semantics beneath declared rules.

### PATTERNS

`PATTERN(rule)`
`PATTERN(state)`
`PATTERN(scope)`
`PATTERN(exception)`
`PATTERN(runtime behavior)`

### LEARNING

`LEARN(predict transitions)`
`LEARN(exploit loopholes)`
`LEARN(discover precedence)`
`LEARN(build abstractions)`
`LEARN(find emergent behavior)`

### POSSIBILITY SPACE

```text
SPACE{
valid execution,
unexpected interaction,
rule collision,
loophole,
recursion,
exception,
state corruption
}
```

### OPTIMAL PATH

Players will attempt to compile the entire system mentally into:

```text
input
→ known output
```

Once complete prediction becomes possible, the game becomes tic-tac-toe.

### BOREDOM THRESHOLD

The rule system is solved when no interaction between rules can surprise the player.

### LEARNING TRANSITION

```text
rules appear independent
→ interactions discovered
→ state model formed
→ exploits discovered
→ system compressed into mental algorithm
```

### FAILURE

Arbitrary exceptions feel like cheating.

Perfectly independent rules feel dead.

### ARTISTIC OPENING

Rules should interact in ways that produce consequences no individual rule explicitly describes.

### EXPERIENCE DESIGN

The player manipulates a small declarative rule system and discovers second-order behavior.

The pleasure comes from saying:

> Oh. If that rule means this, then this other thing becomes possible.

### RESIDUAL HUMAN ELEMENT

A beautiful system is not merely hard to predict.

It creates consequences that feel **inevitable in retrospect**.

---

