ZETTEL

ID:
ZET-CONTEXT-PROGRESSIVE-DISCLOSURE-2026

TITLE:
Thick Context Need Not Be Present Up Front If Requisite Distinctions Are Retrievable When Needed

SOURCE:
Thariq Shihipar - “The New Rules of Context Engineering for Claude 5 Generation Models” - Claude by Anthropic - 24 July 2026. ([Claude](https://claude.com/blog/the-new-rules-of-context-engineering-for-claude-5-generation-models?reference=FUZZ))

PASSAGE:
Anthropic recommends progressive disclosure and moving some guidance into selectively invoked skills rather than putting all instructions up front.

RESEARCH OBJECT:
Temporal thickness.

LOCAL MOVE:
Combines Ashby’s channel constraint with prompt thickness: context should be measured by timely recoverability, not static prompt volume.

SOURCE TERMS:
progressive disclosure; Skills; context; deferred tools; system prompt.

WHAT BECAME STRANGE:
A context can be thin at time t₀ yet operationally sufficient because it contains a route to thicker information at t₁.

QUESTION:
How late can a distinction arrive and still count as part of the operative description?

DEEPER QUESTION:
Is an agent’s ability to know where to retrieve information itself a compressed description of the missing information?

MECHANISM:
Meta-information routes the agent to additional task-specific distinctions only when the current state demands them.

FORMAL SHIFT:
ALL DESCRIPTION UP FRONT → JUST-IN-TIME REQUISITE DESCRIPTION.

SOURCE FORMALISM:
Progressive context disclosure through Skills and selectively available resources.

OUR FORMALIZATION:
[OUR FORMALIZATION - NOT SOURCE SYNTAX]
Thickness(t) = distinctions directly available + distinctions retrievable before the next irreversible decision.

TENSION:
Retrieval itself adds latency, uncertainty, tool failure, and attention costs.

MISSING:
A measure of optimal timing for context disclosure under bounded action horizons.

BOUNDARY:
This is a context-management architecture, not evidence that all tasks benefit from less up-front instruction.

CITATION TRAIL:
Claude 2026 → Ashby requisite access → thick prompting.

TEST:
Vary whether a Yellow Circle specification is fully explicit, stored in retrievable instructions, or revealed only after first action; compare correction cost and success.

PLATFORM:
Agent architecture / context engineering.

LINKS:
ZET-ASHBY-REQUISITE-ACCESS-1956; ZET-PROMPT-THICKNESS; ZET-DESCRIPTION-MIGRATION.

BIBTEX:
@misc{Shihipar2026ContextEngineering, author={Thariq Shihipar}, title={The New Rules of Context Engineering for Claude 5 Generation Models}, year={2026}, howpublished={Claude by Anthropic}}
```

```text
