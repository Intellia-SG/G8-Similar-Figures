# SimilarQuest — Module PRD
**Grade 8 · Similar Figures**
*(Produced from `Intellia_Module_Blueprint_PRD.md` — {{GRADE}} = Grade 8, {{TOPIC}} = Similar Figures, {{SPECIAL_INSTRUCTIONS}} = none supplied, defaults assumed throughout)*

---

## 1. Overview

SimilarQuest teaches what it means for two figures to have the *same shape at a different size*, and how to use that to find unknown lengths, areas, and volumes. Students learn to match corresponding parts and write a similarity statement, find a scale factor (and say whether it is an enlargement or a reduction), find missing lengths with multiplicative reasoning, decide whether two polygons are similar by checking **both** angles and sides, use the triangle similarity tests, find similar triangles hidden inside a figure, apply the squared and cubed scale factors to areas and volumes, and work with scale drawings, maps, and models. It is framed as a school scale-model exhibition: a club builds miniature versions of familiar landmarks, and every model must be exactly the same shape as the real thing.

## 2. Background

This is the fourth Grade 8 (Secondary 2) module, following **QuadQuest** (Quadrilaterals), **ReasonQuest** (Geometric Reasoning), and **CongruenceQuest** (Congruence). It reuses `G2-Money-Money-main`'s five-phase architecture per platform convention.

**Relationship to existing modules:**
- **CongruenceQuest** (Grade 8): the direct companion. Congruent figures are the special case of similar figures with scale factor 1. The two modules share the same reasoning engine, the same vertex-correspondence conventions, and a deliberate **contrast**: for triangles, three equal angles do *not* prove congruence but *do* prove similarity (two pairs are enough). CongruenceQuest's PRD left similarity out on purpose, and this module is that companion.
- **ReasonQuest** (Grade 8): supplies the angle facts (corresponding, alternate, and vertically opposite angles) used to find equal angles in hidden similar triangles. It is best played first.
- **QuadQuest** (Grade 8): rectangles, squares, and rhombuses are used as counterexamples ("equal angles are not enough; proportional sides are not enough"). Neither module requires the other.
- **RatioCraft** (Grade 6) and the Grade 5 ratio modules: ratios and proportions are a soft prerequisite. SimilarQuest uses them and does not re-teach them.
- **EquationQuest** (Grade 7): a few items need a simple equation to solve a proportion; no equation-solving is re-taught.

## 3. Standards Alignment

