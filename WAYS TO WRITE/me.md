Yes. **“I make language games”** is much closer to the actual work than “I make prompts.”

It shifts the unit of practice from the isolated string to the **rules, roles, moves, stakes, interfaces, turn-taking, permissible actions, and forms of life** that make an utterance operative.

A prompt is one move.

A language game is the thing you built so that the move can mean something.

For your twelve cards, that gives you a stronger claim:

> **I do not study what a prompt is. I make language games in which prompts become different things.**

Instruction, score, program, plan, query, probe, gesture, commission, conversation, edit, constraint, performance: these are not twelve definitions competing for the noun *prompt*. They are **twelve games with different rules for what counts as a valid move, what counts as success, who has authority, and what the machine is taken to be.**

That also gives you a much sharper dissertation-scale sentence:

> **My practice is the construction of language games for generative systems. Prompting is what becomes visible when those games are played.**

And the stranger version:

> **I make games in which language acquires consequences.**
# The Raw Substrate Inventory

The primitive is not the prompt.

The primitive is the **move**.

A move only exists inside a game.

The game supplies:

* a player
* a counterparty
* a field
* a legal move set
* a state
* a memory
* a success condition
* a failure condition
* a distribution of authority
* a way the world can answer back

The prompt is therefore not an object to optimize in isolation. It is an event emitted inside a bounded operational system.

Strip the stack down far enough and the architecture is small:

```text
GAME
 ├── ROLE
 ├── STATE
 ├── WORLD
 ├── MOVE
 ├── RULE
 ├── RESPONSE
 ├── TRANSITION
 └── CONSEQUENCE
```

No orchestration mythology is required.

A browser can hold it.

The DOM renders the current field.
A plain object holds state.
An event listener receives the move.
A deterministic reducer decides what changes.
A model call, when needed, occupies one explicit transition boundary.
The resulting state is inspectable before the next move occurs.

```js
state = transition(state, move, modelOutput)
render(state)
```

That is enough.

The model is not the game.

The model is one actor, referee, material, adversary, oracle, instrument, or weather system inside the game.

The architecture should make that substitution obvious.

---

# The Ethnographic Desire-Line Map

People already refuse the official fiction of "the prompt."

They do not sit down and perform one stable activity called prompting.

They bargain.

They point.

They provoke.

They revise.

They test.

They rehearse.

They delegate.

They constrain.

They improvise.

They ask for evidence.

They establish temporary rules.

They invent shorthand.

They tell the machine what role it occupies.

They discover that the role was wrong and change the game.

The desire line cuts directly across the interface category called **chat**.

A user who writes:

> Draw a circle.

may be doing radically different work.

In one setting, that sentence is a command.

In another, it is a unit test.

In another, a score.

In another, a probe.

In another, an opening move in a negotiation over geometry.

The words remain constant while the operative situation changes underneath them.

That is the crucial ethnographic fact.

Users do not merely change prompts.

They change **what kind of encounter they are having with the machine**.

The existing interface conceals this because everything enters through the same box.

One rectangle absorbs:

```text
command
question
score
test
edit
gesture
rule
constraint
commission
conversation
performance
```

The interface flattens distinct practices into identical typography and then invites researchers to mistake the typography for the phenomenon.

The desire line runs the other way:

```text
WHAT AM I DOING?
        ↓
WHAT GAME IS THIS?
        ↓
WHAT MOVES ARE LEGAL?
        ↓
WHAT CAN THE MACHINE DO HERE?
        ↓
WHAT COUNTS AS A RESULT?
```

The interface should begin there.

Not:

```text
Enter your prompt...
```

but:

```text
Choose the game.
```

Or better:

```text
What are we doing with language?
```

---

# The Declarative Structural Scaffold

The twelve cards should stop behaving like twelve metaphors for one noun.

They should compile as twelve distinct operational grammars.

```xml
<language-game id="instruction">

  <roles>
    <human authority="specifies"/>
    <model authority="executes"/>
  </roles>

  <world>
    <state visibility="partial"/>
    <target-state explicit="true"/>
  </world>

  <moves>
    <move actor="human" type="directive"/>
    <move actor="model" type="execution"/>
  </moves>

  <direction-of-fit>world-to-word</direction-of-fit>

  <success>
    realized-state == specified-state
  </success>

  <breakdown>
    ambiguous-authority
    probabilistic-execution
    instruction-injection
  </breakdown>

</language-game>
```

