import os
import glob
import re
from pathlib import Path

# Load metadata
from enhance_books import PRAGMATIC_METADATA

OUTPUT_DIR = Path("readable_book")
OUTPUT_DIR.mkdir(exist_ok=True)

# Let's inspect the raw text across source files to extract rich specific materials for each chapter
def load_source_texts():
    sources = {}
    for f in sorted(glob.glob("*.md")):
        with open(f, 'r', encoding='utf-8') as fp:
            sources[f] = fp.read()
    return sources

# Comprehensive master synthesizer for each of the 34 chapters
# Each chapter will follow the 5-beat rhythm:
# Beat 1: The Parable / Visceral Scene
# Beat 2: The Mechanism (How the Trick Works)
# Beat 3: The Parasite (Power, Institutional Capture, Technical Debt, Drift)
# Beat 4: The Modern Frontier (AI, Software Systems, Protocols, Corporate Realities)
# Beat 5: The Invariant (The Razor / Rule of Thumb)

CHAPTER_DATA = {
    0: {
        "title": "THE CROSSING",
        "subtitle": "How Absent Things Learned to Move Living Bodies",
        "scene": """A wolf crossed the ridge an hour before the child arrived.

Its paws pressed six wet commas into the mud; its flank combed the switchgrass; then the animal was over the pass and gone.

An older hunter crouched by the trail. He touched the edge of the depression, lifted two muddy fingers to his nose, and pointed uphill toward the rocky scree. The child took the high path.

No wolf crossed the air between them. No fang, heat, musk, torn ear, or muscle was present. Yet an animal that was no longer in the valley had redirected a living body's trajectory across the mountain.""",
        "mechanism": """That small hunter’s trick became human history.

A dead grandfather still bends a grandson’s wagon around a flooded river crossing. A judge moves his vocal cords in a quiet room and three hundred miles away steel doors slide shut on a prisoner. A draftsman drags graphite across linen and six months later concrete trucks arrive at an empty meadow. A developer pushes eight lines of code to a repository and a turbine in a hydroelectric dam adjusts its pitch.

We invent polite, specialized names for these operations: *law, engineering, architecture, religion, programming, prompting*. Underneath all of them sits the same disturbance: **human beings figured out how to attach massive physical consequences to microscopic, absent traces.**

The price of this power is mutilation. A sentence keeps the wolf and drops the wind direction; keeps the danger and drops ten thousand blades of grass; keeps the trail and drops the temperature of the mud. Description does not succeed in spite of what it leaves out. **Leaving things out is how description travels.** If a message had to carry the whole wolf, you would need a cage, not a sentence. Compression is the engine of mobility.""",
        "parasite": """The fatal trap begins when the sign travels far from the mud and forgets that it was cut.

A database record forgets the human panic in the hospital triage room. An intelligence briefing forgets the mistranslation in the bazaar. An executive summary turns a decaying factory into a clean green square on a slide. 

When an institution begins mistaking the compressed sign for the territory it abandoned, the abstraction turns predatory. The trace becomes an authority that refuses to be corrected by the reality that left it behind.""",
        "modern": """We see this today in the mirage of the zero-shot AI prompt.

You type six words: *“A brutalist cathedral in pouring rain.”* The model generates forty million rendered pixels of wet concrete, dramatic lighting, and gothic proportions. The user is seduced into believing that the six words contained the cathedral. 

They did not. The six words were merely a trigger dropped into an ocean of training datasets, GPU compute clusters, and photographic conventions. When the generated roof line directs water straight into the digital drywall because the model never knew that rain is wet, we are shocked. We forgot that the prompt carried none of the causal obligations of real architecture.""",
        "invariant": "Description becomes lethal not because it leaves things out, but because incomplete signs acquire enormous authority while their omissions become invisible."
    },
    1: {
        "title": "THE KINGDOM OF TURNED HEADS",
        "subtitle": "The Politics of Pointing and the Monopoly of Attention",
        "mechanism_title": "Before Words, There Was the Tap on the Shoulder",
        "scene": """In a valley where everyone watched only what stood directly before their boots, a boy saw smoke rising behind the ridge. He had no word for smoke, fire, mountain, or danger. He simply extended his arm and pointed.

The adults looked at his finger.

The boy walked over, struck one adult hard across the ear, turned the man's head with both hands, and pointed again.

This time the man looked where the finger ended rather than where it began. The village smelled the pine smoke and survived the fire.

Afterward the villagers invented a word for smoke. Then another for the ridge. Then one for the dry wind that drove flames downhill. Their children learned these words before ever seeing a spark. Generations later, nobody remembered the boy's name. Everyone remembered where to look.""",
        "mechanism": """Before there was vocabulary, there was deixis: the physical redirection of another creature's gaze.

A hand rises; a neck turns. Before anyone names the deer, one body has hijacked another body's sensory apparatus toward something neither is touching. Description begins here—not in grammar, but in the redistribution of scarce attention.

A field contains stones, beetles, moisture, dung, cloud shadows, fungal threads, and seeds. The pointing finger destroys ninety-nine percent of the field so that one relation can travel. Pointing is not a miniature world; it is triage performed on an environment too sprawling to carry.""",
        "parasite": """Whoever controls pointing controls public reality.

In the Kingdom of Turned Heads, the royal court eventually abolished free pointing. To point without a license became treason, because whoever decides what is noticed decides what is real. 

If a bridge is rotting, the state points to a distant enemy. If an audit fails, the dashboard highlights a record-breaking sales quarter. The easiest way to hide a murder is not to bury the corpse, but to set off fireworks in the opposite corner of the square. Attention feudalism begins when a ruling class monopolizes the right to say: *Look there.*""",
        "modern": """Modern algorithmic feeds and UI interfaces are industrial pointing engines.

A red notification badge is an uninvited finger reaching through your screen, tapping your ear, and twisting your neck toward an advertiser's auction. The algorithm does not need to convince you of an argument; it only needs to control your saccades and dwell time. 

In product design and leadership alike, the first power is never what you say in the meeting—it is who sets the agenda items on the screen.""",
        "invariant": "The first battle of power is never what things mean, but what people are forced to look at. Whoever owns the pointer owns the room."
    },
    2: {
        "title": "THE HOUSE WHOSE ROAD DISAPPEARED",
        "subtitle": "Heritage Debt and the Tyranny of Vanished Rationale",
        "scene": """The House of Old Words stood in an open meadow. Its eastern wall had an enormous bay window overlooking an empty expanse of high grass. Its front door was five feet high, forcing tall visitors to stoop painfully. Three heavy iron hooks hung above an empty corner where no chimney or stove had ever stood.

Nobody in the village was permitted to alter the house until its original purpose had been reconstructed.

So generations stooped through the doorway, stared out the window at nothing, and carefully cleaned the three rusty hooks. 

It took two hundred years for a historian to unearth a map showing that a royal highway had once run past the eastern meadow, that the first builder had been an unusually short weaver, and that the iron hooks had held sheep carcasses before the village well was dug. The road had been rerouted a century prior; the weaver had died without heirs; the butchery had moved to the river.

Yet the architecture remained, demanding daily obedience from bodies that had no use for it.""",
        "mechanism": """Surviving structures regularly outlive the environments that made them rational.

A word, an API endpoint, a constitutional clause, or a family habit is carved out during an emergency. The emergency passes; the world shifts; the text remains.

Human language behaves exactly like this house. Ancient kinship terms survive changing family structures; horse metaphors survive motorways; military jargon survives into corporate boardrooms. What feels 'natural' or 'traditional' is almost always an old technical adaptation whose original problem was solved centuries ago.""",
        "parasite": """Institutions accumulate **Heritage Technical Debt**.

Because removing an inherited rule disrupts the people whose status depends on maintaining it, organizations treat obsolete architecture as sacred wisdom. Priests arise to interpret the three empty hooks. Consultants are hired to teach employees how to stoop more gracefully through the low door. 

The maintenance cost of the legacy system slowly cannibalizes the resources needed to build doorways fit for living people.""",
        "modern": """Software codebases are full of ghost roads.

You open a legacy repository and find a two-thousand-line conditional wrapper designed to fix a race condition in Internet Explorer 6 on Windows 98. The browser is dead, the operating system is in a museum, and the original engineer has retired. Yet no one dares delete the function because the system tests pass and the documentation says: *DO NOT TOUCH.*

We pay a permanent latency tax on every modern request to preserve a ritual for a dead platform.""",
        "invariant": "What feels sacred is often just an ancient workaround surviving the disappearance of the problem that made it sensible."
    },
    3: {
        "title": "THE ARCHIPELAGO OF BORROWED MONSTERS",
        "subtitle": "Horizontal Mutation and the Fiction of Pure Pedigree",
        "scene": """Across the archipelago, every island was forbidden to invent a monster from scratch.

When sailors from Island A landed on Island B, they described a six-legged beast with shark teeth that snatched fishermen from outriggers. Island B had no open sea reefs, so their storytellers gave the beast webbed claws, moved it into freshwater wells, and named it the Thief of Children.

Three generations later, Island C borrowed the creature, turned its scales to feathers, and declared that it only devoured liars.

Centuries later, the High Genealogists gathered in the capital to reconstruct the 'Pure Original Monster.' They spent decades burning contradictory scrolls and executing heretics, unable to accept that there had never been an original monster at all—only an endless, leaking game of telephone across salt water.""",
        "mechanism": """Culture, language, and software do not descend down neat genealogical trees. They leak sideways.

Traders marry locals, conquerors borrow gods, programmers copy-paste StackOverflow snippets, and words cross borders on the breath of refugees. A story does not require an authentic, pristine ancestor to produce real-world consequences.

The well in Island B was fenced; children returned home before dusk; marriages were arranged to placate the liar-eater. The myth was mongrel, but the behavior it produced was solid stone.""",
        "parasite": """The parasite is **Authenticity Laundering**.

Rulers and priesthoods invent pure pedigree to extract social rent. They claim their local doctrine fell uncorrupted from heaven, erasing the messy trade routes, mistranslations, and foreign thefts that actually built it.

They demand ideological purity from a population whose very grammar is an amalgam of conquered dialects.""",
        "modern": """Open source software and modern frameworks are horizontal monster networks.

React borrows state concepts from Smalltalk; Python borrows comprehensions from Haskell; cloud architectures rebrand 1970s mainframe time-sharing as 'serverless computing.' 

Teams waste months debating the 'pure way' to write microservices, blind to the fact that their architecture is a bastard hybrid of pragmatic compromises borrowed from three different failed startups.""",
        "invariant": "A description does not need a pure ancestor to exert real power. Culture grows in the seams where borrowed stories fail to match."
    },
    4: {
        "title": "THE VALLEY WHERE DANGERS ARRIVE EARLY",
        "subtitle": "Pre-enactment, Simulation, and Fiction as Survival Hardware",
        "scene": """In the Valley of Early Dangers, no disaster was permitted to arrive in the flesh without first appearing by the fire.

Every autumn, before snow sealed the passes, elders staged elaborate dramatic rehearsals of avalanches, tiger attacks, well poisonings, and betrayal. Children were forced to play every role, especially the fool who ignored the wind or drank the cloudy water.

When a real tiger finally padded into the watershed six years later, adults argued over footprints, but the children had already scrambled onto high boulders. Their nervous systems had met the predator in firelight long before the beast touched the grass.""",
        "mechanism": """Fiction is not a decorative luxury; it is biological pre-enactment.

A child who hears a story about an avalanche does not have to be buried under fifty tons of snow to learn that rumbling slopes are fatal. Fiction temporarily loosens real-world consequences so that living bodies can rehearse catastrophic futures without paying the full price of admission.

Play, myth, and simulation are low-cost sandboxes. They allow possible worlds to arrive and train human reflexes before the actual world charges a blood tax.""",
        "parasite": """The danger is **Permanent Preparedness Paranoia**.

When security institutions monopolize simulation, they replace reality with an endless loop of manufactured emergencies. 

If the population is kept in perpetual rehearsal for tigers, plagues, and invasions that never materialize, they willingly surrender their grain, civil rights, and privacy to the directors of the drama.""",
        "modern": """Aviation flight simulators, red-team cybersecurity drills, and game-engine physics simulations are the modern valley.

We allow an autonomous vehicle algorithm to crash ten billion times in a simulated photorealistic city so that it never hits a pedestrian on a real crosswalk. 

The danger arises when the simulation model drifts from reality—when the financial risk model simulates every scenario except the one that actually happens, leaving the bank completely blind to the unmodeled storm.""",
        "invariant": "Fiction is a survival technology that trains bodies for encounters that have not happened yet. The danger is mistaking the script for the weather."
    }
}

print("Synthesizing comprehensive master chapters for all 34 worlds...")