**Source and honest positioning:** the Singapore sources I found place congruent and similar figures in **Secondary 2**: similar figures with corresponding angles equal and corresponding sides proportional, properties of similar triangles and polygons, and enlargement and reduction. Map scales (distance and area) also appear in Secondary 2 under Ratio and Proportion. One Secondary 2 unit outline lists "area and volume of similar figures" in Secondary 2, and a Singapore-curriculum summary states that the ratio of areas is the square of the scale factor and the ratio of volumes is the cube. **The sources do not fully agree on pathway:** another outline for the G2 course places scale drawings in Secondary 3/4 and "ratio of areas and volumes" later still, while the G3/Express outlines place them in Secondary 2. So this module is **at grade level for Grade 8 on the Express/G3 pathway**, and some parts (World 7's volume content, enlargement and scale drawings) may sit later on other pathways. This is raised as an open question in §15.1 rather than treated as a scope-jump flag.

**Boundary on proof writing (carried over from ReasonQuest and CongruenceQuest):** reasoning is always **guided**. Students choose tests, order steps, complete missing facts and reasons, and spot flaws. They are not asked to compose a proof from a blank page.

**In-scope skills:**
- Explaining similar figures: same shape, corresponding angles equal, corresponding sides in the same ratio; congruent figures as the case where the scale factor is 1.
- Identifying corresponding vertices, sides, and angles, and writing a similarity statement with the vertices in matching order.
- Finding the **scale factor** from corresponding sides, stating its direction (from which figure to which), and saying whether it is an enlargement or a reduction.
- Finding unknown lengths using the scale factor, including with simple algebraic expressions.
- Deciding whether two **polygons** are similar by checking both angles and sides, and giving a counterexample when they are not.
- Using the triangle similarity tests: two equal angle pairs (AA, also written AAA), three proportional sides (SSS ratio), and two proportional sides with the included angle equal (SAS ratio); giving a verdict of **similar**, **not similar**, or **cannot tell**.
- Finding similar triangles hidden in a figure (a line parallel to one side of a triangle, nested triangles, and crossing lines between parallel lines), and separating overlapping triangles.
- Using the ratios of **perimeters** (k), **areas** (k²), and **volumes** (k³).
- Scale drawings, maps (distance and area), and models.

**Adjacent skills treated as bridge only, not tested:**
- **Enlargement on a coordinate grid** (centre of enlargement, coordinates) — a transformation topic.
- **Trigonometry** (which grows out of similar right-angled triangles) and **Pythagoras' theorem** — separate Secondary 2 topics. No question requires a square root.
- **Mensuration formulas** for cones, spheres, and similar solids — volume comparisons use cuboids and given volumes only.
- **Free-form proof writing and constructions** — out of scope.

**Domain conventions to encode as house style:**
- **The direction of the scale factor is always stated.** "The scale factor from A to B" means (length in B) ÷ (matching length in A). A value above 1 is an enlargement, below 1 a reduction, and exactly 1 means the figures are congruent. A scale factor without a direction is never presented as a final answer.
- **Multiplicative, not additive, reasoning.** Unknown lengths are found by multiplying by the scale factor, never by adding the difference between two matching sides.
- **Both conditions for polygons.** Equal angles alone, or proportional sides alone, is not enough for polygons (a rectangle and a square; a square and a non-square rhombus). For triangles the three tests are sufficient on their own.
- **Compare corresponding sides only,** and always the *whole* side of one triangle with the whole matching side of the other (in a nested figure, AD matches AB, not DB).
- **Squares and cubes for area and volume;** perimeters and lengths scale by k itself.
- **Name the test.** A similarity step always states which test was used, in brackets, for example "(AA)".
- **A diagram is a sketch, not evidence** unless it says otherwise; many figures are labelled "not drawn to scale."
- Notation: `∼` for similar (confirmed in §15.3), `=` for equal lengths or angles, and map scales written as `1 : n`.

## 4. Learning Objectives

By the end of this module, a student should be able to:
1. Explain what makes two figures similar and how congruent figures are a special case.
2. Identify corresponding parts and write a similarity statement with the vertices in matching order.
3. Find a scale factor with its direction, and say whether it is an enlargement or a reduction.
4. Use a scale factor to find unknown lengths, including with simple algebraic expressions.
5. Decide whether two polygons are similar by checking both angles and sides, and give a counterexample when they are not.
6. Choose and apply a triangle similarity test (AA, SSS ratio, SAS ratio), with a verdict of similar, not similar, or cannot tell.
7. Find similar triangles hidden in a figure and use them to find lengths.
8. Use k, k², and k³ for lengths and perimeters, areas, and volumes, and apply scale factors to scale drawings, maps, and models.

Ordering runs foundational → applied (similar figures → corresponding parts → scale factor → unknown lengths → polygons need both conditions → triangle tests → hidden triangles → area and volume → maps and models), and drives the world sequence in §9.

## 5. Inherited Standards *(Section A of the platform blueprint — copied verbatim, unchanged)*

- **Five-phase architecture:** Wonder → Story → Simulate → Play ("Practice" in-UI) → Reflect.
- **Gamification:** XP per question, 0–3 stars per world, streak tracking, 8 fixed badge triggers (relabelled §10), 10 Boss Battles (5Q/3 lives).
- **Practice modes:** Guided (5Q, hints, untimed), Independent (10Q, no hints), Timed Challenge (8Q, 60s), Boss Battle (5Q, 3 lives).
- **Audio pipeline:** ElevenLabs Alice voice only, 6 emotional presets, pre-generated + dynamic narration, no browser TTS fallback, strict 1:1 narration/on-screen-text parity.
- **Question bank shape:** 10 worlds × 10 questions = 100, procedurally generated, ≥300-run stress test, fixed schema, World 9 (last, 0-indexed) is the mixed-review grand finale.
- **Product standards:** React/Vite/Tailwind/Framer Motion, pixel-faithful `design-tokens.css` reuse, enlarged Simulate/Practice fonts and touch targets, zip delivery with placeholder story art + art-brief README.
- **Simulate phase:** the standard 4 required, archetype-mapped stations.

## 6. Enhancement Requests / Special Instructions

None supplied. Defaults applied: 4-panel Story (justified §8.2), Singaporean-multicultural naming (§7), theme-specific mascot override with rationale (§7), and the standard 4-station Simulate design (§8.3). The Concept Discovery Lab confirmation-question tension is not re-resolved here (§15.5).

## 7. Module Identity

- **Module name:** **SimilarQuest**
- **Story theme:** a school scale-model exhibition. A club builds miniature versions of familiar local landmarks and structures for an exhibition, and every model must be the same shape as the real thing at a different size. The throughline is "same shape doesn't mean same size, and double the length does not mean double the paint." The theme fits the topic closely: a model is a similar figure, the scale is the scale factor, paint and wrapping paper are areas, filling a model with sand is a volume, and a map is a scale drawing. Landmark details in the questions are invented and kept generic.
- **Named characters** (Singaporean-multicultural convention, first names only, distinct from earlier modules):
  - **Dania** — assumes "twice as long" means "twice as much of everything," including area.
  - **Kabir** — checks every pair of corresponding sides and says which figure he is scaling *from*.
- **Mascot: Otto the Otter 🦦** *(override, with rationale)* — smooth-coated otters are a well-loved local animal, and an otter family of different sizes with the same shape is a friendly picture of "similar." It is distinct from every mascot used in earlier modules.

## 8. Five-Phase Journey Detail

### 8.1 Wonder
Single hook screen: *"A statue needs 40 litres of paint. The club builds a model where every length is one-twentieth of the real statue. How much paint does the model need — about 2 litres, a tiny fraction of a litre, or something else?"* (Answer to be discovered: paint covers area, and area scales by the square of the scale factor, so the model needs 0.1 litres.)

### 8.2 Story — 4 panels (default, not exceeded)

| # | Title | Concept delivered | Narrative beat |
|---|---|---|---|
| 1 | The Exhibition | Hook: building scale models of landmarks | Dania and Kabir are asked to build a model at one-twentieth scale; Dania wants to "just halve everything" twice. |
| 2 | Same Shape, Different Size | Similar figures, corresponding parts, scale factor and its direction | Otto the Otter shows an otter family: same shape, different sizes, every part in the same ratio. |
| 3 | Two Checks, Not One | Both angles and sides for polygons; the triangle tests; hidden triangles | Kabir shows that a rectangle and a square have equal angles but are not similar, and that two angle pairs are enough for triangles. |
| 4 | Twice as Long, Four Times the Paint | Area (k²), volume (k³), maps and models; worked application | The pair works out the paint for the model, the sand for its base, and the map distance to the exhibition. |

### 8.3 Simulate — 4 stations (archetype-mapped)
Summary (full technical spec in the companion TRD):

| Station | Archetype | Premise |
|---|---|---|
| The Scale Lab | Concept Discovery Lab | Student drags a scale-factor slider on a figure and watches lengths and perimeter scale by k, area by k² (with unit squares drawn), while angles do not change. A "break it" switch stretches the figure in only one direction: the angles change, the sides are no longer in one ratio, and the readout says "not similar." |
| Scale to Fit | Build-to-Target Challenge | A model must fit a stated constraint (a shelf height, a base area, or a paint budget). The student sets the scale factor so the model meets it, with a live readout of the matching lengths, area, and volume, and a "next exhibit" loop. |
| The Full Exhibit | Multi-Step/Composite Construction | Given a figure with a line parallel to one side of a triangle, the student separates the two triangles, marks the equal angles with reasons, chooses the test, writes the similarity statement, finds the scale factor and an unknown length, and then the area ratio — combining LOs 5, 6, 7, and 8. |
| Spot the Bad Scale | Error-Detective | A fellow club member's working contains one seeded flaw (area scaled by k, a reversed scale factor, sides added instead of multiplied, non-corresponding sides compared, "similar" claimed for a rectangle and a square from equal angles, or a map unit slip); the student finds and fixes it. |

### 8.4 Play / Practice
Standard, unchanged mechanics (10 worlds × 10 questions, 4 modes). See world table in §9.

### 8.5 Reflect
3 new recap questions targeting the module's headline misconceptions: **scaling area or volume by k instead of k² or k³**, **adding the difference instead of multiplying by the scale factor (and reversing the scale factor)**, and **treating equal angles alone, or proportional sides alone, as enough for polygons**. Followed by the standard scorecard and a reflection prompt ("Which model needed more paint than you first expected, and why?").

## 9. World & Question Bank Table

*Shape: `{ id, name, emoji, accent, description, conceptFocus, boss: { name, emoji, reward } }`. World 9 (last) is the mixed-review grand finale per platform standard.*

| id | World | conceptFocus | Description | Boss | Reward |
|---|---|---|---|---|---|
| 0 | Same Shape, Different Size | `similar-vs-congruent-figures` | What similar means; congruent as the k = 1 case | The Stretchy Mirror 🪞 | Shape Badge |
| 1 | Matching Sides and Angles | `corresponding-parts-and-similarity-statements` | Corresponding parts and similarity statements | The Mislabelled Model Kit 📦 | Kit Badge |
| 2 | Find the Scale Factor | `find-scale-factor` | Scale factor with direction; enlargement or reduction | The Backwards Ratio 🔁 | Factor Badge |
| 3 | Missing Lengths | `find-unknown-lengths-similar` | Unknown lengths by multiplying by the scale factor | The Missing Piece 🧩 | Length Badge |
| 4 | Both Conditions | `are-polygons-similar` | Polygons need equal angles and proportional sides | The Half-Right Replica 🪆 | Both-Checks Badge |
| 5 | Triangle Tests | `similar-triangle-tests` | AA, SSS ratio, SAS ratio, and the three verdicts | The Test Gatekeeper 🚧 | Test Badge |
| 6 | Hidden Similar Triangles | `embedded-similar-triangles` | Similar triangles hidden in a figure | The Hidden Mini 🔍 | Hidden Badge |
| 7 | Area and Volume Scale | `area-and-volume-ratios` | Perimeter k, area k², volume k³ | The Size Squasher 🧊 | Scale Power Badge |
| 8 | Maps and Models | `scale-drawings-maps-models` | Scale drawings, maps, and models, including area | The Map Mix-Up 🗺️ | Mapmaker Badge |
| 9 | The Grand Exhibition | `mixed-review` | Mixed review of every concept above; hardest boss | The Exhibition Curator 🏛️ | Grand Exhibition Trophy |

**Sample questions (illustrative, not the full 100):**

- **World 0:** *"Which pair of rectangles is similar?"* → the 2 cm × 3 cm and 4 cm × 6 cm rectangles ✓ (distractor: 2 × 3 and 4 × 5, whose sides are not in one ratio)
- **World 1:** *"△ABC ∼ △PQR, with A matching Q, B matching R, and C matching P. Which statement is correct?"* → `△ABC ∼ △QRP` ✓ (distractor `△ABC ∼ △PQR`, which matches by position)
- **World 2:** *"AB = 6 cm in triangle ABC and the matching side PQ = 15 cm in triangle PQR. What is the scale factor from ABC to PQR?"* → `5/2`, an enlargement ✓ (headline distractor `2/5`, the reversed direction)
- **World 3:** *"△ABC ∼ △PQR with AB = 6, PQ = 9, and BC = 10. Find QR."* → `15` ✓ (headline distractor `13`, adding the difference of 3 instead of multiplying)
- **World 4:** *"Two rhombuses have sides 5 cm and 10 cm but different angles. Are they similar?"* → "No — the sides are proportional but the angles differ" ✓ (distractor: "Yes, the sides are in the ratio 1 : 2")
- **World 5:** *"∠A = ∠D = 50° and ∠B = ∠E = 60°. Are △ABC and △DEF similar? Name the test."* → "Similar (AA)" ✓ (distractor: "cannot tell, because the third angle is not given")
- **World 6:** *"In △ABC, DE ∥ BC with D on AB and E on AC. AD = 4, AB = 10, and DE = 6. Find BC."* → `15` ✓ (△ADE ∼ △ABC; headline distractor `12`, adding 6 to DE)
- **World 7:** *"Two similar vases are 10 cm and 30 cm tall. The small one holds 200 mL. How much does the large one hold?"* → `5400 mL` ✓ (distractors `600 mL`, scaling by k, and `1800 mL`, scaling by k²)
- **World 8:** *"A map has scale 1 : 50 000. Two towns are 4 cm apart on the map. How far apart are they in real life?"* → `2 km` ✓
- **World 9:** mixed-type item combining a hidden similar-triangle length (World 6) with an area ratio (World 7).

## 10. Gamification — Badge Renames

| Fixed trigger | Badge name |
|---|---|
| First correct answer | First Model Built 🧱 |
| 5-answer streak | Steady Scaling 📏 |
| 10-answer streak | Perfect Proportion Streak 🔥 |
| All 4 Simulate stations complete | Full Model Kit 🧰 |
| Any world scores 3 stars | Exhibit Ready ⭐⭐⭐ |
| Any Boss Battle won | Replica Approved 🏅 |
| 20+ questions answered in Practice | Seasoned Model Maker 🛠️ |
| Full 5-phase journey complete | Master Model Maker Badge 🏆 |

## 11. Audio & Narration Content Rules

- Vertex labels are spoken letter by letter. `△ABC ∼ △PQR` is "triangle A, B, C is similar to triangle P, Q, R," and `∼` is always "is similar to," never "is congruent to" or "equals."
- Every similarity statement is narrated with its correspondence made audible ("A matches P, B matches Q, C matches R").
- A scale factor is **always** spoken with its direction ("the scale factor from triangle A, B, C to triangle P, Q, R is five over two, an enlargement").
- Ratios are spoken as "*a* to *b*" and a map scale `1 : 50 000` as "one to fifty thousand"; fractions are spoken as "five over two" or "five halves," used consistently.
- Squares and cubes are narrated in words ("the area scales by the scale factor squared; the volume by the scale factor cubed").
- The tests are spoken in words: "angle, angle," "side, side, side — all in the same ratio," "side, angle, side — two sides in the same ratio with the angle between them equal."
- The three verdicts are always "similar," "not similar," and "cannot tell," and "cannot tell" is never shortened to "not similar."
- "Corresponding," "enlargement," and "reduction" are explained in plain language on first use per world.
- Units are always spoken ("centimetres," "square centimetres," "cubic centimetres," "kilometres").

## 12. Accessibility

Standard enlarged fonts/touch targets in Simulate and Practice, calibrated toward the platform's Secondary sizing precedent. Every figure carries a text description of its marks and correspondence ("D E is parallel to B C; A D is 4 centimetres; not drawn to scale"). The Scale Lab and Scale to Fit pair their visual scaling with a text readout of every length, area, and volume; the "break it" stretch announces "angles changed — not similar" in text. Marks are never colour-only, the overlap-separation step offers a "show separately" button as well as dragging, and sliders have keyboard +/− equivalents.

## 13. Assets Required

4 story images at the reference's standard placeholder dimensions, delivered as blank CSS-framed placeholders, with an art-brief README describing each panel (a school exhibition hall with generic miniature landmarks):
1. A school hall set up for a model exhibition, Dania and Kabir at a table with a half-built model.
2. Otto the Otter standing with an otter family of different sizes, the same shape.
3. Kabir at a whiteboard comparing a rectangle and a square, Dania's hand on a ruler.
4. The finished model beside its paint tin, a sand tray, and a map pinned to the wall.

## 14. Success Metrics / Acceptance Criteria

Standard fixed criteria (question-bank stress test, audio parity, clean build, full-journey walkthrough) plus module-specific:
- Every similarity-test claim is backed by computation: sampled constructions that satisfy the marks of a valid test are all similar, and every "not enough" case (for example angle-only for polygons, sides-only for polygons, one angle pair, or two ratios with a non-included angle) comes with a computed pair of non-similar figures satisfying the same marks.
- Every verdict is provable: "similar" items satisfy a test, "not similar" items show a violated condition in the marks, and "cannot tell" items have a computed counterexample.
- Every scale factor is computed as an exact fraction, with the direction stated, and every length, area, and volume answer agrees with the same quantity measured on the constructed figures.
- Every area and volume ratio agrees between the formula (k², k³) and the area or volume computed directly from the constructed figures.
- Every hidden-triangle figure's equal angles are derivable by a stated reason, and removing any one makes the test no longer apply.
- Every unit conversion in a map or model question is exact, with no rounding.
- No question can be answered by measuring the drawing.
- Reasons and test keys use the same wording as ReasonQuest and CongruenceQuest.
- All 4 Simulate stations are genuinely interactive, not static reveal-and-answer screens.

## 15. Assumptions & Open Questions

1. **Pathway and scope (the main open question):** the sources agree that similar figures belong in Secondary 2 but differ on where area and volume ratios, enlargement, and scale drawings sit for different pathways (G3/Express in Secondary 2, G2 later). Confirm your target pathway. If needed, World 7's volume content can be flagged as an extension without changing the rest of the module.
2. **Triangle tests named:** this PRD teaches three tests (AA, also written AAA; SSS ratio; SAS ratio). Some curricula also list RHS-ratio as a fourth; it is treated here as a special case of SAS ratio. Confirm the names and the number of tests your target textbook uses.
3. **Notation:** the similarity symbol and the "(AA)" bracket style follow the sources I found, but schools vary; confirm the symbol and wording, and keep it identical across the geometry modules.
4. **Landmark content:** the story uses generic, invented landmark details so that no real dimensions are implied. If you want real local landmarks, their dimensions would need checking.
5. **Concept Discovery Lab tension — not re-resolved here.** The Scale Lab is naturally free-play, but with no special instruction it keeps the blueprint's standard archetype (free exploration plus one light confirmation question), consistent with most earlier modules.
6. **Guided proofs only,** as in the earlier Grade 8 modules. Free-form proof writing would need a separate design.
7. **Character names and mascot** (Dania, Kabir, Otto the Otter) are proposed defaults, not yet stakeholder-approved.