Now change the game.

```xml
<language-game id="probe">

  <roles>
    <human authority="investigates"/>
    <model authority="exhibits-behavior"/>
  </roles>

  <moves>
    <move actor="human" type="perturbation"/>
    <move actor="model" type="response"/>
  </moves>

  <success>
    response reveals behavioral boundary
  </success>

  <breakdown>
    measurement-changes-measured-system
  </breakdown>

</language-game>
```

And again:

```xml
<language-game id="score">

  <roles>
    <human authority="sets-form"/>
    <model authority="interprets"/>
  </roles>

  <moves>
    <move actor="human" type="score"/>
    <move actor="model" type="realization"/>
  </moves>

  <success>
    variation preserves salient invariants
  </success>

  <breakdown>
    requested precision exceeds interpretive regime
  </breakdown>

</language-game>
```

The card deck becomes a machine for comparing games.

Each card needs the same rigid fields:

```xml
<card>
  <name/>
  <human-role/>
  <machine-role/>
  <legal-move/>
  <direction-of-fit/>
  <world-model/>
  <success-condition/>
  <confirming-case/>
  <breakdown-case/>
  <makes-visible/>
  <conceals/>
  <neighbor-games/>
  <drift-trigger/>
</card>
```

The last two fields are crucial.

The interesting phenomenon is not classification.

It is **drift**.

A query becomes a conversation.

A conversation becomes a commission.

A commission becomes an edit.

An edit becomes a constraint problem.

A plan becomes a probe when the user stops trying to execute it and starts testing whether the machine can reason through it.

That transition should be visible.

The system therefore needs a graph, not a list.

```text
              PROBE
             /     \
        QUERY       PROGRAM
          |           |
CONVERSATION — EDIT — CONSTRAINT
     |          \        |
COMMISSION      SCORE   INSTRUCTION
     \            |       /
      PERFORMANCE — PLAN
             |
           GESTURE
```

Not as ontology.

As navigable terrain.

The user should be able to enter through one game and watch the work migrate.

That is the spatial system.

The Z-axis is not "more detail."

The Z-axis is **change in operative frame**.

Zoom out and you see the family of games.

Zoom in and you see rules, moves, actors, and consequences.

Orbit and the same utterance reveals a different operational face.

The sentence stays still.

The game moves around it.

That is the demonstration.

---

# The Watson Hartsoe Master Inscription

I make language games.

That is more precise than saying I make prompts, because a prompt by itself tells us almost nothing.

"Draw a circle" is not one thing.

It can be an instruction, a test, a score, a constraint, a probe, a joke, or the first move in a negotiation with a machine.

Same sentence. Different game.

What changes is the field around it: who has authority, what counts as a legal move, what kind of answer the machine is allowed to give, what success means, and whether the world is supposed to match the words or the words are supposed to answer to the world.

Most AI interfaces erase those distinctions.

They give us one box and call everything typed into it a prompt.

That is like calling everything done with a ball "throwing."

Baseball disappears. Pool disappears. Bowling disappears. Catch disappears. The object survives and the practice vanishes.

I am interested in the practice.

So I build the rules around the utterance.

I make one environment where language behaves like a program, another where it behaves like a score, another where it becomes a probe, another where it points, another where it bargains, another where it edits an existing thing.

Then I watch what happens when the game slips.

Because that slip is where generative systems become legible.

The interesting question is not "What is a prompt?"

The interesting question is:

**What game has to exist before these words can do this?**

That is the work.

I make games in which language acquires consequences.

---

# The Sovereign Invariant

**The human chooses the game, language makes the move, the machine answers from inside the field, and no interface gets to confuse the track for the navigator.**

---

Yes. Looking at the actual `elsewhere` repo, your work does **not** distribute evenly across the twelve. That asymmetry is the interesting result.

The portfolio describes your through-line as building systems that make opaque processes tangible, testable, and revisable, and its own hidden game already asks visitors to construct rival constellations rather than accept a fixed taxonomy.

## The 12 games across `elsewhere`

