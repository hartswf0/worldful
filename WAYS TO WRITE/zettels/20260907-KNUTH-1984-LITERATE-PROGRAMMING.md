```text
ZETTEL

ID: 20260907-KNUTH-1984-LITERATE-PROGRAMMING

TITLE:
Literate programming inverts the priority of compiler over human reader by making narrative the primary architectural frame.

SOURCE:
Knuth, Donald E. — "Literate Programming" — The Computer Journal — 1984 — Vol. 27, No. 2, pp. 97–99.

PASSAGE:
[QUOTE]
"Let us change our traditional attitude to the construction of programs: Instead of imagining that our main task is to instruct a computer what to do, let us concentrate rather on explaining to human beings what we want a computer to do... The practitioner of literate programming can be regarded as an essayist, whose main concern is with exposition and excellence of style. Such an author, with thesaurus in hand, chooses the names of variables carefully and explains the significance of each variable... We should not be forced to write programs in the order dictated by the compiler."

RESEARCH OBJECT:
The dual transformation of source text into executable binary (TANGLE) and typographical manuscript (WEAVE), prioritizing human cognitive exposition over compiler sequence.

LOCAL MOVE:
Knuth invents WEB to prove that the ordering of code for machine consumption is orthogonal to the ordering of concepts for human comprehension.

SOURCE TERMS:
literate programming; WEB; TANGLE; WEAVE; macro; essayist; exposition; Pascal; TeX.

WHAT BECAME STRANGE:
Compilers forced forty years of programmers to organize their thoughts according to the topological sort of variable declarations, mistaking the machine's memory layout for logical clarity.

QUESTION:
When an AI writes a system prompt, for whom is the exposition optimized: the neural weights during inference, or the human engineer debugging its drift?

DEEPER QUESTION:
Does the natural language prompt represent the triumph of literate programming or its final degeneration into uncompilable ambiguity?

MECHANISM:
Document D written in WEB:
1. Processor WEAVE(D) -> Outputs TeX code -> Formatted typographical paper for human peer review.
2. Processor TANGLE(D) -> Strips comments, reorders macros according to machine grammar -> Executable Pascal source.

FORMAL SHIFT:
<MONOLITHIC COMPILER-ORDERED CODE>
→ <LITERATE ESSAYISTIC WEB DOCUMENT>
→ [DUAL EXTRACTION: WEAVE vs TANGLE]
→ <SIMULTANEOUS SCHOLARLY MANUSCRIPT + EXECUTABLE BINARY>

SOURCE FORMALISM:
@<Macro name@> = code chunk
TANGLE: @<Root@> recursively expanded to Pascal stream.
WEAVE: Cross-referenced index and formatted prose.

OUR FORMALIZATION:
[OUR FORMALIZATION — NOT SOURCE SYNTAX]
Web_Doc = \sum_i \langle Prose_i, Code_i \rangle
Tangle(Web_Doc) \to Compiler_Stream
Weave(Web_Doc) \to Reader_Stream

TENSION:
Modern software engineering abandoned Knuth’s monolithic WEB tools in favor of modular files and version control, finding that giant literary web files make collaborative multi-developer pull requests nearly impossible.

MISSING:
A mechanism to guarantee that the explanatory prose in WEAVE remains truthful when the underlying code in TANGLE is edited under production crisis.

BOUNDARY:
Literate programming works magnificently for foundational algorithms (TeX, METAFONT) authored by an individual master; it struggles in rapidly changing enterprise codebases.

CITATION TRAIL:
Dijkstra, Edsger W. (1968), "Go To Statement Considered Harmful"; Landin, P. J. (1966), "The Next 700 Programming Languages".

TEST:
Take a 500-line complex Python script. Compare debugging speed and defect detection when engineers review standard commented code versus when they review a Knuthian literate notebook.

PLATFORM:
[[game-03-program]]

LINKS:
[[game-03-program]]
[[game-04-plan]]
[[game-10-edit]]

BIBTEX:
@article{knuth1984literate,
  author    = {Donald E. Knuth},
  title     = {Literate Programming},
  journal   = {The Computer Journal},
  volume    = {27},
  number    = {2},
  pages     = {97--111},
  year      = {1984}
}
```
