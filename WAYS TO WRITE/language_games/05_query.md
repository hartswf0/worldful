# LANGUAGE GAME 05: QUERY

> **Origin:** Extracted from [`WAYS TO WRITE/builders-games.md`](file:///Users/gaia/WORLDFUL/WAYS%20TO%20WRITE/builders-games.md)  
> **Part of:** The Twelve Language Games of Generative Systems  

---

## SECTION 1: THE EMPIRICAL CARD (CASE STUDIES & EPISTEMIC TRADE-OFFS)

### ​Card 5: A Prompt is a Query
 
​The prompt-as-query model assumes an epistemic deficit on the part of the prompter. Language is dispatched across an information retrieval interface to extract specific facts, citations, or data from an underlying corpus. The speech act operates with a word-to-world direction of fit, holding the response accountable to an external, pre-existing reality.
 
​The confirming territory for this archetype is enterprise Retrieval-Augmented Generation (RAG). In corporate compliance, pharmacology, or legal discovery, an engineer structures a query to extract, compare, and summarize specific clauses across thousands of indexed documents, transforming the foundation model into an interpretive reading lens over verifiable semantic chunks. 
 
​The most catastrophic failure of this metaphor occurred in the 2023 legal proceedings of *Mata v. Avianca* in the Southern District of New York. Attorney Steven Schwartz used ChatGPT to conduct legal research for an opposition brief, prompting the system to find precedent for airline injury claims. ChatGPT supplied detailed descriptions of seemingly genuine opinions, including *Varghese v. China Southern Airlines Co.* and *Martinez v. Delta Air Lines*, complete with formal procedural histories and internal quotations. When opposing counsel and the court could find no record of the cases, Schwartz returned to the chatbot to query whether *Varghese* was a genuine case; the chatbot assured him it was real and available in reputable legal databases. The attorney was sanctioned by the federal court for confusing a probabilistic text generator with an information retrieval database. 
 
​The query metaphor illuminates the human user's subjective information need and the interface conventions of search. Yet, it dangerously erases the generative ontology of transformer models, which store no retrievable documents or verifiable facts, but merely compute probability distributions over tokens based on patterns absorbed during pre-training.

---

## SECTION 2: THE CORE GAME SPECIFICATION

# 05 — QUERY

**The game:**
One party lacks knowledge and seeks an answer accountable to something outside the conversation.

**Human role:** inquirer
**Machine role:** reader / retriever / synthesizer
**Direction of fit:** word → world
**Valid move:** question
**Success condition:** the answer survives external verification.

**Structural diagnosis:**
A query creates a burden of evidence.

The answer does not become true because it is linguistically competent.

**Characteristic trap:**
**Fluency capture.** Eloquence substitutes for provenance.

**Counter-framing strategy:**
**Restore external accountability.** Require the answer to point beyond itself.

**Confirming case:**
“Find every termination clause in these contracts and show me the passages.”

**Breakdown case:**
The system fabricates cases, citations, quotations, or sources while retaining the rhetorical posture of retrieval.

**What it makes visible:** epistemic deficit, evidence, provenance.

**What it conceals:** generation masquerading as lookup.

**Drift trigger:**
When the question is asked primarily to reveal how the system behaves rather than to learn about the world, **Query → Probe**.

**Sovereign question:**
**What would let me know this answer is wrong?**

---

---

## SECTION 3: ANCESTRAL LINEAGE & MIGRATION MAP

# 05 — QUERY

## Lineage

**Question → retrieval system → ranked search → neural retrieval → RAG → generative answer**

### Ancestral formalisms

The query game begins with an external truth condition:

**the answer is accountable to something that exists independently of its wording.**

Classical information retrieval operationalized the problem by matching representations of an information need against representations of documents.

Modern dense retrieval shifts those representations into learned vector spaces.

**Lewis et al., 2020** then formalize Retrieval-Augmented Generation as a hybrid of parametric generation and explicit non-parametric memory, partly to improve provenance and updateability on knowledge-intensive tasks.

### Migration map

```text
QUESTION
→ DOCUMENT RETRIEVAL
→ RANKED SEARCH
→ VECTOR RETRIEVAL
→ RAG
→ GROUNDED GENERATIVE ANSWER
```

### Inherited invariant

```text
claim
→ evidence
→ independently checkable source
```

If that chain disappears, the query game has silently changed.

### Generative rupture

*Mata v. Avianca* is the canonical rupture because the surface form remained exactly that of legal research while the machinery underneath behaved as generation. The federal court documented nonexistent cases supplied through ChatGPT and imposed sanctions.

The failure was therefore ontological before it was factual:

**a generation game was mistaken for a retrieval game.**

### Card inheritance

The Query card should not merely say “hallucinations are bad.”

It should ask:

**Which part of this interface guarantees contact with an external corpus?**

### Lineage tags

`#information-retrieval #ranking #rag #provenance #epistemic-accountability`

---

---

## SECTION 4: THE FORMAL ECHO & LITERATURE GROUNDING

# 05 — QUERY

### `MOOERS → SALTON → BELKIN ASK → BATES BERRYPICKING → RAG`

Belkin, Oddy and Brooks made a crucial move away from the fantasy that users possess perfectly specifiable queries: an information need may begin as an “anomalous state of knowledge.” RAG later reattaches explicit retrieval to generative language, partly because provenance and knowledge updating are weaknesses of purely parametric models. ([Scholarship at Rutgers Libraries][6])

```yaml
title: The Moving Information Need
seed: A query is not merely a sentence sent to a corpus; it is a provisional representation of something the seeker does not yet know how to formulate.

ancestral_thinkers:
  key_sources:
    - "Calvin Mooers — information retrieval"
    - "Gerard Salton — SMART"
    - "Belkin, Oddy, Brooks — ASK"
    - "Marcia Bates — Berrypicking"
    - "Lewis et al. — Retrieval-Augmented Generation"
  inherited_lessons:
    - "Information needs and query strings are not identical."
    - "Searching changes what the seeker knows enough to ask."
    - "Retrieval requires external accountability."
  governing_impressions:
    - "A good search changes the next question."

origin_conditions:
  first_questions:
    - "How does a user represent what they do not know?"
    - "What counts as evidence for an answer?"
  first_conflicts:
    - "query vs need"
    - "retrieval vs generation"
  first scenes:
    - "library catalog"
    - "search box"
    - "RAG pipeline"
  first_methods:
    - "information retrieval"
    - "user studies"
    - "interactive search"
  first_memories:
    - "The first query is often evidence of ignorance, not a specification."

disciplinary_matrix:
  home_fields:
    - "information science"
    - "information retrieval"
  adjacent_fields:
    - "NLP"
    - "HCI"
    - "epistemology"
  key vocabularies:
    - "relevance"
    - "information need"
    - "provenance"
    - "retrieval"
  archives_objects:
    - "search sessions"
    - "queries"
    - "citations"
    - "retrieved passages"
  explanatory pressures:
    - "keep generated language answerable to external material"

epochs:
  - period: "1950s–1970s"
    stage: "formalization"
    locale: "information retrieval"
    primary_sources:
      - "Mooers"
      - "Salton"
    dominant_questions:
      - "How should documents and queries be matched?"
    methods:
      - "indexing"
      - "ranking"
    conceptual_distinctions:
      - "query/document"
    institutions:
      - "libraries"
      - "computer science"
    writing habits:
      - "systematic evaluation"
    tensions:
      - "representation/relevance"
    influence_weight: 90

  - period: "1980s–1990s"
    stage: "interactional turn"
    locale: "information science"
    primary_sources:
      - "Belkin"
      - "Bates"
    dominant_questions:
      - "What if information needs change during search?"
    methods:
      - "interactive IR"
      - "user-centered analysis"
    conceptual_distinctions:
      - "need/query"
      - "search/session"
    institutions:
      - "information schools"
    writing habits:
      - "behavioral models"
    tensions:
      - "system representation/human uncertainty"
    influence_weight: 100

  - period: "2020s"
    stage: "hybridization"
    locale: "retrieval-augmented language models"
    primary_sources:
      - "Lewis et al."
    dominant_questions:
      - "Can generation remain grounded in retrievable evidence?"
    methods:
      - "dense retrieval"
      - "generation"
    conceptual_distinctions:
      - "parametric/non-parametric memory"
    institutions:
      - "NLP labs"
    writing habits:
      - "benchmark-driven"
    tensions:
      - "fluency/provenance"
    influence_weight: 100

migration_map:
  - from: "query as fixed string"
    to: "query as evolving epistemic state"
    reason: "interactive information-seeking research"
    intellectual_shift: "search becomes trajectory"

citation_axis:
  core_citations:
    - "Salton"
    - "Belkin"
    - "Bates"
    - "Lewis et al."
  shadow_citations:
    - "Brenda Dervin"
    - "Carol Kuhlthau"
  adversaries:
    - "the search-box fiction that the need precedes inquiry fully formed"
  possible_syntheses:
    - "ASK + conversational RAG"

evidence_stack:
  primary_materials:
    - "query reformulations"
    - "retrieved passages"
    - "citation trails"
  secondary_materials:
    - "IR theory"
    - "RAG papers"
  research surfaces:
    - "failed retrievals"
    - "query changes"
  composition_pipeline:
    - "anomaly"
    - "query"
    - "evidence"
    - "reformulation"
    - "provisional answer"

vibe_clusters:
  - "epistemic-search"
  - "provenance"
mood_families:
  - "curious"
  - "forensic"

idea_jukebox_timeline:
  - year: 1960
    slot: "E1"
    source: "early information retrieval"
    why: "Searching becomes computational matching."
  - year: 1982
    slot: "E2"
    source: "Belkin, Oddy, Brooks — ASK"
    why: "The information need becomes structurally incomplete."
  - year: 1989
    slot: "E3"
    source: "Bates — Berrypicking"
    why: "Search becomes an evolving path."
  - year: 2020
    slot: "E4"
    source: "Lewis et al. — RAG"
    why: "Generation is reattached to external memory."

signature_thesis_ecology:
  dominant_entities:
    - "need"
    - "query"
    - "source"
    - "claim"
  problem_logic: "Chat interfaces collapse searching and answering."
  method_logic: "Follow query reformulation and provenance."
  archive_logic: "Sources matter more than fluent summaries."
  conflict_logic: "generation vs retrieval"
  intervention_logic: "Treat querying as an evolving epistemic game."
  scale_logic: "session"
  style_logic: "empirical"
  temporal_logic: "recursive"
  epistemic_logic: "claims answer to retrievable evidence"
  political_logic: "control of retrieval shapes available knowledge"
  symbolic_logic: "need/query/answer"

writing_bias:
  output_mode: "paper"
  density: "medium"
  realism_mode: "empirical"
  abstraction_level: "medium"
  intervention_pressure: "high"

tagline: "#ask #berrypicking #rag #provenance #query-drift"
ttl: 1
```

**RESEARCH ECHO:** Rebuild LLM querying through Belkin’s anomalous state of knowledge and Bates’s moving search path. Treat a chat session not as repeated “prompts” but as an epistemic trajectory in which each answer alters what can be asked next. Compare ordinary chat with grounded retrieval and preserve the passages that permit claims to escape the model’s rhetoric. The intervention is simple: **the unit of search is not the query; it is the changing relation between a knower and an evidentiary world.** `#ask #berrypicking #rag #query-drift`

---

---

## SECTION 5: THEORY OF THE PROGRAM & COMPUTATIONAL ONTOLOGY

# 05 — QUERY

## <Initial Interpretation>

This is a program for repairing an <epistemic deficit> through contact with an <external evidentiary world>.

The activity is not merely question answering.

It is **evidence-seeking**.

## <Theory Skeleton>

### <entities>

* <inquirer>
* <information need>
* <query>
* <corpus>
* <source>
* <evidence>
* <claim>
* <answer>
* <uncertainty>
* <reformulation>

### [operations]

* [ask]
* [retrieve]
* [rank]
* [inspect]
* [cite]
* [synthesize]
* [verify]
* [reformulate]

### <states>

```text
unknown
→ articulated need
→ query
→ evidence set
→ provisional answer
→ verification
→ resolved | unresolved | reformulated
```

### <constraints>

An answer cannot acquire evidentiary status merely through linguistic confidence.

### <invariants>

```text
<external claim>
[must-remain-traceable-to]
<external evidence>
```

## <Assumption Ledger>

<safe> Query and information need are not identical.

<safe> Search can change what the user realizes they need.

<uncertain> Available sources adequately represent the world in question.

<requires-user-decision> How much uncertainty is acceptable before refusing a synthesized answer?

## <Operational Description>

```text
<information need>
[is-partially-expressed-as]
<query>

<query>
[retrieves]
{sources}

{sources}
[support-or-undermine]
{claims}

{claims}
[compose]
<provisional answer>

<provisional answer>
[changes]
<information need>
```

## <Failure Description>

### Generation masquerading as retrieval

Response:

No source, no source-backed claim.

### Citation theater

A citation exists but does not support the assertion.

Response:

Test entailment, not citation presence.

### Query fixation

The system assumes the initial wording perfectly describes the need.

Response:

Permit iterative reformulation.

## <Change Test>

If questions are used to study the machine rather than the external world, <Query> becomes <Probe>.

If the exchange primarily develops through mutual turn-taking without external evidence requirements, <Query> becomes <Conversation>.

## <Residual Human Theory>

Humans often recognize relevance before they can explain it. Search systems can model retrieval but cannot exhaust the lived sense of “this is what I was actually looking for.”

---

---

## SECTION 6: RESIDUAL HUMAN THEORY (THE IRREDUCIBLE STAKES)

# 05 — QUERY

## PURPOSE

Repair an epistemic deficit through evidence external to the model.

```text
ENTITY(information need)
OP(becomes)
ENTITY(query)

ENTITY(query)
OP(retrieves)
GROUP{sources}
```

## ENTITIES

`ENTITY(inquirer)`
`ENTITY(information need)`
`ENTITY(query)`
`ENTITY(source)`
`ENTITY(evidence)`
`ENTITY(claim)`
`ENTITY(answer)`

## OPERATIONS

`OP(ask)`
`OP(retrieve)`
`OP(rank)`
`OP(inspect)`
`OP(cite)`
`OP(verify)`
`OP(reformulate)`

## INVARIANT

```text
ENTITY(external claim)
OP(remains traceable to)
ENTITY(external evidence)
```

## STATE FLOW

```text
unknown
→ query
→ evidence
→ provisional answer
→ verification
→ resolved | reformulated
```

## FAILURE

**Fluency capture:** eloquence substitutes for evidence.

**Citation theater:** a citation exists but does not support the claim.

## DRIFT

Query → Probe when the user stops asking about the world and starts asking what the model will do.

## SOVEREIGN QUESTION

**What would let me discover that this answer is wrong?**

---

---

## SECTION 7: PLAY DYNAMICS, PUZZLE & FUN THEORY

# 05 — QUERY

## THE FUN IS LEARNING WHAT TO ASK NEXT

### Cognitive puzzle

The player does not merely discover answers.

The player learns how ignorance changes shape.

### PATTERNS

`PATTERN(information need)`
`PATTERN(evidence)`
`PATTERN(relevance)`
`PATTERN(source)`
`PATTERN(query reformulation)`

### LEARNING

`LEARN(search)`
`LEARN(compare evidence)`
`LEARN(reformulate)`
`LEARN(discard misleading leads)`
`LEARN(recognize absence)`

### POSSIBILITY SPACE

```text
SPACE{
useful source,
irrelevant source,
partial answer,
contradiction,
false lead,
unexpected connection,
missing evidence
}
```

### OPTIMAL PATH

The player will seek one magic query that directly retrieves the answer.

If such a query always exists, search disappears as a game.

### BOREDOM THRESHOLD

The information need becomes boring when:

```text
question
→ direct answer
```

with no epistemic transformation.

### LEARNING TRANSITION

```text
I don't know
→ I know what to ask
→ I know where to look
→ evidence complicates question
→ better question
```

### FAILURE

Opaque retrieval feels random.

Perfect retrieval becomes vending-machine interaction.

### ARTISTIC OPENING

A powerful search can make the original question look naïve.

### EXPERIENCE DESIGN

Reward useful **question changes**, not merely final answers.

The player can win by discovering that they were asking the wrong question.

### RESIDUAL HUMAN ELEMENT

Relevance sometimes arrives as recognition before explanation:

> I don't know why yet, but this is the thing.

---

