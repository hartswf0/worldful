```text
ZETTEL

ID: 20260907-SALTON-1975-VECTOR-SPACE-MODEL

TITLE:
Information retrieval spatializes textual semantics into orthogonal geometric dimensions of term frequency.

SOURCE:
Salton, Gerard; Wong, A.; Yang, C. S. — "A Vector Space Model for Automatic Indexing" — Communications of the ACM — 1975 — Vol. 18, No. 11, pp. 613–615.

PASSAGE:
[QUOTE]
"In a vector space model, both stored documents and user queries are represented by t-dimensional vectors of the form D = (d_1, d_2, ..., d_t), where each dimension corresponds to a distinct indexing term... The similarity between a document and a query is then computed as the cosine of the angle between their respective vectors in this multi-dimensional space. By assigning appropriate weights based on term frequency and inverse document frequency, the system ranks documents according to geometric proximity."

RESEARCH OBJECT:
The mathematical reduction of prose documents and queries into vectors in a high-dimensional Euclidean space arbitrated by cosine distance.

LOCAL MOVE:
Salton bypasses the messy philosophical problem of semantic meaning and syntax by treating texts as bags of weighted words whose relevance is calculated strictly as geometric alignment.

SOURCE TERMS:
vector space model; indexing term; term frequency; inverse document frequency; cosine similarity; term weight; retrieval ranking.

WHAT BECAME STRANGE:
Two documents that express opposite political claims ("The policy was a triumph" vs "The policy was a catastrophe") reside almost identically in vector space because they share 90% of their vocabulary, confusing topical co-occurrence with semantic agreement.

QUESTION:
When modern dense embeddings replace sparse TF-IDF vectors, does the cosine angle measure semantic truth or statistical style?

DEEPER QUESTION:
Why do we assume that human knowledge can be mapped onto a linear vector space where semantic relationships obey vector addition ($king - man + woman = queen$)?

MECHANISM:
1. Extract vocabulary of unique terms T = {t_1, ..., t_n}.
2. Calculate weight $w_{i,j} = \text{TF}_{i,j} \times \log(N / \text{DF}_i)$.
3. Represent Document $D_j$ and Query $Q$ as vectors $\vec{D_j}, \vec{Q}$.
4. Compute $\text{Sim}(Q, D_j) = \frac{\vec{Q} \cdot \vec{D_j}}{\|\vec{Q}\| \|\vec{D_j}\|}$.
5. Sort documents descending by similarity score.

FORMAL SHIFT:
<NATURAL PROSE TEXTS>
→ <BAG OF WORDS FREQUENCY DISTRIBUTIONS>
→ [HIGH-DIMENSIONAL VECTOR PROJECTION]
→ <COSINE DISTANCE RANKING>

SOURCE FORMALISM:
$w_{ik} = \frac{tf_{ik} \cdot \log(N/n_k)}{\sqrt{\sum_{j=1}^t (tf_{ij} \cdot \log(N/n_j))^2}}$

OUR FORMALIZATION:
[OUR FORMALIZATION — NOT SOURCE SYNTAX]
Relevance(Q, D) = \cos(\theta) = \frac{\langle \phi(Q), \phi(D) \rangle}{\|\phi(Q)\| \|\phi(D)\|}

TENSION:
Belkin’s ASK hypothesis demonstrates that queries represent a cognitive absence, making them epistemically non-dual to the documents that contain the presence of the knowledge.

MISSING:
Syntactic structure, negation, and temporal ordering: "dog bites man" and "man bites dog" have a cosine similarity of 1.0 in Salton's original model.

BOUNDARY:
The model assumes independence of indexing terms (orthogonal axes), an assumption that is mathematically false for natural human languages where synonyms are deeply correlated.

CITATION TRAIL:
Shannon, C. E. (1948), "A Mathematical Theory of Communication"; Robertson, S. E. and Spärck Jones, K. (1976), "Relevance Weighting of Search Terms".

TEST:
Construct pairs of sentences with identical vocabularies but inverted truth values ("Drug X cures disease Y" vs "Drug X causes disease Y"). Test retrieval precision across sparse BM25 vs dense modern embeddings.

PLATFORM:
[[game-05-query]]

LINKS:
[[game-03-program]]
[[game-05-query]]
[[game-10-edit]]

BIBTEX:
@article{salton1975vector,
  author    = {Gerard Salton and A. Wong and C. S. Yang},
  title     = {A Vector Space Model for Automatic Indexing},
  journal   = {Communications of the ACM},
  volume    = {18},
  number    = {11},
  pages     = {613--620},
  year      = {1975}
}
```
