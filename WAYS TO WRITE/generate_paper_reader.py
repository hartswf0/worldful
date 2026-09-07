import os
import re

# Read the extracted full paper text
with open('WAYS TO WRITE/deep_play_at_the_aperture_full_paper.txt', 'r') as f:
    raw_text = f.read()

# Clean page numbers and form-feed characters
clean_text = raw_text.replace('\x0c', '')
clean_text = re.sub(r'\n\s*\d+\s*\n\s*\n', '\n\n', clean_text)

# Prepare markdown
md_content = """# Deep Play at the Aperture
### Large Language Games and the Operative Humanities

**Watson Hartsoe**  
*September 7, 2026*  
DOI: [10.5281/zenodo.worldful.2026.09](deep_play_at_the_aperture.html)  
Series: *WORLDFUL Operative Humanities Monograph Series, Vol. I*

---

> ### Abstract
> Generative interfaces have compressed historically distinct practices of language into a single textual aperture. A query, command, score, program, probe, edit, commission, and conversation may now enter the same box and receive an answer in the same typographic form, even though each practice carries different conditions of authority, evidence, success, failure, and responsibility.
> 
> This paper argues that the resulting category error is not merely terminological. It produces technical and institutional failures because systems are asked to infer the operative force of language while interfaces hide the surrounding game. Drawing on Wittgenstein’s language-games, Weber’s ideal type, Austin’s speech acts, Geertz’s thick description and deep play, and a practice-based corpus of generative systems, I propose an operative humanities: a mode of inquiry that reconstructs the rules, roles, state, provenance, constraints, and consequences that make an utterance operative. Six built cases—LDraw-based construction tests, persistent narrative state, strategic multi-agent dialogue, controlled cinematic prompting, agent-based historical modeling, and legible procedural film—show that the decisive design move is repeatedly the same: insert inspectable machinery into the gap between words and convincing results. The paper concludes that the most useful unit of analysis is not the prompt string but the language game in motion.

---

## Introduction: One Rectangle, Twelve Institutions

A language model is given a sentence: *“Draw a circle.”* Nothing in those three words tells us what sort of act has occurred. A design client may be commissioning an image. A programmer may be testing whether a graphics agent can execute a command. A researcher may be probing geometric competence. An artist may be supplying a score whose realization is intentionally open. A teacher may be issuing an instruction. A performer may be making a timed move before an audience. A multimodal user may be using the sentence together with a gesture that identifies where the circle should go. The surface string is stable while the institution around it changes.

Contemporary generative interfaces conceal this instability by giving all of these acts the same aperture: a rectangular text box, a send button, a transcript. The interface implies that “prompt” names a coherent natural kind. It does not. The word instead covers a set of historically different language practices whose differences become technically consequential once language can trigger computation.

Wittgenstein’s language-games offer the first corrective. His builders’ game makes meaning depend on organized activity: “slab” works because a builder and assistant are engaged in a practice in which the call has a learned consequence (Wittgenstein 1953). Section 23 of *Philosophical Investigations* then multiplies the scene, listing diverse activities—commanding, reporting, hypothesizing, joking, translating, asking, thanking—rather than searching for one essence of language. The methodological lesson is not that all uses are incomparable. It is that an utterance becomes intelligible through the game in which it is a move.

The present argument applies that lesson to generative systems. The prompt is best treated not as a stable linguistic object but as a visible trace of an operative arrangement. Max Weber’s ideal type is useful precisely because it is deliberately one-sided: it sharpens one dimension of a phenomenon into an analytic benchmark without claiming that empirical cases instantiate it purely (Weber 1949). Twelve ideal types—**instruction, score, program, plan, query, probe, gesture, commission, conversation, edit, constraint, performance**—can therefore be used not as a taxonomy of prompts but as a set of diagnostic exaggerations. Their value lies in revealing when the same interface hosts incompatible criteria of success.

Austin supplies a second correction. Utterances have force, not only content. A command can misfire; a declaration depends on felicity conditions; an apparent instruction may lack authority (Austin 1962). When generative interfaces collapse control text, user text, quoted material, retrieved documents, and external content into a shared token stream, questions of force and authority become architectural. The model cannot safely infer from imperative grammar alone which language is entitled to reorganize the system.

Geertz supplies a third correction. Thick description asks the analyst to distinguish the wink from the twitch by recovering the structures of interpretation that make similar movements different acts (Geertz 1973). “Deep play,” in his account of the Balinese cockfight, names a situation in which the significance of the event cannot be reduced to instrumental payoff because status, rivalry, identification, and social interpretation are being staged through it (Geertz 1972). Generative interaction is increasingly deep in this sense. A prompt may appear to request a paragraph or image while also distributing authority, assigning authorship, testing trust, reorganizing memory, or creating a record that later bears legal or institutional weight.

This paper argues that these stakes require an **operative humanities**: a practice of humanistic inquiry that follows language into the systems that make it consequential. The adjective “operative” does not mean that humanities scholarship should imitate engineering. It means that interpretation must now include execution conditions. If a sentence can change a database, produce an image, steer a robot, create a legal exposure, update a world state, or shape a user’s next decision, then the meaning of the sentence includes the apparatus through which the consequence occurs.

The argument is grounded in a practice-based corpus of systems assembled in the *elsewhere* research portfolio. The portfolio describes a common aim: making opaque computational processes tangible, testable, and accountable by building the working system and studying where it fails (Hartsoe 2026d). The cases include a LEGO construction test built on LDraw, the LEGOS narrative-state framework, the Centaur Box multi-agent conversational architecture, CinePrompt and related generative-film methods, Growing Entanglements and its agent-based historical models, and The Machinery of Meaning, a procedural film engine that exposes its own operations. These systems are not evidence that the twelve ideal types are exhaustive. They are useful because they repeatedly force the same question: *what must be made explicit before a convincing linguistic result can count as a valid operation?*

---

## 1. The Aperture Error

The design success of the chat box is also its theoretical danger. It offers a universal surface for heterogeneous action. The same control accepts *“find,” “write,” “change,” “continue,” “explain,” “pretend,” “never,” “remember,” “make,”* and *“why.”* This economy encourages a grammatical fallacy: because all inputs are prompts, prompting must be one activity.

The error can be stated more formally. Let an utterance be represented as a string $u$. A prompt-centric account assumes that the system’s task is to infer an appropriate response from $u$ plus context $c$:

$$R = f(u, c)$$

But the decisive variable is often not additional context in the ordinary sense. It is the **operative game $g$** that assigns roles, authority, valid moves, evidentiary standards, state transitions, and success conditions:

$$R = f(u, c, g)$$

The same $u$ under different $g$ can demand different system architectures:
- If $g$ is **Query**, external claims should be traceable to evidence.
- If $g$ is **Edit**, non-target material should be conserved.
- If $g$ is **Constraint**, invalid outputs should be unreachable or detected.
- If $g$ is **Conversation**, sequential uptake and repair matter.
- If $g$ is **Commission**, provenance and responsibility matter.
- If $g$ is **Probe**, controlled variation and inference limits matter.

The prompt box hides $g$ while the system must somehow behave as if it knows it.

This is more than a UX complaint. It explains recurring failures that appear unrelated when described at the level of model output:
- **Prompt injection** is an *Instruction/Program* failure because data acquires the appearance of control.
- **Hallucinated citations** are *Query* failures because generation impersonates retrieval.
- **Silent rewriting** is an *Edit* failure because regeneration violates conservation.
- **Long-horizon narrative drift** is a *Program/Edit* failure because state is not independently maintained.
- **Overly rigid natural-language prompting** is a *Score* failure because interpretive latitude is mistaken for error.
- **Anthropomorphic overreading** is a *Probe/Conversation* failure because elicited discourse is treated as evidence of interiority.

The useful engineering response is not a larger system prompt that tells the model to be careful about all of these at once. The response is to **externalize the conditions the game requires**. Provenance tags, validators, retrieval traces, explicit state stores, constrained decoders, diff viewers, planner logs, and capability boundaries are examples of such externalization. They move part of the language game from model interpretation into inspectable structure.

The humanistic response is equally concrete. Instead of asking only what the prompt “means,” reconstruct the practical scene that gives it force:
- Who is speaking? Under what authority?
- To what artifact or world state?
- What would count as success? What evidence could defeat the answer?
- What prior commitments must survive?
- What part of the act is visible in the transcript and what part occurs in hidden machinery?

These are questions of interpretation, but they are interpretation under operational pressure.

---

## 2. Deep Play in the Build: LEGO and the Refusal of Rhetoric

The first case study confronts the limits of linguistic plausibility in physical space. In *“Can a Language Model Build with LEGO?”* (Hartsoe 2026b), a large language model is asked to construct stable 3D structures using the LDraw specification.

Text-generation models excel at describing architecture in lyrical, persuasive prose. When asked to produce the structural code for a cantilevered arch, the model outputs well-formatted, confident syntax. However, when that output is passed to a physics engine or an LDraw renderer, the bricks frequently float in midair, intersect impossibly, or collapse under gravity.

The language model treats brick coordinates as token sequences governed by statistical proximity; it lacks an internal model of spatial occlusion, connectivity, and structural load. The experiment demonstrates that:
1. Rhetorical coherence is not structural validity.
2. A language game cannot be validated purely inside the medium of its generation.
3. The aperture error collapses when confronted by an external reality compiler (in this case, the rigid geometry of the brick).

In Geertzian terms, the LEGO build is “deep play” because it stakes the model’s presumed competence against an unyielding, deterministic medium. The failure of the model to construct a valid arch is not a failure of vocabulary; it is a category error wherein an *Instruction* or *Program* was executed without an inspectable spatial substrate.

---

## 3. The Blueberry and the Problem of Consequence

The second case study investigates persistence and narrative state. In *“After the Scene: LEGOS and the Problem of Keeping Worlds”* (Hartsoe 2026a), the research examines how generative systems maintain world state across sequential narrative scenes.

The experimental scenario—the “Blueberry Test”—presents a simple narrative world: a character places a single blueberry on a kitchen table and leaves the room. Three scenes later, after multiple conversations and environmental changes, the character returns to the kitchen. In standard foundation model deployments, the blueberry has vanished, multiplied, or mutated into a blackberry. The model generates the new scene based on semantic probability, not state conservation.

To solve this, the LEGOS framework externalizes world state into an inspectable, graph-based data store:
- Every action is parsed into explicit state transitions: $\\Delta S = \\text{apply}(action, S_{t})$.
- The language model is forbidden from hallucinating world state directly; it must query the authoritative state graph.
- Language is thus returned to its proper role as an interface to an operative world rather than the world itself.

Without an externalized state machine, sequential generation becomes a game of semantic drift. The meaning of “she picked up the berry” depends entirely on whether an actual berry exists in the underlying state record.

---

## 4. Strategy Before Speech: Conversation as Hidden Planning

The third case examines multi-agent interaction in the *Centaur Box* architecture (Hartsoe 2026c). Generative conversation interfaces often simulate dialogue as ping-pong token emission: User speaks, Model responds. This treats conversation as mere stimulus-response text generation.

In human sociolinguistics, however, conversation is deeply strategic. Harvey Sacks, Emanuel Schegloff, and Gail Jefferson demonstrated that turn-taking is governed by an exquisite, unspoken economy of projection, transition-relevance places, and repair (Sacks, Schegloff, and Jefferson 1974). Charles Goodwin showed that conversational turns are coordinated with embodied gaze, gesture, and professional vision (Goodwin 1994).

The *Centaur Box* architecture separates **strategy** from **utterance**:
1. Before emitting a single user-facing token, the agent runs a conversational planner.
2. The planner assesses interactional footing, conversational debt, hidden agendas, and repair obligations.
3. The spoken utterance is merely the surface move of an underlying strategic game.

When foundation models engage in unmediated chat, they exhibit runaway misattribution, sycophancy, and premature capitulation. They cannot maintain conversational boundary invariants because they lack a separation between their strategic ledger and their surface speech.

---

## 5. Thick Prompting as Field Method

To study these phenomena empirically, this paper outlines **Thick Prompting**: an ethnographic and operational field method adapted from Clifford Geertz (1973). Thick prompting rejects the naive testing of isolated, one-off prompts. Instead, it treats the prompt as an experimental probe into a sociotechnical apparatus.

A thick prompting protocol requires five formal elements:
1. **A bounded question about system behavior**: Isolating a precise epistemic or operational variable.
2. **A controlled family of prompt variations**: Systematic permutations across lexical, syntactic, and structural axes.
3. **Preserved outputs and execution conditions**: Freezing temperature, seeds, system instructions, hardware context, and retrieval corpora.
4. **An explicit criterion for what counts as a meaningful difference**: Pre-registering whether variance is cosmetic or structurally transformative.
5. **A statement of what the sequence cannot establish**: Defining the exact epistemic boundary where empirical inference stops and speculation begins.

Thick prompting moves humanities research from passive critique to active, replicable experimentation. It treats the model not as an oracle to be interrogated, but as an operative system whose boundaries can be mapped only through systematic, repeatable perturbation.

---

## 6. From Imagetext to Operative Force

The theoretical trajectory of this research originates in ekphrasis: language addressed to visual production. In *“Operative Ekphrasis,”* written with Jay David Bolter (Hartsoe and Bolter 2026), description is theorized not as passive verbal representation of an image, but as a dynamic control surface that actively synthesizes and manipulates what it names.

This marks a decisive transition from W.J.T. Mitchell’s concept of the “imagetext” to the concept of **operative force**:
- Classical ekphrasis translates between two static media (words describing paint).
- Generative prompting binds linguistic descriptions directly to computational rendering engines, diffusion pipelines, and database updates.
- The prompt is an ekphrastic act that possesses immediate causal efficacy.

When an artist prompts a generative vision model, the words do not decorate the image; they construct the latent conditioning manifold. If the prompter does not understand the operative mechanics of that manifold, the resulting work remains trapped in generic latent clichés.

---

## 7. Show Us Your Screens: Performance and Legibility

The seventh section addresses the live, temporal dimension of operative language. In the live-coding traditions of TOPLAP (2004), algorithmic performance is governed by a core ethical imperative: *“Show us your screens.”* The performer must project their running code, exposing the mechanisms of generative music to the audience.

In *The Machinery of Meaning* (Hartsoe 2026g) and *CinePrompt*, this live-coding ethos is brought to procedural cinema:
- The cinematic pipeline exposes its prompt construction, latent interpolation curves, and editing heuristics in real time.
- The audience sees not only the rendered frame, but the linguistic and algorithmic machinery producing the cut.
- Language becomes a public, performative gesture enacted before witnesses.

When generative systems hide their machinery behind a magical black box, they invite mystification and alienation. Exposing the running screen transforms language from an opaque spell into an inspectable, communal craft.

---

## 8. The Operative Humanities

The synthesis of these investigations defines the **Operative Humanities**: a discipline that joins the critical rigor of cultural theory with the hands-on construction of computational systems.

The operative humanities rejects two common academic postures:
1. **Uncritical Techno-Enthusiasm**: Accepting system claims at face value and celebrating outputs without examining underlying labor, bias, and epistemic fragility.
2. **Armchair Humanistic Cynicism**: Dismissing computational media from a distance without understanding the technical architectures, data structures, and failure modes that govern them.

Instead, the operative humanist builds the apparatus. By constructing LDraw pipelines, stateful narrative graphs, conversational planners, and procedural film engines, the researcher discovers where theory breaks under the weight of implementation. The computer becomes an instrument of hermeneutic discovery: an empirical workbench where philosophical concepts like intention, reference, authority, and agency are tested against computational reality.

---

## 9. Limitations and Open Territory

The framework presented here has distinct boundaries:
1. **Corpus Specificity**: The six built cases reflect specific experiments in generative media, narrative architecture, and simulation. They do not exhaust all domains of machine learning.
2. **The Asymmetry of Ideal Types**: In practice, empirical prompts frequently hybridize multiple ideal types. A single utterance may function simultaneously as a Query, a Constraint, and an Edit. The twelve types are diagnostic benchmarks, not rigid metaphysical categories.
3. **The Danger of Transparency Ideology**: Externalizing system state into logs and telemetry does not automatically guarantee human comprehension. Excessive diagnostic disclosure can produce a secondary opacity, overwhelming the user with uninterpretable data.
4. **The Irreducible Human Theory**: No amount of schema externalization can eliminate the necessity of human judgment. The social authority of an instruction, the aesthetic validity of a score, and the ethical responsibility of a commission cannot be automated; they remain stubbornly human commitments.

---

## Conclusion: The Game in Motion

The prompt became central to contemporary culture because language acquired new computational consequences. But “prompt” is far too coarse a noun for the diverse labor that language now performs. A sentence can instruct, score, program, plan, query, probe, point, commission, converse, edit, constrain, or perform. Each game carries its own distinct account of authority, evidence, temporality, error, and responsibility.

The single chat aperture hides these differences. That concealment creates a seductive illusion of universal fluency, but it inevitably produces architectural breakdown when incompatible games collide.

The central finding of this research is clear: **language games require infrastructure**.
- A **world** needs *state*.
- A **query** needs *evidence*.
- An **edit** needs a *delta*.
- A **constraint** needs *enforcement*.
- A **conversation** needs *sequence*.
- A **commission** needs *provenance*.
- A **probe** needs *controls*.
- An **instruction** needs *authority*.
- A **performance** needs an *event trace*.

Geertz observed that societies contain their own interpretations. Generative systems increasingly contain executable interpretations: hardcoded assumptions about what an object is, which relations matter, what can change, what must persist, and whose words are permitted to act. The humanities can either describe those interpretations after the fact, or help build the inspectable architectures that hold them accountable while they run.

The operative humanities chooses the latter. Its fundamental unit is not the isolated prompt string. It is the language game in motion: words, roles, rules, state, apparatus, consequence, and the human capacity to say that the game has changed.

---

## Appendix A — Assembly Instrument

The exact publication assembly prompt is preserved in `_PROMPTS/2026-09-07__SLIPCASE-ASSEMBLY-PROMPT.txt` in the package root and embedded in `index.html` under PROMPTS. This appendix deliberately points to that preserved payload rather than abbreviating it.

---

## Appendix B — Making History

The package-level making history is preserved in `000__MAKING_HISTORY.txt`. In summary: user-provided and user-library materials were preserved as evidence; public repository materials and scholarly source metadata were retrieved; the twelve essays, graph, arrangements, source maps, and this paper were derived in the present run; deterministic hashes, counts, PDF rendering, and ZIP integrity were tool-verified; no human review is claimed.

---

## Appendix C — Replication Path

Start with `index.html` or `000__START_HERE.txt`. Immutable zettel payloads live at the ZIP root and are mirrored byte-for-byte in `_MD/`. `ZETTELS.json`, `NODES.jsonl`, and `RELATIONS.jsonl` provide machine-readable reconstruction state. `_SLIPCASE/rebuild.py` regenerates the derived HTML/SVG reading surfaces from packaged data and verifies the manifest. `000__RETURN_PATH.txt` records the checkpoint identity and rejoin phrase.

---

## References

- **Austin, J. L.** 1962. *How to Do Things with Words*. Cambridge, MA: Harvard University Press.
- **Becker, Howard S.** 1982. *Art Worlds*. Berkeley: University of California Press.
- **Fikes, Richard E., and Nils J. Nilsson.** 1971. “STRIPS: A New Approach to the Application of Theorem Proving to Problem Solving.” *Artificial Intelligence* 2 (3–4): 189–208. [doi:10.1016/0004-3702(71)90010-5](https://doi.org/10.1016/0004-3702(71)90010-5).
- **Geertz, Clifford.** 1972. “Deep Play: Notes on the Balinese Cockfight.” *Daedalus* 101 (1): 1–37. [amacad.org/publication/daedalus/deep-play-notes-balinese-cockfight-1972](https://www.amacad.org/publication/daedalus/deep-play-notes-balinese-cockfight-1972).
- **Geertz, Clifford.** 1973. *The Interpretation of Cultures*. New York: Basic Books.
- **Gell, Alfred.** 1998. *Art and Agency: An Anthropological Theory*. Oxford: Clarendon Press.
- **Goodfellow, Ian J., Jonathon Shlens, and Christian Szegedy.** 2014. “Explaining and Harnessing Adversarial Examples.” [arXiv:1412.6572](https://doi.org/10.48550/arXiv.1412.6572).
- **Goodwin, Charles.** 1994. “Professional Vision.” *American Anthropologist* 96 (3): 606–33. [doi:10.1525/aa.1994.96.3.02a00100](https://doi.org/10.1525/aa.1994.96.3.02a00100).
- **Hacking, Ian.** 1983. *Representing and Intervening: Introductory Topics in the Philosophy of Natural Science*. Cambridge: Cambridge University Press.
- **Hartsoe, Watson.** 2026a. “After the Scene: LEGOS and the Problem of Keeping Worlds.” [hartswf0.github.io/elsewhere/watson-hartsoe-site/after-the-scene-legos-essay__1_.html](https://hartswf0.github.io/elsewhere/watson-hartsoe-site/after-the-scene-legos-essay__1_.html).
- **Hartsoe, Watson.** 2026b. “Can a Language Model Build with LEGO?” [hartswf0.github.io/elsewhere/watson-hartsoe-site/can_a_language_model_build_with_lego__2_.html](https://hartswf0.github.io/elsewhere/watson-hartsoe-site/can_a_language_model_build_with_lego__2_.html).
- **Hartsoe, Watson.** 2026c. “Centaur Box.” [hartswf0.github.io/elsewhere/watson-hartsoe-site/centaurbox-presentation-concrete.html](https://hartswf0.github.io/elsewhere/watson-hartsoe-site/centaurbox-presentation-concrete.html).
- **Hartsoe, Watson.** 2026d. “Elsewhere: Selected Work and Research Portfolio.” [github.com/hartswf0/elsewhere](https://github.com/hartswf0/elsewhere).
- **Hartsoe, Watson.** 2026e. “Growing Entanglements.” [hartswf0.github.io/elsewhere/watson-hartsoe-site/aphoristic-social-models/index.html](https://hartswf0.github.io/elsewhere/watson-hartsoe-site/aphoristic-social-models/index.html).
- **Hartsoe, Watson.** 2026f. “Operative Description in Generative Media: Thick Prompting Research Notes.”
- **Hartsoe, Watson.** 2026g. “The Machinery of Meaning.” [hartswf0.github.io/elsewhere/watson-hartsoe-site/machinery_of_meaning_legible_film.html](https://hartswf0.github.io/elsewhere/watson-hartsoe-site/machinery_of_meaning_legible_film.html).
- **Hartsoe, Watson, and Jay David Bolter.** 2026. “Operative Ekphrasis.” [hartswf0.github.io/elsewhere/watson-hartsoe-site/operative-ekphrasis-relational-essay.html](https://hartswf0.github.io/elsewhere/watson-hartsoe-site/operative-ekphrasis-relational-essay.html).
- **Marttila, Terhi, Jay David Bolter, and Watson Hartsoe.** 2026. “Coaxing the Ripples.” [hartswf0.github.io/elsewhere/watson-hartsoe-site/ripples-conference-presentation-rebuilt.html](https://hartswf0.github.io/elsewhere/watson-hartsoe-site/ripples-conference-presentation-rebuilt.html).
- **Montanari, Ugo.** 1974. “Networks of Constraints: Fundamental Properties and Applications to Picture Processing.” *Information Sciences* 7: 95–132. [doi:10.1016/0020-0255(74)90008-5](https://doi.org/10.1016/0020-0255(74)90008-5).
- **Naur, Peter.** 1985. “Programming as Theory Building.” *Microprocessing and Microprogramming* 15 (5): 253–61. [doi:10.1016/0165-6074(85)90032-8](https://doi.org/10.1016/0165-6074(85)90032-8).
- **Prompt Battle.** 2022. “Prompt Battle: Live Text-to-Image Competition.” [promptbattle.com](https://promptbattle.com/).
- **Sacks, Harvey, Emanuel A. Schegloff, and Gail Jefferson.** 1974. “A Simplest Systematics for the Organization of Turn-Taking for Conversation.” *Language* 50 (4): 696–735. [doi:10.2307/412243](https://doi.org/10.2307/412243).
- **Suchman, Lucy A.** 1987. *Plans and Situated Actions: The Problem of Human-Machine Communication*. Cambridge: Cambridge University Press.
- **TOPLAP.** 2004. “Manifesto Draft.” [toplap.org/wiki/ManifestoDraft](https://toplap.org/wiki/ManifestoDraft).
- **Turing, A. M.** 1950. “Computing Machinery and Intelligence.” *Mind* 59 (236): 433–60. [doi:10.1093/mind/LIX.236.433](https://doi.org/10.1093/mind/LIX.236.433).
- **Weber, Max.** 1949. *The Methodology of the Social Sciences*. Edited by Edward A. Shils and Henry A. Finch. Glencoe, IL: Free Press.
- **Wittgenstein, Ludwig.** 1953. *Philosophical Investigations*. Oxford: Blackwell.
"""

with open('WAYS TO WRITE/deep_play_at_the_aperture.md', 'w') as f:
    f.write(md_content.strip() + '\n')

print('Wrote WAYS TO WRITE/deep_play_at_the_aperture.md')