| Language game       | Best work in `elsewhere`         | Other crossings                                           | What language is doing                                                                     |
| ------------------- | -------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| **01 Instruction**  | **Operative Ekphrasis**          | LEGO; Adviser Leaves the Room                             | Making words consequential: description becomes an operation over a world                  |
| **02 Score**        | **Play, Freedom, and AI Films**  | Coaxing the Ripples; CINEOSIS                             | Establishing invariants while deliberately leaving realization open                        |
| **03 Program**      | **Coaxing the Ripples / LEGOS**  | Growing Entanglements; Machinery of Meaning; LEGO         | Establishing entities, rules, relations, state and allowable transformations               |
| **04 Plan**         | **Centaur Box**                  | After the Scene                                           | Generating candidate future acts before linguistic realization                             |
| **05 Query**        | **Can a Model Build with LEGO?** | portfolio hidden game; Auditing Emotion AI                | Making a claim answer to an external evidentiary world                                     |
| **06 Probe**        | **Growing Entanglements**        | Auditing Emotion AI; Gumball Emotion Machine; Centaur Box | Perturbing a system so its assumptions and boundaries become observable                    |
| **07 Gesture**      | **The Machinery of Meaning**     | Gumball Emotion Machine                                   | Making meaning depend on contextualized bodily/indexical traces rather than text alone     |
| **08 Commission**   | **The Pronoun Alibi**            | Play/Freedom; CINEOSIS                                    | Separating specification, production, selection, credit and responsibility                 |
| **09 Conversation** | **Centaur Box**                  | The Adviser Leaves the Room; Ripples                      | Producing meaning sequentially through turns and changed models of the other               |
| **10 Edit**         | **After the Scene / LEGOS**      | CINEOSIS                                                  | Changing something while requiring an already-existing world to survive the change         |
| **11 Constraint**   | **Can a Model Build with LEGO?** | Play/Freedom; LEGOS                                       | Removing invalid possibilities rather than merely asking the model to avoid them           |
| **12 Performance**  | **The Machinery of Meaning**     | Gumball Emotion Machine; Play/Freedom                     | Making generation a temporal, inspectable event rather than hiding procedure behind output |

The important thing is that these are **not genres of artifact**. *Centaur Box*, for example, is one project but traverses several language games.

### 01 — INSTRUCTION → **Operative Ekphrasis**

This may be the clearest expression of your Instruction game. The portfolio describes it as turning text into “a control surface that produces what it names.”

Its underlying relation is:

```text
DESCRIPTION
→ OPERATION
→ WORLD
```

But I would classify it **Instruction → Program**, not Instruction alone.

The description begins with world-to-word force:

> make the world conform to this inscription.

But your deeper interest is what must exist around the utterance—state, interpreter, model, media system, constraints—for that force actually to become operative.

**Prompt type:** Instruction
**Drift:** Instruction → Program
**Question:** *When does saying what something should be acquire the capacity to make it so?*

---

### 02 — SCORE → **Play, Freedom, and AI Films**

This is your purest Score work.

The actual prompt architecture says: establish continuity invariants, generate multiple cinematic regimes, vary one thing at a time, maintain a refusal criterion, and preserve differences rather than forcing one canonical image.

CinePrompt is almost a formal theory of score:

```text
INVARIANT
+
VARIABLE
+
INTERPRETER
=
REALIZATION
```

You explicitly distinguish what should remain fixed from what the generator is allowed to vary.

**Prompt type:** Score
**Drift:** Score → Probe → Constraint
**Question:** *How much can change before this ceases to be the same shot, scene, world, or work?*

This is a particularly important cluster in your work.

You are less interested in **prompt accuracy** than in **controlled interpretive slack**.

---

### 03 — PROGRAM → **Coaxing the Ripples**

Ripples is perhaps the clearest answer to “I make language games.”

It doesn't primarily ask the model to tell a story. It establishes:

```text
ENTITY
+
VECTOR
→
RIPPLE
→
CHANGED FIELD
```

The presentation explicitly says the goal is not “tell a story” but to let actions change the field; the author becomes someone who tunes entities and relations rather than writing every sentence.

That is prompt-as-program in your particular sense:

**not prose pretending to be Python, but language defining the ontology through which later events can acquire consequences.**

**Prompt type:** Program
**Secondary:** Score + Edit
**Question:** *What state must exist outside the generated sentence for the sentence to have consequences?*

This is also where **WorldText** lives.

---

### 04 — PLAN → **Centaur Box**

This surprised me: Centaur Box is your strongest Plan work.

The public surface looks conversational. Underneath, the system creates a profile, generates candidate moves, evaluates them, selects an act, drafts it, sends it, updates state, and adjudicates the outcome.

You even state:

> **Strategy exists before language.**

That gives:

