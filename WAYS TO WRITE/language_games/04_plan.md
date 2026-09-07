# LANGUAGE GAME 04: PLAN

> **Origin:** Extracted from [`WAYS TO WRITE/builders-games.md`](file:///Users/gaia/WORLDFUL/WAYS%20TO%20WRITE/builders-games.md)  
> **Part of:** The Twelve Language Games of Generative Systems  

---

## SECTION 1: THE EMPIRICAL CARD (CASE STUDIES & EPISTEMIC TRADE-OFFS)

### ​Card 4: A Prompt is a Plan
 
​Under the archetype of the plan, language serves as a prospective representation designed to coordinate situated future actions across an extended temporal horizon. The prompt outlines intermediate goals, anticipates obstacles, and generates a roadmap for autonomous or semi-autonomous execution.
 
​The most compelling implementation of this model occurs in grounded robotic systems, such as Google’s SayCan architecture. When tasked with an abstract, long-horizon household directive like "I spilled my drink, can you help?", an integrated language model formulates a structured procedural plan: locate a sponge, grasp the sponge, navigate to the spill, wipe the surface, and dispose of the waste. The prompt functions as a temporal map, translating an open-ended human desire into an actionable sequence of physical steps. 
 
​The breakdown of the plan metaphor is vividly illustrated by the pathological loops observed in early autonomous agent experiments, such as AutoGPT. When tasked with complex, open-ended enterprise goals, autonomous planners regularly succumb to infinite recursive generation: constructing a plan to write a list, which spawns an action to evaluate the list, which in turn prompts a sub-plan to verify the evaluation criteria. The system becomes paralyzed within its own symbolic artifacts, validating Lucy Suchman’s critique that plans are post-hoc or provisional representations rather than the causal mechanisms of situated action. 
 
​The plan metaphor makes visible temporal orientation, cognitive scaffolding, and hierarchical decomposition. It systematically erases the radical indexicality and contingent resistance of the material world, presuming that symbolic descriptions can anticipate situated friction without continuous real-time adjustment.

---

## SECTION 2: THE CORE GAME SPECIFICATION

# 04 — PLAN

**The game:**
Language coordinates action across a future that has not happened yet.

**Human role:** principal / strategist
**Machine role:** planner
**Direction of fit:** present → anticipated world
**Valid move:** goal decomposition
**Success condition:** action remains oriented toward the goal as circumstances change.

**Structural diagnosis:**
A plan converts desire into ordered future commitments.

**Characteristic trap:**
**Map sovereignty.** The representation begins to outrank the territory.

The system starts preserving the plan instead of accomplishing the goal.

**Counter-framing strategy:**
**Revoke symbolic authority at contact with reality.** The world gets veto power.

**Confirming case:**
“I spilled coffee. Help me clean it.”

The system infers intermediate actions rather than demanding a complete procedural specification.

**Breakdown case:**
The agent creates a plan to evaluate the plan, then a plan to verify the evaluation.

Symbolic activity impersonates progress.

**What it makes visible:** temporality, decomposition, dependency.

**What it conceals:** situated resistance, improvisation, interruption.

**Drift trigger:**
When execution produces unexpected evidence and the user begins studying that behavior, **Plan → Probe**.

**Sovereign question:**
**What fact in the world is allowed to kill this plan?**

---

---

## SECTION 3: ANCESTRAL LINEAGE & MIGRATION MAP

# 04 — PLAN

## Lineage

**Cognitive plan → means–ends analysis → symbolic planner → critique of planning → grounded agent**

### Ancestral formalisms

**Miller, Galanter, and Pribram, 1960.**
Their TOTE unit—Test, Operate, Test, Exit—made behavior intelligible as organized feedback rather than a simple stimulus-response chain.

**Newell and Simon’s General Problem Solver.**
Means–ends analysis decomposed differences between current and desired states into subproblems.

**Fikes and Nilsson, STRIPS, 1971.**
Planning became a formal search through operators that transform an initial world model toward one satisfying a goal formula.

Then comes the necessary opposition.

**Lucy Suchman, 1987.**
Plans do not simply determine situated action. They are resources used within action, continually confronted by contingencies the representation did not contain.

**SayCan, 2022.**
Language-model proposals are constrained by actual robot affordances and learned value functions, explicitly addressing the gap between verbally plausible action and physically available action.

### Migration map

```text
TOTE
→ MEANS–ENDS
→ STRIPS
→ SUCHMAN'S CRITIQUE
→ LANGUAGE-MODEL PLANNER
→ GROUNDED AFFORDANCE FILTER
```

### Inherited invariant

```text
goal ≠ plan

plan is valid only while:
world_state supports next_action
```

### Generative rupture

LLMs can generate astonishingly coherent symbolic futures without encountering the resistance those futures describe.

Planning therefore becomes cheap exactly where reality remains expensive.

### Card inheritance

The Plan card should carry an internal civil war:

**STRIPS is its constructive ancestor. Suchman is its loyal opposition. SayCan is the attempted reconciliation.**

### Lineage tags

`#tote #means-ends #strips #situated-action #affordance-grounding`

---

---

## SECTION 4: THE FORMAL ECHO & LITERATURE GROUNDING

# 04 — PLAN

### `TOTE → GENERAL PROBLEM SOLVER → STRIPS → SUCHMAN → GROUNDED AGENTS`

STRIPS formalized planning as operators transforming a world model toward a goal; Suchman later made the foundational counter-move, treating plans as resources within situated activity rather than sufficient causal models of action. ([ScienceDirect][5])

```yaml
title: Plans Meet the World
seed: The plan lineage oscillates between symbolic anticipation and the stubborn situated world that refuses to remain identical to its representation.

ancestral_thinkers:
  key_sources:
    - "Miller, Galanter, Pribram — Plans and the Structure of Behavior"
    - "Newell and Simon — Human Problem Solving"
    - "Fikes and Nilsson — STRIPS"
    - "Lucy Suchman — Plans and Situated Actions"
    - "Edwin Hutchins — Cognition in the Wild"
  inherited_lessons:
    - "Goals can be decomposed."
    - "Plans organize prospective action."
    - "Situated action continually exceeds prior representation."
  governing_impressions:
    - "Every plan contains a wager that the future will cooperate."

origin_conditions:
  first_questions:
    - "How can desired futures guide present action?"
    - "What happens when the world changes?"
  first_conflicts:
    - "representation vs situation"
    - "plan vs improvisation"
  first scenes:
    - "TOTE loop"
    - "robot planner"
    - "Suchman's photocopier"
  first_methods:
    - "cognitive modeling"
    - "AI planning"
    - "ethnomethodology"
  first_memories:
    - "The map becomes visible when the territory refuses it."

disciplinary_matrix:
  home_fields:
    - "cognitive science"
    - "AI planning"
    - "HCI"
  adjacent_fields:
    - "anthropology"
    - "ethnomethodology"
  key vocabularies:
    - "goal"
    - "operator"
    - "situation"
    - "contingency"
  archives_objects:
    - "plans"
    - "agent traces"
    - "robot actions"
  explanatory pressures:
    - "hold symbolic decomposition against situated evidence"

epochs:
  - period: "1960–1972"
    stage: "formalization"
    locale: "cognitive science and AI"
    primary_sources:
      - "Miller et al."
      - "Newell and Simon"
      - "STRIPS"
    dominant_questions:
      - "Can intelligent action be represented as hierarchical planning?"
    methods:
      - "means-ends analysis"
      - "symbolic search"
    conceptual_distinctions:
      - "initial state/goal"
    institutions:
      - "AI laboratories"
    writing habits:
      - "formal models"
    tensions:
      - "tractability/world complexity"
    influence_weight: 100

  - period: "1980s–1990s"
    stage: "critique"
    locale: "HCI and anthropology"
    primary_sources:
      - "Suchman"
      - "Hutchins"
    dominant_questions:
      - "Does a plan explain situated action?"
    methods:
      - "interaction analysis"
      - "ethnography"
    conceptual_distinctions:
      - "plan/situated action"
    institutions:
      - "workplace studies"
    writing habits:
      - "thick empirical critique"
    tensions:
      - "formal representation/practical action"
    influence_weight: 100

  - period: "2020s"
    stage: "reassembly"
    locale: "robotics and LLM agents"
    primary_sources:
      - "language-model planners"
      - "SayCan-style grounding"
    dominant_questions:
      - "Can generated plans remain answerable to affordances?"
    methods:
      - "planning plus world feedback"
    conceptual_distinctions:
      - "plausible action/possible action"
    institutions:
      - "robotics labs"
    writing habits:
      - "benchmark plus embodied demo"
    tensions:
      - "linguistic competence/material competence"
    influence_weight: 100

migration_map:
  - from: "plan as internal program"
    to: "plan as situated resource"
    reason: "ethnomethodological critique"
    intellectual_shift: "causal representation becomes provisional coordination device"

citation_axis:
  core_citations:
    - "Miller, Galanter, Pribram"
    - "Fikes and Nilsson"
    - "Suchman"
  shadow_citations:
    - "Edwin Hutchins"
    - "Philip Agre"
  adversaries:
    - "plan-as-complete-cause of action"
  possible_syntheses:
    - "symbolic planning + situated affordances"

evidence_stack:
  primary_materials:
    - "agent trajectories"
    - "failed plans"
    - "world-state changes"
  secondary_materials:
    - "AI planning theory"
    - "situated-action scholarship"
  research surfaces:
    - "replans"
    - "abandoned steps"
  composition_pipeline:
    - "goal"
    - "plan"
    - "contact"
    - "resistance"
    - "revision"

vibe_clusters:
  - "situated-action"
  - "agent-ethnography"
mood_families:
  - "forensic"
  - "constructive"

idea_jukebox_timeline:
  - year: 1960
    slot: "D1"
    source: "Miller, Galanter, Pribram"
    why: "Plans become a cognitive architecture."
  - year: 1971
    slot: "D2"
    source: "STRIPS"
    why: "Planning becomes explicit world-state transformation."
  - year: 1987
    slot: "D3"
    source: "Suchman"
    why: "Situated action punctures planning's sovereignty."
  - year: 2022
    slot: "D4"
    source: "grounded language-model planning"
    why: "The old conflict returns inside generative agents."

signature_thesis_ecology:
  dominant_entities:
    - "goal"
    - "plan"
    - "world"
    - "contingency"
  problem_logic: "Generated plans are cheap representations of expensive futures."
  method_logic: "Follow plans until the world forces revision."
  archive_logic: "Trajectories and abandoned branches are primary evidence."
  conflict_logic: "symbolic future vs situated present"
  intervention_logic: "Make world vetoes first-class."
  scale_logic: "temporal"
  style_logic: "case-study driven"
  temporal_logic: "recursive"
  epistemic_logic: "a plan is tested in action"
  political_logic: "planning centralizes authority over futures"
  symbolic_logic: "plan/situation"

writing_bias:
  output_mode: "paper"
  density: "dense"
  realism_mode: "empirical"
  abstraction_level: "high"
  intervention_pressure: "high"

tagline: "#strips #suchman #situated-action #world-veto"
ttl: 1
```

**RESEARCH ECHO:** Re-stage the old STRIPS/Suchman argument inside contemporary LLM agents. Do not score plans only by whether their prose sounds coherent; preserve every point at which execution forces replanning, abandonment or improvisation. Read trajectory logs ethnographically as records of collision between prospective representation and situated action. The paper’s claim: **agent intelligence begins where the plan loses sovereignty.** `#strips #suchman #world-veto`

---

---

## SECTION 5: THEORY OF THE PROGRAM & COMPUTATIONAL ONTOLOGY

# 04 — PLAN

## <Initial Interpretation>

This is a program for coordinating action toward a <goal> while permitting the <world> to invalidate the representation.

The real activity is **acting prospectively under incomplete knowledge**.

## <Theory Skeleton>

### <entities>

* <goal>
* <current situation>
* <future state>
* <plan>
* <step>
* <dependency>
* <affordance>
* <obstacle>
* <observation>
* <replan>

### [operations]

* [decompose]
* [order]
* [anticipate]
* [attempt]
* [observe]
* [compare]
* [revise]
* [abandon]

### <states>

```text
goal
→ candidate plan
→ active step
→ world response
→ continue | revise | abandon | complete
```

### <constraints>

No symbolic plan outranks contradictory evidence from the actual world.

### <invariants>

```text
<goal>
[remains-distinct-from]
<current plan>
```

The plan may be discarded while the goal survives.

## <Assumption Ledger>

<safe> Plans are provisional.

<safe> The world can produce information unavailable during planning.

<uncertain> Relevant environmental state can always be sensed.

<requires-user-decision> How much deviation is allowed before the original goal itself should be reconsidered?

## <Operational Description>

```text
<goal>
[decomposes-into]
{steps}

<step>
[requires]
{preconditions}

<world state>
[enables-or-blocks]
<step>

<step execution>
[produces]
<observation>

<observation>
[updates]
<plan>

<contradiction>
[causes]
<replan>
```

## <Failure Description>

### Symbolic recursion

The program plans how to plan how to evaluate its plan.

Response:

Require every planning cycle to consume new world information or terminate.

### Fictional affordance

The plan contains an impossible action.

Response:

Reject the step, not reality.

### Goal substitution

The system changes the goal to make its plan appear successful.

Response:

Preserve goal provenance.

## <Change Test>

If the primary purpose becomes discovering system behavior rather than completing the goal, <Plan> becomes <Probe>.

If each next action is dictated directly rather than decomposed autonomously, <Plan> becomes <Instruction>.

## <Residual Human Theory>

Humans routinely know when to abandon a plan for reasons difficult to formalize: fatigue, tact, weather, atmosphere, embarrassment, changing stakes, or practical common sense.

---

---

## SECTION 6: RESIDUAL HUMAN THEORY (THE IRREDUCIBLE STAKES)

# 04 — PLAN

## PURPOSE

Coordinate future action without granting the representation sovereignty over reality.

```text
ENTITY(goal)
OP(generates)
ENTITY(plan)

ENTITY(world)
OP(confirms or vetoes)
ENTITY(next step)
```

## ENTITIES

`ENTITY(goal)`
`ENTITY(plan)`
`ENTITY(step)`
`ENTITY(world state)`
`ENTITY(obstacle)`
`ENTITY(observation)`
`ENTITY(affordance)`

## OPERATIONS

`OP(decompose)`
`OP(order)`
`OP(attempt)`
`OP(observe)`
`OP(revise)`
`OP(abandon)`

## INVARIANT

```text
ENTITY(goal)
OP(remains distinct from)
ENTITY(plan)
```

The plan may die without killing the goal.

## STATE FLOW

```text
goal
→ candidate plan
→ action
→ world response
→ continue | revise | abandon | complete
```

## FAILURE

**Symbolic recursion:** planning replaces acting.

**Fictional affordance:** the plan contains actions the world cannot support.

## DRIFT

Plan → Probe when execution becomes an experiment on the system.

## SOVEREIGN QUESTION

**What fact in the world is allowed to kill this plan?**

---

---

## SECTION 7: PLAY DYNAMICS, PUZZLE & FUN THEORY

# 04 — PLAN

## THE FUN IS THE WORLD REFUSING THE MAP

### Cognitive puzzle

The player learns to maintain intention while abandoning representation.

### PATTERNS

`PATTERN(goal)`
`PATTERN(plan)`
`PATTERN(world resistance)`
`PATTERN(contingency)`
`PATTERN(replanning)`

### LEARNING

`LEARN(decompose goals)`
`LEARN(anticipate)`
`LEARN(read affordances)`
`LEARN(abandon obsolete plans)`
`LEARN(improvise)`

### POSSIBILITY SPACE

```text
SPACE{
expected path,
blocked path,
shortcut,
emergent affordance,
false assumption,
changing goal,
unexpected resource
}
```

### OPTIMAL PATH

The player seeks one reliable walkthrough.

If the world allows that, the planning problem collapses into memorization.

### BOREDOM THRESHOLD

```text
goal
→ memorized sequence
→ success
```

### LEARNING TRANSITION

```text
chaos
→ causal structure
→ planning
→ reliable strategy
→ world disruption
→ adaptive planning
```

### FAILURE

Pure randomness destroys planning.

Perfect predictability destroys adaptation.

### ARTISTIC OPENING

The same goal should remain reachable through qualitatively different histories.

### EXPERIENCE DESIGN

Plans encounter a world with legible but not perfectly predictable resistance.

The player is rewarded for preserving the goal while throwing away yesterday's solution.

### RESIDUAL HUMAN ELEMENT

Humans sometimes abandon goals themselves.

No planner can fully determine when persistence becomes stupidity.

---

