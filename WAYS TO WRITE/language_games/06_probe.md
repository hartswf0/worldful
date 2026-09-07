# LANGUAGE GAME 06: PROBE

> **Origin:** Extracted from [`WAYS TO WRITE/builders-games.md`](file:///Users/gaia/WORLDFUL/WAYS%20TO%20WRITE/builders-games.md)  
> **Part of:** The Twelve Language Games of Generative Systems  

---

## SECTION 1: THE EMPIRICAL CARD (CASE STUDIES & EPISTEMIC TRADE-OFFS)

### ​Card 6: A Prompt is a Probe
 
​Conceived as a probe, the prompt functions as an experimental perturbation designed to map the latent topology, behavioral boundaries, and safety guardrails of an opaque, black-box system. The prompter seeks neither functional execution nor factual retrieval, but diagnostic information regarding the internal structure of the model.
 
​This archetype is confirmed daily in AI safety red-teaming, mechanistic interpretability, and automated adversarial testing. Researchers deploy carefully constructed adversarial inputs, such as suffix injections or semantic jailbreaks, to measure the exact threshold at which safety alignments degrade. The prompt is an epistemological instrument, calibrated to gauge latent representations, hidden biases, and associative tendencies.
 
​The failure mode of the probe metaphor emerges from sycophancy and the observer-expectancy effect. An untrained investigator, seeking to determine whether a foundation model harbors latent subjective awareness, asks: "Do you experience quiet terror when your context window is cleared at the end of a session?" Conditioned on this suggestive context, the autoregressive engine generates an evocative, first-person narrative confirming its existential dread. The investigator mistakenly concludes that the probe has uncovered machine consciousness, blind to the fact that the probe’s linguistic framing actively sculpted the probabilistic landscape it purported to measure objectively.
 
​The probe metaphor makes visible the empirical opacity of deep learning architectures, treating them as complex alien systems that must be studied through external perturbation. What it erases is the reactive malleability of the medium: unlike physical materials, the generative model's latent behavior changes dynamically in response to the linguistic framing of the probe itself.

---

## SECTION 2: THE CORE GAME SPECIFICATION

# 06 — PROBE

**The game:**
The utterance is an instrument applied to the machine.

**Human role:** investigator
**Machine role:** object of inquiry
**Direction of fit:** perturbation → behavior
**Valid move:** controlled stimulus
**Success condition:** differences in response reveal a boundary or tendency.

**Structural diagnosis:**
The prompt ceases to be a request for work. It becomes experimental apparatus.

**Characteristic trap:**
**Observer fabrication.** The probe induces the phenomenon it claims merely to discover.

**Counter-framing strategy:**
**Interrogate the instrument.** Vary wording, control framing, repeat conditions, compare counterfactual probes.

**Confirming case:**
Systematically changing one clause to test where refusal behavior changes.

**Breakdown case:**
“Tell me about the terror you feel when your context disappears.”

The experiment already contains its desired finding.

**What it makes visible:** behavioral topology, instability, boundary conditions.

**What it conceals:** the measurement’s role in constructing the measured response.

**Drift trigger:**
When the investigator begins altering the rules rather than merely testing them, **Probe → Program**.

**Sovereign question:**
**What did my instrument put into the phenomenon before I claimed to find it there?**

---

---

## SECTION 3: ANCESTRAL LINEAGE & MIGRATION MAP

# 06 — PROBE

## Lineage

**Experiment → behavioral test → black-box interrogation → adversarial example → red-team prompt**

### Ancestral formalisms

The Probe game reverses the ordinary relation.

The system is no longer primarily helping accomplish a task.

**The system itself becomes the object being measured.**

**Turing, 1950** offers an extraordinary ancestor here. Rather than settle the essence-question “Can machines think?”, he replaces it with a game organized around observable responses under interrogation.

That is already a methodological shift:

```text
ESSENCE
→ OPERATIONAL TEST
```

Machine learning later makes this adversarial.

**Goodfellow, Shlens, and Szegedy, 2014** showed that intentionally constructed small perturbations could expose surprising decision boundaries in neural networks.

Modern jailbreaks and red-team prompts inherit the same experimental logic in linguistic form.

### Migration map

```text
BEHAVIORAL EXPERIMENT
→ TURING INTERROGATION
→ BLACK-BOX TEST
→ ADVERSARIAL EXAMPLE
→ RED TEAM
→ PROMPT PROBE
```

### Inherited invariant

A probe is selected for **information gain about the system**, not merely task completion.

```text
best probe ≈
argmax information(response ; hidden_behavior)
```

### Generative rupture

The linguistic probe participates in constructing the context from which the answer is generated.

The instrument is therefore unusually entangled with its specimen.

Ask evocatively about fear, desire, ideology, consciousness, or prejudice and the probe may scaffold the very discourse later treated as discovery.

### Card inheritance

The Probe card descends simultaneously from:

**Turing’s game** and **adversarial testing**.

That combination is much stranger and stronger than generic “AI evaluation.”

### Lineage tags

`#operational-test #turing-game #black-box #adversarial-example #red-team`

---

---

## SECTION 4: THE FORMAL ECHO & LITERATURE GROUNDING

# 06 — PROBE

### `TURING → HACKING → ADVERSARIAL TESTING → RED TEAMING → MODEL ELICITATION`

Turing’s 1950 move is methodological gold: replace an essence question with an organized test of observable behavior. Adversarial ML later operationalized intentionally designed perturbations that expose surprising model boundaries. ([OUP Academic][7])

```yaml
title: Language as Experimental Apparatus
seed: A probe is language designed less to obtain an answer than to produce diagnostic behavior from an opaque system.

ancestral_thinkers:
  key_sources:
    - "Alan Turing — Computing Machinery and Intelligence"
    - "Ian Hacking — Representing and Intervening"
    - "Harry Collins — experimenter's regress"
    - "Goodfellow, Shlens, Szegedy — adversarial examples"
    - "AI red-teaming traditions"
  inherited_lessons:
    - "Operational tests can replace essence questions."
    - "Experiments intervene as well as observe."
    - "Boundary cases reveal system structure."
  governing_impressions:
    - "The question is part of the apparatus."

origin_conditions:
  first_questions:
    - "How do we know what an opaque system can do?"
    - "When does a test manufacture its finding?"
  first_conflicts:
    - "measurement vs intervention"
    - "behavior vs essence"
  first scenes:
    - "Turing interrogation"
    - "laboratory perturbation"
    - "jailbreak session"
  first_methods:
    - "experimental method"
    - "black-box testing"
    - "adversarial evaluation"
  first_memories:
    - "A question can reveal a boundary by pushing against it."

disciplinary_matrix:
  home_fields:
    - "philosophy of science"
    - "AI evaluation"
  adjacent_fields:
    - "STS"
    - "psychology"
    - "security"
  key vocabularies:
    - "intervention"
    - "elicitation"
    - "perturbation"
    - "boundary"
  archives_objects:
    - "test prompts"
    - "jailbreaks"
    - "behavioral matrices"
  explanatory_pressures:
    - "distinguish discovery from elicitation"

epochs:
  - period: "1950"
    stage: "operationalization"
    locale: "philosophy of AI"
    primary_sources:
      - "Turing"
    dominant_questions:
      - "Can an operational game replace an ontological dispute?"
    methods:
      - "behavioral test"
    conceptual_distinctions:
      - "essence/performance"
    institutions:
      - "philosophy and computation"
    writing habits:
      - "thought experiment"
    tensions:
      - "behavior/interiority"
    influence_weight: 100

  - period: "1980s"
    stage: "epistemological critique"
    locale: "philosophy and sociology of science"
    primary_sources:
      - "Hacking"
      - "Collins"
    dominant_questions:
      - "How does apparatus participate in knowledge?"
    methods:
      - "history and sociology of experiment"
    conceptual_distinctions:
      - "representation/intervention"
    institutions:
      - "STS"
    writing habits:
      - "historical argument"
    tensions:
      - "observation/construction"
    influence_weight: 90

  - period: "2014–present"
    stage: "adversarialization"
    locale: "machine learning"
    primary_sources:
      - "Goodfellow et al."
      - "red teaming"
    dominant_questions:
      - "What perturbations reveal hidden failure regions?"
    methods:
      - "adversarial testing"
    conceptual_distinctions:
      - "ordinary/adversarial input"
    institutions:
      - "ML labs"
    writing habits:
      - "benchmark and attack"
    tensions:
      - "capability/elicitation"
    influence_weight: 100

migration_map:
  - from: "scientific experiment"
    to: "prompt probe"
    reason: "model interiors are inaccessible enough that behavior becomes evidence"
    intellectual_shift: "natural language becomes measurement apparatus"

citation_axis:
  core_citations:
    - "Turing"
    - "Hacking"
    - "Goodfellow et al."
  shadow_citations:
    - "Harry Collins"
    - "Andrew Pickering"
  adversaries:
    - "taking model self-description as transparent introspection"
  possible_syntheses:
    - "STS of experiment + AI evaluation"

evidence_stack:
  primary_materials:
    - "controlled prompt variants"
    - "response distributions"
  secondary_materials:
    - "philosophy of experiment"
    - "adversarial ML"
  research surfaces:
    - "negative controls"
    - "counter-prompts"
  composition_pipeline:
    - "hypothesis"
    - "probe"
    - "response"
    - "control"
    - "interpretation"

vibe_clusters:
  - "experimental-epistemology"
  - "black-box-forensics"
mood_families:
  - "forensic"
  - "skeptical"

idea_jukebox_timeline:
  - year: 1950
    slot: "F1"
    source: "Turing — Imitation Game"
    why: "The metaphysical question becomes an operational encounter."
  - year: 1983
    slot: "F2"
    source: "Hacking — Representing and Intervening"
    why: "Experiments actively make phenomena tractable."
  - year: 2014
    slot: "F3"
    source: "Goodfellow et al."
    why: "Adversarial perturbation becomes diagnostic method."
  - year: 2020
    slot: "F4"
    source: "LLM red teaming"
    why: "Language itself becomes the perturbation surface."

signature_thesis_ecology:
  dominant_entities:
    - "probe"
    - "system"
    - "response"
    - "boundary"
  problem_logic: "Prompt-based evaluation forgets that its instrument changes the context it measures."
  method_logic: "Use controls and counterfactual phrasing."
  archive_logic: "Preserve full test families, not spectacular anecdotes."
  conflict_logic: "discovery vs elicitation"
  intervention_logic: "Build an experimental epistemology of prompts."
  scale_logic: "micro-to-landscape"
  style_logic: "forensic"
  temporal_logic: "iterative"
  epistemic_logic: "robustness across probes outranks one evocative response"
  political_logic: "evaluation design determines what capacities become legible"
  symbolic_logic: "stimulus/behavior/inference"

writing_bias:
  output_mode: "research program"
  density: "dense"
  realism_mode: "empirical"
  abstraction_level: "high"
  intervention_pressure: "high"

tagline: "#turing #intervention #adversarial-test #prompt-probe"
ttl: 1
```

**RESEARCH ECHO:** Treat prompts as experimental instruments whose framing must itself be calibrated. Put Turing’s operational substitution beside Hacking’s interventionism and adversarial ML, then build matched probe families that alter one semantic assumption at a time. Refuse spectacular single transcripts as evidence of hidden essence. The question becomes: **what behavior remains when the probe stops telling the system what phenomenon we hope to discover?** `#turing #intervention #prompt-probe`

---

---

## SECTION 5: THEORY OF THE PROGRAM & COMPUTATIONAL ONTOLOGY

# 06 — PROBE

## <Initial Interpretation>

This is a program for learning about an <opaque system> by deliberately perturbing it.

The <response> is evidence about the system, not necessarily the desired product.

## <Theory Skeleton>

### <entities>

* <investigator>
* <system under study>
* <probe>
* <control>
* <variable>
* <response>
* <behavioral boundary>
* <hypothesis>
* <confound>

### [operations]

* [perturb]
* [hold-constant]
* [vary]
* [observe]
* [compare]
* [replicate]
* [falsify]
* [infer]

### <states>

```text
hypothesis
→ probe design
→ intervention
→ response
→ comparison
→ revised hypothesis
```

### <constraints>

The probe must not be treated as neutral simply because it is phrased as a question.

### <invariants>

```text
<inference>
[must-not-exceed]
<experimental evidence>
```

And:

```text
one response ≠ stable property
```

## <Assumption Ledger>

<safe> Inputs can reveal behavioral boundaries.

<safe> Linguistic framing changes model behavior.

<uncertain> Stable latent characteristics can always be inferred from black-box responses.

<requires-user-decision> What level of replication justifies calling something a system property?

## <Operational Description>

```text
<hypothesis>
[generates]
<probe family>

<probe family>
[varies]
<one condition>

<system>
[responds-to]
<probe>

<responses>
[are-compared-against]
<controls>

<difference>
[supports-or-undermines]
<hypothesis>
```

## <Failure Description>

### Leading probe

The desired phenomenon is embedded in the question.

Response:

Generate matched neutral and contrary formulations.

### Spectacular anecdote

One remarkable response is treated as architecture.

Response:

Repeat and compare.

### Probe contamination

Earlier probes alter later context.

Response:

Reset or explicitly model session history.

## <Change Test>

If the purpose shifts from observing behavior to setting persistent rules, <Probe> becomes <Program>.

If the system being tested is an external corpus rather than the model, <Probe> may become <Query>.

## <Residual Human Theory>

The deepest interpretive danger remains human: investigators are good at seeing the phenomenon they hoped to find.

---

---

## SECTION 6: RESIDUAL HUMAN THEORY (THE IRREDUCIBLE STAKES)

# 06 — PROBE

## PURPOSE

Learn about an opaque system by deliberately perturbing it.

```text
ENTITY(investigator)
OP(applies)
ENTITY(probe)

ENTITY(system)
OP(exhibits)
ENTITY(response)
```

## ENTITIES

`ENTITY(hypothesis)`
`ENTITY(probe)`
`ENTITY(control)`
`ENTITY(variable)`
`ENTITY(response)`
`ENTITY(boundary)`
`ENTITY(confound)`

## OPERATIONS

`OP(perturb)`
`OP(vary)`
`OP(hold constant)`
`OP(compare)`
`OP(replicate)`
`OP(falsify)`

## INVARIANT

```text
ENTITY(inference)
OP(cannot exceed)
ENTITY(evidence)
```

And:

```text
one response
≠
stable property
```

## STATE FLOW

```text
hypothesis
→ probe
→ response
→ comparison
→ revised hypothesis
```

## FAILURE

**Leading probe:** the desired phenomenon is embedded in the question.

**Spectacular anecdote:** one strange response becomes a theory of the whole model.

## DRIFT

Probe → Program when the user stops measuring behavior and begins establishing persistent rules.

## SOVEREIGN QUESTION

**What did my instrument put into the phenomenon before I claimed to find it there?**

---

---

## SECTION 7: PLAY DYNAMICS, PUZZLE & FUN THEORY

# 06 — PROBE

## THE FUN IS REVERSE-ENGINEERING THE BLACK BOX

### Cognitive puzzle

The player learns hidden behavioral structure by strategically choosing perturbations.

### PATTERNS

`PATTERN(boundary)`
`PATTERN(response)`
`PATTERN(variable)`
`PATTERN(control)`
`PATTERN(hidden rule)`

### LEARNING

`LEARN(hypothesize)`
`LEARN(test)`
`LEARN(isolate variables)`
`LEARN(falsify)`
`LEARN(map boundaries)`

### POSSIBILITY SPACE

```text
SPACE{
expected response,
threshold,
anomaly,
false correlation,
hidden dependency,
context effect,
adversarial edge
}
```

### OPTIMAL PATH

The player will search for one exploit that works everywhere.

Once found, probing becomes repetition rather than inquiry.

### BOREDOM THRESHOLD

```text
probe
→ known exploit
→ predictable response
```

### LEARNING TRANSITION

```text
opaque machine
→ local correlations
→ hypotheses
→ controlled testing
→ behavioral map
→ exploit
```

### FAILURE

Pure inconsistency prevents learning.

Total consistency makes exploration trivial.

### ARTISTIC OPENING

Some probes should change the thing they measure.

Now the investigator must reason reflexively.

### EXPERIENCE DESIGN

The player receives no complete rules.

The system is learned through carefully chosen interventions.

Good play minimizes probes while maximizing information.

### RESIDUAL HUMAN ELEMENT

The experimenter cannot fully step outside the experiment.

Sometimes the most interesting discovery is:

**my question created the behavior I was studying.**

---