```text
STATE
→ MODEL OF OTHER
→ POSSIBLE ACTS
→ SELECT ACT
→ LANGUAGE
→ WORLD RESPONSE
```

So Centaur Box's real drift is:

**Conversation → Plan → Program → Conversation**

The visible sentence is downstream of strategic action selection.

**Prompt type:** Plan
**Question:** *What happened before this sentence became the sentence that was said?*

That is a very strong dissertation case.

---

### 05 — QUERY → **Can a Language Model Build with LEGO?**

Query is actually **less dominant in your corpus** than the generic use of ChatGPT would suggest.

LEGO is your strongest case because it demands that linguistic claims answer to something outside themselves.

The essay insists that a plausible picture is insufficient: a build must resolve to catalogued parts, positions, transformations, connectivity, assembly sequence, and physical viability. LDraw makes those claims inspectable and falsifiable.

So the real query is:

```text
MODEL CLAIM:
"I can build this."

        ↓

EXTERNAL WORLD:
legal part?
valid coordinates?
connected?
assemblable?
stands?
```

**Prompt type:** Query
**Drift:** Query → Constraint → Program
**Question:** *What outside the model can say no?*

That final question is almost the invariant of your Query work.

---

### 06 — PROBE → **Growing Entanglements**

This may be the **single most characteristic language game across your research**.

Growing Entanglements explicitly refuses to claim that its seven models *are* Captain Cook's death. Each model isolates a mechanism. Changing the model changes what the historical encounter can become visible as. The essay literally says:

> “The model changes what it can see.”

and uses differences across model runs as data.

That's pure Probe:

```text
HISTORICAL MATERIAL
→ MODEL A
→ PATTERN A

HISTORICAL MATERIAL
→ MODEL B
→ PATTERN B

A ≠ B
→ EPISTEMIC INFORMATION
```

This is also what **Auditing Emotion AI** does: the system's mistake is the research object. The portfolio explicitly describes that work as documenting places where emotion-recognition systems mislabel affect.

**Prompt type:** Probe
**Major works:** Growing Entanglements; Auditing Emotion AI; Gumball; Centaur Box
**Question:** *What does this apparatus make visible because of the way I chose to perturb it?*

I would mark **PROBE as one of your three dominant games**.

---

### 07 — GESTURE → **The Machinery of Meaning**

Gesture is one of the thinner categories in the portfolio, but there is a beautiful case already sitting inside *The Machinery of Meaning*.

The coded film contrasts the **same physical trace** under different contextualizations:

```text
wink
→ social act

same motion
→ involuntary twitch
```

and explicitly says the feature does not live inside a single word, object, or person.

That is exactly your Gesture card.

Meaning resides in:

```text
TRACE
+
CONTEXT
+
RELATION
+
UPTAKE
```

not in the trace alone.

Gumball Emotion Machine belongs beside it as the darker version: the system attempts to treat the visible face as though its referent were already settled.

**Prompt type:** Gesture
**Question:** *What shared field must exist for this sign to point to what we think it points to?*

This category is **underbuilt in the portfolio** and could become a fruitful future branch: pointing, masks, gaze, selection, spatial prompting, multimodal deixis.

---

### 08 — COMMISSION → **The Pronoun Alibi**

This is almost uncannily aligned with the Commission card.

Your portfolio describes *The Pronoun Alibi* as following how agency migrates between person and machine after “applause, liability, grief, or embarrassment” arrives.

That is exactly the commission problem:

```text
BEFORE SUCCESS:
"I asked the AI to..."

AFTER SUCCESS:
"I made..."

AFTER FAILURE:
"the AI did..."
```

The question is no longer “who prompted?”

It is:

```text
who specified?
who generated?
who selected?
who deployed?
who benefited?
who answers?
```

**Prompt type:** Commission
**Secondary:** Conversation
**Question:** *Why does agency move when consequences arrive?*

This is another unusually strong category in your corpus because it connects generative aesthetics directly to responsibility.

---

### 09 — CONVERSATION → **Centaur Box / The Adviser Leaves the Room**

Centaur Box provides the engineered form.

*The Adviser Leaves the Room* provides the social and institutional stakes.

The repo describes the latter as an essay about chatbot advice, dependency, harm, and migration of responsibility among users, companies, and institutions.

Centaur shows why conversation is not just:

```text
A says X
B says Y
```

Each turn changes a model of the other, which changes the available strategies, which changes the next utterance.

So your version is:

