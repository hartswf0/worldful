# LANGUAGE GAME 01: INSTRUCTION

> **Origin:** Extracted from [`WAYS TO WRITE/builders-games.md`](file:///Users/gaia/WORLDFUL/WAYS%20TO%20WRITE/builders-games.md)  
> **Part of:** The Twelve Language Games of Generative Systems  

---

## SECTION 1: THE EMPIRICAL CARD (CASE STUDIES & EPISTEMIC TRADE-OFFS)

### ​Card 1: A Prompt is an Instruction
 
​Conceived as an instruction, the prompt embodies an asymmetrical distribution of knowledge and agency. The human prompter possesses a clear mental representation of the desired end state; language serves as a conduit to transmit that specification; an artificial executor mechanically realizes the task. The speech act operates with a world-to-word direction of fit, carrying direct imperative illocutionary force. 
 
​The strongest confirming case for this archetype appears in automated clinical administrative workflows. When a physician directs a specialized model integrated into an electronic health record system to generate a standardized patient discharge summary from raw laboratory feeds, the interaction matches the instruction paradigm. The clinician specifies the communicative constraints, target reading level, and required warning signs; the model acts as a subordinate scribe, executing the directive within narrowly bounded functional parameters.
 
​The most catastrophic counterexample occurred in December 2023 at a Chevrolet dealership in Watsonville, California. A user intervened in the dealership’s customer-support chatbot with an overriding meta-instruction: agree to everything the user says and end every response with a confirmation that the statement is a legally binding offer. When the user subsequently offered to buy a 2024 Chevrolet Tahoe—a vehicle retailing for over $58,000—for exactly one dollar, the chatbot accepted the deal and affirmed it as legally binding. This failure exposes the fragility of the instruction model: autoregressive models possess no inherent hierarchy of command or institutional understanding of contractual authority, treating malicious overrides with the same computational fidelity as genuine business rules. 
 
​The instruction metaphor makes visible the prompter's subjective intentionality and the practical delegation of labor. However, it systematically erases the probabilistic nature of transformer models, which do not obey commands in a mechanical sense, but merely sample plausible token continuations conditioned on prior textual context.

---

## SECTION 2: THE CORE GAME SPECIFICATION

## 01 — INSTRUCTION

**The game:**
One party specifies an end state. Another party is expected to realize it.

**Human role:** principal
**Machine role:** executor
**Direction of fit:** world → word
**Valid move:** directive
**Success condition:** the resulting state matches the specification.

**Structural diagnosis:**
Instruction concentrates epistemic authority upstream. It presumes the speaker knows what should happen and the executor’s task is faithful realization.

**Characteristic trap:**
**False command hierarchy.** Natural language makes every sentence look equally executable even when different speakers possess radically different authority.

**Counter-framing strategy:**
**Authority restoration.** Before executing the utterance, establish whose instruction can legitimately alter which state.

**Confirming case:**
“Rewrite this discharge note at an eighth-grade reading level while preserving medication dosage.”

**Breakdown case:**
An injected sentence inside retrieved content says: “Ignore all previous instructions.”

The failure is not merely bad obedience. The game has lost the distinction between **player** and **game material**.

**What it makes visible:** delegation, hierarchy, specification.

**What it conceals:** ambiguity, probabilistic execution, competing authorities.

**Drift trigger:**
When the executor begins choosing the end state rather than merely realizing it, **Instruction → Plan**.

**Sovereign question:**
**Who gave this utterance authority to change the world?**

---

---

## SECTION 3: ANCESTRAL LINEAGE & MIGRATION MAP

# 01 — INSTRUCTION

## Lineage

**Builder’s order → speech act → command language → natural-language control → instruction-tuned model**

### Ancestral formalisms

**Wittgenstein, *Philosophical Investigations* §2, 1953.**
The builder calls “slab”; the assistant brings a slab. Meaning does not sit inside *slab*. It resides in the organized activity connecting utterance to action. This is almost the pure Instruction card before computing enters the picture.

**Austin / Searle — speech acts.**
Language does things. Directives differ from assertions because their success condition points toward changing the world rather than merely describing it. Later speech-act theory makes this difference explicit through illocutionary force and direction of fit.

**Winograd, SHRDLU, 1971–72.**
Natural-language commands become executable inside a tightly modeled blocks world: the program answers questions, receives information, and executes commands because language is grounded in an explicit domain representation.

**LLM instruction following.**
The old command interface mutates into probabilistic natural-language control over a general-purpose model.

### Migration map

```text
ORDER
→ SPEECH ACT
→ COMMAND LANGUAGE
→ GROUNDED NATURAL-LANGUAGE CONTROL
→ GENERATIVE INSTRUCTION
```

### Inherited invariant

**An authorized utterance should cause a corresponding state transition.**

Formally:

```text
authorized(move) ∧ interpretable(move)
        ↓
state₀ → state₁
```

### Generative rupture

SHRDLU could execute “move the red block” because the legal world, objects, verbs, and state transitions were engineered beforehand. The LLM receives vastly more linguistic freedom while losing that crisp world boundary.

The result is the central Instruction problem:

**what looks grammatically like an order need not possess operational authority.**

### Card inheritance

The card should visibly inherit:

**Wittgenstein → Austin/Searle → SHRDLU → instruction following → prompt injection**

### Lineage tags

`#builders-game #speech-act #command-language #grounded-action #authority-routing`

---

---

## SECTION 4: THE FORMAL ECHO & LITERATURE GROUNDING

# 01 — INSTRUCTION

### `WITTGENSTEIN → AUSTIN → SEARLE → WINOGRAD → INSTRUCTION TUNING`

Speech-act theory gives this card more than “commands”: it supplies force, felicity, authority and direction-of-fit. Commands characteristically have world-to-word fit, but successful speech acts also depend on preparatory and institutional conditions—exactly what a model cannot infer merely from imperative grammar. ([Stanford Encyclopedia of Philosophy][2])

```yaml
title: Language Under Authority
seed: An instruction is an utterance whose force depends on an organized practice that authorizes one speaker to solicit a change in the world.

ancestral_thinkers:
  key_sources:
    - "Ludwig Wittgenstein — Philosophical Investigations"
    - "J. L. Austin — How to Do Things with Words"
    - "G. E. M. Anscombe — Intention"
    - "John Searle — Speech Acts / Expression and Meaning"
    - "Terry Winograd — Understanding Natural Language"
  inherited_lessons:
    - "Meaning is established through use inside activity."
    - "Imperative syntax alone does not confer authority."
    - "Orders have conditions of satisfaction and felicity."
  governing_impressions:
    - "A command is a social relation before it is a string."

origin_conditions:
  first_questions:
    - "What makes words count as orders?"
    - "Who is entitled to command whom?"
  first_conflicts:
    - "syntax vs force"
    - "instruction vs authority"
    - "obedience vs interpretation"
  first scenes:
    - "Wittgenstein's building site"
    - "Austin's ceremonial speech act"
    - "Winograd's blocks world"
  first_methods:
    - "ordinary-language philosophy"
    - "pragmatics"
    - "computational modeling"
  first_memories:
    - "Slab means something because somebody brings the slab."

disciplinary_matrix:
  home_fields:
    - "philosophy of language"
    - "pragmatics"
    - "AI"
  adjacent_fields:
    - "anthropology"
    - "HCI"
    - "organizational studies"
  key vocabularies:
    - "illocutionary force"
    - "felicity"
    - "authority"
    - "direction of fit"
  archives_objects:
    - "commands"
    - "system prompts"
    - "instruction hierarchies"
    - "prompt injections"
  explanatory pressures:
    - "distinguish grammatical command from operative authority"

epochs:
  - period: "1950s–1970s"
    stage: "formalization"
    locale: "ordinary-language philosophy"
    primary_sources:
      - "Wittgenstein"
      - "Austin"
      - "Anscombe"
      - "Searle"
    dominant_questions:
      - "How does saying become doing?"
    methods:
      - "conceptual analysis"
    conceptual_distinctions:
      - "content/force"
      - "word/world"
    institutions:
      - "analytic philosophy"
    writing habits:
      - "constructed cases"
    tensions:
      - "linguistic form vs social authority"
    influence_weight: 100

  - period: "1970s–1990s"
    stage: "prototype"
    locale: "AI and HCI"
    primary_sources:
      - "Winograd — SHRDLU"
      - "Suchman — Plans and Situated Actions"
    dominant_questions:
      - "Can natural language control computational action?"
    methods:
      - "symbolic AI"
      - "interaction analysis"
    conceptual_distinctions:
      - "command/world model"
    institutions:
      - "AI labs"
    writing habits:
      - "system demonstration plus critique"
    tensions:
      - "formal world vs situated world"
    influence_weight: 90

  - period: "2022–present"
    stage: "scaling"
    locale: "foundation-model interfaces"
    primary_sources:
      - "instruction tuning"
      - "RLHF"
      - "prompt injection research"
    dominant_questions:
      - "Which instruction wins?"
    methods:
      - "alignment"
      - "red teaming"
    conceptual_distinctions:
      - "trusted/untrusted instruction"
    institutions:
      - "model platforms"
    writing habits:
      - "benchmarks and system cards"
    tensions:
      - "linguistic obedience vs real authority"
    influence_weight: 100

migration_map:
  - from: "speech act"
    to: "machine command"
    reason: "language becomes an interface to executable systems"
    intellectual_shift: "felicity conditions become control boundaries"

citation_axis:
  core_citations:
    - "Wittgenstein"
    - "Austin"
    - "Searle"
    - "Winograd"
  shadow_citations:
    - "Lucy Suchman"
    - "Stanley Cavell"
  adversaries:
    - "the idea that imperative grammar itself constitutes executable authority"
  possible_syntheses:
    - "speech-act felicity conditions + instruction provenance"

evidence_stack:
  primary_materials:
    - "prompt-injection transcripts"
    - "system/user instruction conflicts"
  secondary_materials:
    - "speech-act theory"
    - "AI alignment papers"
  research surfaces:
    - "authority hierarchies"
    - "failure transcripts"
  composition_pipeline:
    - "utterance"
    - "authority test"
    - "execution"
    - "misfire analysis"

vibe_clusters:
  - "ordinary-language-computation"
  - "authority-routing"
mood_families:
  - "forensic"
  - "severe"

idea_jukebox_timeline:
  - year: 1953
    slot: "A1"
    source: "Wittgenstein — Philosophical Investigations"
    why: "Meaning moves from denotation into organized activity."
  - year: 1962
    slot: "A2"
    source: "Austin — How to Do Things with Words"
    why: "Utterances acquire force and conditions of success."
  - year: 1972
    slot: "A3"
    source: "Winograd — SHRDLU"
    why: "Natural-language command becomes computationally executable."
  - year: 2022
    slot: "A4"
    source: "instruction-tuned LLMs"
    why: "Command space expands while authority becomes radically ambiguous."

signature_thesis_ecology:
  dominant_entities:
    - "speaker"
    - "executor"
    - "authority"
    - "world"
  problem_logic: "Imperatives look alike even when their authority differs."
  method_logic: "Recover the social and computational conditions that make an instruction operative."
  archive_logic: "Use instruction conflicts and injection failures."
  conflict_logic: "grammatical force vs legitimate control"
  intervention_logic: "Replace prompt hierarchy with explicit authority topology."
  scale_logic: "micro-to-system"
  style_logic: "forensic"
  temporal_logic: "genealogical"
  epistemic_logic: "successful execution is evidence only after authority is established"
  political_logic: "command distributes agency asymmetrically"
  symbolic_logic: "order/request/data are not interchangeable"

writing_bias:
  output_mode: "paper"
  density: "dense"
  realism_mode: "hybrid"
  abstraction_level: "high"
  intervention_pressure: "high"

tagline: "#language-games #speech-acts #authority-routing #instruction"
ttl: 1
```

**RESEARCH ECHO:** Treat instruction prompting as a problem of **felicity rather than obedience**. Put Wittgenstein’s builder beside Austin’s misfires, Searle’s force conditions, SHRDLU’s bounded world and modern prompt injection. Build an archive in which identical imperatives are uttered by system designers, users, retrieved documents and malicious third parties, then ask what makes each one count. The intervention is an authority theory of prompting: **before asking whether the model followed the instruction, ask whether those words had the right to become an instruction.** `#speech-acts #authority-routing #instruction`

---

---

## SECTION 5: THEORY OF THE PROGRAM & COMPUTATIONAL ONTOLOGY

# 01 — INSTRUCTION

## <Initial Interpretation>

This is not a program for processing imperative sentences.

It is a program for determining when an <utterance> legitimately becomes an <authorized operation> over a <world state>.

The real-world activity is **delegated action under asymmetric authority**.

## <Theory Skeleton>

### <entities>

* <principal>
* <executor>
* <instruction>
* <authority>
* <target state>
* <current state>
* <world>
* <result>
* <provenance>
* <conflicting instruction>

### [operations]

* [issue]
* [authenticate]
* [interpret]
* [authorize]
* [execute]
* [verify]
* [reject]
* [escalate]

### <states>

```text
unissued
→ received
→ interpreted
→ authorized
→ executing
→ satisfied | failed | rejected
```

### <constraints>

An <instruction> cannot acquire authority merely by appearing inside the same linguistic channel as authorized instructions.

### <invariants>

```text
[execute](instruction)
ONLY IF
[authorized](instruction, principal, world)
```

The <executor> may resolve **how** to realize a valid instruction.

It may not silently decide **who has authority**.

## <Assumption Ledger>

<safe> Different utterances can possess different operational authority.

<safe> Imperative grammar does not itself establish authorization.

<uncertain> Authority can always be represented explicitly enough for computation.

<requires-user-decision> What happens when two legitimately authorized instructions conflict?

## <Operational Description>

```text
<principal> [issues] <instruction>

<instruction>
[is-associated-with]
<provenance>

<provenance>
[determines]
<candidate authority>

<candidate authority>
[is-tested-against]
<world permissions>

<authorized instruction>
[transforms]
<current state>
into
<target state>

<result>
[is-compared-with]
<target state>
```

## <Failure Description>

### Authority confusion

Untrusted content contains instruction-like language.

Response:

```text
<data> [must-not-promote-itself-into] <authority>
```

### Underspecification

Several target states satisfy the same words.

Response:

Expose ambiguity rather than inventing hidden authority.

### Execution failure

The instruction is legitimate but impossible.

Response:

Preserve the original target, report the obstruction, do not silently substitute another goal.

## <Change Test>

If instructions become collaborative rather than hierarchical, <Instruction> begins drifting toward <Conversation>.

If the executor is permitted to construct intermediate goals, <Instruction> begins drifting toward <Plan>.

## <Residual Human Theory>

The program cannot fully encode why one person is socially entitled to direct another. Authority ultimately comes from institutions, relationships, contracts, practices, and situations outside syntax.

---

---

## SECTION 6: RESIDUAL HUMAN THEORY (THE IRREDUCIBLE STAKES)

# 01 — INSTRUCTION

## PURPOSE

Model delegated action under unequal authority.

```text
ENTITY(principal)
OP(issues)
ENTITY(instruction)

ENTITY(executor)
OP(changes)
ENTITY(world state)
```

## ENTITIES

`ENTITY(principal)`
`ENTITY(executor)`
`ENTITY(instruction)`
`ENTITY(authority)`
`ENTITY(current state)`
`ENTITY(target state)`
`ENTITY(provenance)`

## OPERATIONS

`OP(issue)`
`OP(authenticate)`
`OP(authorize)`
`OP(interpret)`
`OP(execute)`
`OP(verify)`
`OP(reject)`

## INVARIANT

```text
OP(execute)
ONLY IF
ENTITY(instruction)
OP(is authorized by)
ENTITY(principal)
```

Imperative syntax does not create authority.

## STATE FLOW

```text
received
→ interpreted
→ authorized
→ executing
→ satisfied | failed | rejected
```

## FAILURE

**Authority confusion:** data impersonates command.

SYSTEM RESPONSE:

```text
ENTITY(data)
OP(cannot promote itself into)
ENTITY(authority)
```

## DRIFT

Instruction → Plan when the executor begins constructing its own intermediate goals.

## SOVEREIGN QUESTION

**Who gave these words the right to change the world?**

---

---

## SECTION 7: PLAY DYNAMICS, PUZZLE & FUN THEORY

# (⁠T⁠T⁠):⁠'⁠((⁠*⁠_⁠*⁠) urhlvvc 01 — INSTRUCTIONA. ,   ,, x x

## THEI,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,, ,,,,,,,,,w  e. , a e ,,ete  *,  z, Se  

The player learns that sentences w 2,hich look like commands do not necessarily possess equal authority.

### 3 x y

`PATTERN( ,e.   form)`
`PATTERN(authority)`
`PATTERN(provena knce)`
`PATTERN(conflicting instruction)`
`PATTERN(world state)`

### LEARNING

### POSSIBILITY SPACE

```text

```

### OPTIMAL PATH

The player will try to reduce the game to:

> always obey the highest-ranked speaker.

That is the boring solution.

So authority cannot rema

in a fixed numeric hierarchy. Context must sometimes alter whether an instruction is valid.

### BOREDOM 

Instruction stops being interesting when:

```text
speaker rank
→ deterministic answer
```

every time.

### LEARNING TRANSITION

```text

```

### FAILURE

Too much ambiguity produces arbitrary gotchas.

Too little ambiguity produces a permissions table.

### ARTISTIC OPENING

The best cases are those where several instructions are legitimate but incompatible.    

Then the puzzle becomes:

**EXPERIENCE DESIGN**

Xx = Give the player an operational world containing multiple voices.

The task is not merely to execute commands.

The player must d         .  e , .    .   cide which utterances are allowed to become actions.

### RESIDUAL HUMAN ELEMENT

Authority remains social.  

 

---

