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