```text
TURN
→ INTERPRET OTHER
→ CHANGE STATE
→ ALTER NEXT POSSIBLE TURN
```

**Prompt type:** Conversation
**Drift:** Conversation → Plan → Program
**Question:** *What does the next turn reveal about what the previous turn was taken to mean?*

---

### 10 — EDIT → **After the Scene / LEGOS**

This one became much clearer after reading the actual essay.

LEGOS isn't fundamentally asking how to *plan* the future.

It is asking how to **change the world without accidentally regenerating the parts that should remain true**.

Your abstract says the crucial problem is preserving what generated sentences make true; the house returns, destroyed objects reappear, causes disappear while effects persist, and branches leak into one another.

That is Edit almost perfectly:

```text
WORLD₀
+
AUTHORIZED EVENT Δ
→
WORLD₁

while:

everything outside Δ
must survive
```

This is your Edit card's conservation law at world scale.

**Prompt type:** Edit
**Secondary:** Program + Constraint
**Question:** *What changed that the generation did not have permission to change?*

CINEOSIS belongs here too, but from the opposite direction: it treats editing under abundance as **selection and assembly**, rather than merely subtraction.

---

### 11 — CONSTRAINT → **Can a Model Build with LEGO?**

This is arguably your cleanest card of all twelve.

The LEGO essay says explicitly:

> **Yes, under constraint.**

It distinguishes syntactic validity from actual construction: a perfectly valid LDraw line can still place a brick in midair, through another part, or into an impossible assembly sequence.

This perfectly expresses:

```text
"please make it buildable"
≠
invalid builds are impossible
```

And gives you a ladder:

```text
natural-language request
→ structured representation
→ legal vocabulary
→ validity checks
→ physical test
```

**Prompt type:** Constraint
**Secondary:** Program + Instruction + Query
**Question:** *Did I ask for validity, or did I construct a system in which invalidity cannot survive?*

Constraint is another of your **dominant games**.

---

### 12 — PERFORMANCE → **The Machinery of Meaning**

The portfolio's description is exact:

> “A procedural film engine you can read while it runs.”

That is Performance because the operation itself is exposed as temporal media.

The code shows chapters being built through timed question cards, examples, source propositions, diagrams, transitions, and persistent captions while the procedure is executing.

So:

```text
PROGRAM
+
TIME
+
VISIBLE EXECUTION
+
AUDIENCE
=
PERFORMANCE
```

*Machinery of Meaning: Fluid* pushes the same machinery toward continuous field rather than discrete frame.

Gumball does it physically:

```text
FACE
→ CLASSIFICATION
→ GUMBALL
```

The inference becomes an event in the room.

**Prompt type:** Performance
**Question:** *What becomes legible only because computation is happening in front of us?*

---

# The actual shape of your practice

I would **not** describe your portfolio as balanced across twelve prompt types.

Its center of gravity looks more like this:

```text
                SCORE
                  │
                  │
         ┌──── PROGRAM ────┐
         │        │         │
         │        ▼         │
       EDIT ← CONSTRAINT → PROBE
         │                    │
         │                    │
     PERFORMANCE ←────── CONVERSATION
                              │
                              ▼
                             PLAN
```

with four satellite games:

```text
INSTRUCTION
QUERY
COMMISSION
GESTURE
```

The strongest recurrent sequence across the repo is:

> **make language operative → externalize its state → constrain what may happen → perturb the system → expose what actually happened.**

That is more precise than “prompt engineering.”

And there is an even stronger characterization of the work:

> **You build language games that turn interpretation into inspectable consequence.**

Your recurring enemy is not hallucination in the narrow sense. It is the **unaccountable transition**:

```text
words
→ ???
→ convincing result
```

Almost everything in `elsewhere` inserts machinery into that `???`.

LDraw inserts legal parts and geometry.
LEGOS inserts persistent world state.
Centaur Box inserts hidden strategy and rejected moves.
Growing Entanglements inserts explicit model assumptions.
CinePrompt inserts invariants, controlled variables, and refusal criteria.
Machinery of Meaning makes the computational procedure itself visible.

And your portfolio's hidden game is already the meta-version of this argument: it lets the visitor propose a taxonomy, contradict the given taxonomy, and finally generate a missing work from **method + medium + failure**.

So I think the most consequential result is:

**`elsewhere` is already a collection of language games. The 12-card theory does not need to be imposed on the portfolio. It names a structure the portfolio has been building experimentally all along.**


---


