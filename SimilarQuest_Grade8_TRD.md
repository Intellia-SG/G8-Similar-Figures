# SimilarQuest — Module TRD
**Grade 8 · Similar Figures**
*(Technical companion to `SimilarQuest_Grade8_PRD.md`, produced from `Intellia_Module_Blueprint_TRD.md`. Repo: `similar-quest-main`. Recommended clone source: `congruence-quest-main`, because it already contains the triangle/geometry engine, chain checker, and answer types this module extends. If cloned from there, follow §1.5 to strip theatre branding. The fallback clone source is `G2-Money-Money-main`, in which case the engine in §4.4 must be written from scratch.)*

---

## 1. Reference Analysis Notes — Gotcha Check

Check each fresh against whichever repo is actually cloned from, per platform blueprint §1:

1. **Dead/duplicate `src/features/*` folder.** Confirm `App.jsx`'s actual imports before copying anything.
2. **Hardcoded story-panel count.** This module uses the default **4 panels** — likely a no-op, but confirm against the actual clone source.
3. **Static vs. procedural question bank.** Build `data/questionBank.js` procedurally across the 10 concept generators in §4.1. Almost every question carries a figure, and several answer types go beyond 4-option MCQ (scale-factor fractions, three-way verdicts, step ordering, statement building).
4. **Viewport-clipping bug.** Proactively apply the `100dvh` + `ResizeObserver` header-height fix.
5. **Leftover branding strings.** If cloned from `congruence-quest-main`: remove the backstage-theatre copy, Li Ting and Haikal, Echo the Mynah, and any congruence-only code this module does not use (`findCounterexample` for congruence tests, `RHS`/`SSS`/`SAS`/`ASA`/`AAS` congruence rules, pin-board for congruence trios). If cloned from `reason-quest-main`, `quad-quest-main`, or `progression-quest-main`, strip their mascots and (for `progression-quest-main`) the 5th Simulate tab and multi-round station state back to the standard 4-tab single-pass architecture. Check `index.html`'s `<title>` and `README.md`.
6. **Engine duplication across repos.** The reasoning engine is copied from `congruence-quest-main` (itself copied from `reason-quest-main`) and extended. Each module ships as an independent repo, so a fix in one will not reach the others automatically; see §11.

**Module-specific risks to add:**
- **Exact arithmetic or nothing.** Scale factors, ratios, areas, and unit conversions must be exact. Floating-point ratios will eventually make two "equal" ratios compare unequal, so all ratio work goes through a rational-number helper (§4.4), never raw floats.
- **Direction is part of the answer.** A scale factor of 2/5 and 5/2 are both "correct" for some direction; every item must state its direction, and the generator must make it checkable.
- **The similarity/congruence contrast must stay visible.** AA proves similarity but not congruence; a content or code edit that quietly shares one "triangle test" function between the two modules would erase the contrast this module is built on.

## 2. Tech Stack

Unchanged from platform blueprint §2.1 — reuse verbatim. `vite.config.js`, `tailwind.config.js`, `postcss.config.js`, `vercel.json` — reuse as-is. No geometry or logic library is added; the engine in §4.4 is small, pure, and local, and uses a small in-repo rational-number helper rather than a dependency.

## 3. Folder Structure

```
similar-quest-main/
├── public/assets/{audio/, story/}
├── scripts/
│   ├── generate_audio.js         # MODIFY: new `phrases` array (§8)
│   └── clean_audio.js            # reuse as-is
├── src/
│   ├── assets/story/             # story_1.png ... story_4.png
│   ├── components/
│   │   ├── IntroScreen.jsx/.css  # MODIFY: title/copy only
│   │   ├── ProgressMap.jsx/.css  # reuse as-is
│   │   ├── shared/
│   │   │   ├── Mascot.jsx/.css              # reuse as-is (props swap to Otto the Otter)
│   │   │   ├── FeedbackOverlay.jsx/.css     # reuse as-is
│   │   │   ├── FloatingNumbers.jsx/.css     # reuse as-is
│   │   │   └── SimilarityVisual.jsx         # NEW — §5.1
│   │   ├── gamification/
│   │   │   ├── KingdomMap.jsx/.css  # reuse as-is
│   │   │   └── StarRating.jsx       # reuse as-is
│   │   ├── quiz/
│   │   │   ├── QuestionRenderer.jsx/.css  # MODIFY: import SimilarityVisual; add answer types (§5.2)
│   │   │   └── BossBattleModal.jsx/.css   # reuse as-is
│   │   ├── phases/
│   │   │   ├── WonderPhase.jsx/.css    # MODIFY: content only
│   │   │   ├── StoryPhase.jsx/.css     # MODIFY: content only
│   │   │   ├── SimulatePhase.jsx/.css  # MODIFY: 4 new station imports/labels (standard 4-tab architecture)
│   │   │   ├── PlayPhase.jsx/.css      # reuse as-is
│   │   │   └── ReflectPhase.jsx/.css   # MODIFY: 3 new recap questions (§6.3)
│   │   └── simulations/
│   │       ├── TheScaleLab.jsx          # NEW — Concept Discovery Lab — §6
│   │       ├── ScaleToFit.jsx           # NEW — Build-to-Target Challenge — §6
│   │       ├── TheFullExhibit.jsx       # NEW — Multi-Step/Composite Construction — §6
│   │       ├── SpotTheBadScale.jsx      # NEW — Error-Detective — §6
│   │       └── Stations.css             # MODIFY: extend with scale-slider, unit-square, overlap, and ordering-list classes
│   ├── config/
│   │   ├── worlds.config.js       # MODIFY: 10 topic-themed worlds — §4.1
│   │   ├── characters.config.js   # MODIFY: Dania / Kabir / Otto — §4.2
│   │   └── audio.config.js        # reuse as-is
│   ├── core/hooks/useViewport.js  # reuse as-is
│   ├── hooks/useAudio.js          # reuse as-is
│   ├── data/
│   │   ├── storyContent.js        # MODIFY: 4 story panels — §4.3
│   │   └── questionBank.js        # MODIFY: procedurally generated 100 Qs — §4.4
│   ├── utils/
│   │   ├── audio.js               # reuse as-is
│   │   ├── audioMap.js            # auto-generated — do not hand-edit
│   │   ├── narration.js           # MODIFY: topic-specific phase scripts — §8
│   │   ├── badgeEngine.js         # MODIFY: relabelled BADGES array only — §7
│   │   ├── scoring.js             # reuse as-is
│   │   ├── shuffle.js             # reuse as-is
│   │   ├── ratio.js               # NEW — exact rational numbers — §4.4
│   │   ├── geoReasons.js          # COPY from congruence-quest-main, extended — §4.4
│   │   ├── geoFacts.js            # COPY from congruence-quest-main, extended — §4.4
│   │   ├── similarityMath.js      # NEW — similarity, scale, area/volume, maps — §4.4
│   │   ├── similarityDiagram.js   # NEW — constructions, enlargement, embedded figures — §4.4
│   │   └── similarityProblems.js  # NEW — generators and misconception functions — §4.4
│   ├── styles/
│   │   ├── design-tokens.css      # MODIFY: 10 new --world-N accent colors — §9
│   │   └── globals.css            # reuse as-is (apply viewport fix from §1.4 proactively)
│   ├── App.jsx                    # MODIFY only if the clone source's panel-count logic differs from 4 (§1.2)
│   ├── App.css / main.jsx / index.css   # reuse as-is
├── index.html / package.json / vite.config.js / tailwind.config.js / postcss.config.js / vercel.json / .oxlintrc.json / .gitignore
└── README.md                      # MODIFY: module-specific + art-brief (PRD §13)
```

## 4. Data Layer

### 4.1 `config/worlds.config.js`
Ten entries in the fixed shape, populated from PRD §9:

```js
export const WORLDS = [
  { id: 0, name: "Same Shape, Different Size", emoji: "🪞", accent: "var(--world-0)",
    description: "What similar means; congruent as the k = 1 case",
    conceptFocus: "similar-vs-congruent-figures",
    boss: { name: "The Stretchy Mirror", emoji: "🪞", reward: "Shape Badge" } },
  { id: 1, name: "Matching Sides and Angles", emoji: "📦", accent: "var(--world-1)",
    description: "Corresponding parts and similarity statements",
    conceptFocus: "corresponding-parts-and-similarity-statements",
    boss: { name: "The Mislabelled Model Kit", emoji: "📦", reward: "Kit Badge" } },
  { id: 2, name: "Find the Scale Factor", emoji: "🔁", accent: "var(--world-2)",
    description: "Scale factor with direction; enlargement or reduction",
    conceptFocus: "find-scale-factor",
    boss: { name: "The Backwards Ratio", emoji: "🔁", reward: "Factor Badge" } },
  { id: 3, name: "Missing Lengths", emoji: "🧩", accent: "var(--world-3)",
    description: "Unknown lengths by multiplying by the scale factor",
    conceptFocus: "find-unknown-lengths-similar",
    boss: { name: "The Missing Piece", emoji: "🧩", reward: "Length Badge" } },
  { id: 4, name: "Both Conditions", emoji: "🪆", accent: "var(--world-4)",
    description: "Polygons need equal angles and proportional sides",
    conceptFocus: "are-polygons-similar",
    boss: { name: "The Half-Right Replica", emoji: "🪆", reward: "Both-Checks Badge" } },
  { id: 5, name: "Triangle Tests", emoji: "🚧", accent: "var(--world-5)",
    description: "AA, SSS ratio, SAS ratio, and the three verdicts",
    conceptFocus: "similar-triangle-tests",
    boss: { name: "The Test Gatekeeper", emoji: "🚧", reward: "Test Badge" } },
  { id: 6, name: "Hidden Similar Triangles", emoji: "🔍", accent: "var(--world-6)",
    description: "Similar triangles hidden in a figure",
    conceptFocus: "embedded-similar-triangles",
    boss: { name: "The Hidden Mini", emoji: "🔍", reward: "Hidden Badge" } },
  { id: 7, name: "Area and Volume Scale", emoji: "🧊", accent: "var(--world-7)",
    description: "Perimeter k, area k², volume k³",
    conceptFocus: "area-and-volume-ratios",
    boss: { name: "The Size Squasher", emoji: "🧊", reward: "Scale Power Badge" } },
  { id: 8, name: "Maps and Models", emoji: "🗺️", accent: "var(--world-8)",
    description: "Scale drawings, maps, and models, including area",
    conceptFocus: "scale-drawings-maps-models",
    boss: { name: "The Map Mix-Up", emoji: "🗺️", reward: "Mapmaker Badge" } },
  { id: 9, name: "The Grand Exhibition", emoji: "🏛️", accent: "var(--world-9)",
    description: "Mixed review of every concept above",
    conceptFocus: "mixed-review",
    boss: { name: "The Exhibition Curator", emoji: "🏛️", reward: "Grand Exhibition Trophy" } },
];
```

### 4.2 `config/characters.config.js`
```js
export const CHARACTERS = {
  dania: { name: "Dania", role: "Doubles everything, including area", emoji: "👧🏽", colour: "var(--char-1)", mascotEmoji: "🦦" },
  kabir: { name: "Kabir", role: "Checks every pair, states the direction", emoji: "🧑🏽", colour: "var(--char-2)", mascotEmoji: "🦦" },
  otto:  { name: "Otto the Otter", role: "Mascot & mentor", emoji: "🦦", colour: "var(--mascot)", mascotEmoji: "🦦" },
};
export const MASCOT = { name: "Otto the Otter", emoji: "🦦" };
```

### 4.3 `data/storyContent.js`
`STORY_PANELS` array, length 4, per PRD §8.2, fixed shape `{ panel, title, text, highlight, character, characterEmoji, imageBg, imageEmoji }`. Titles: "The Exhibition," "Same Shape, Different Size," "Two Checks, Not One," "Twice as Long, Four Times the Paint."

### 4.4 Reasoning Engine and Question Bank

**`utils/ratio.js`** (new) — exact rationals.

| Function | Purpose |
|---|---|
| `frac(n, d)` | Builds a reduced fraction (sign normalised, denominator positive). |
| `mul`, `div`, `add`, `eq`, `cmp`, `pow(frac, k)` | Exact arithmetic. `eq` compares by cross-multiplication. **No floating-point ratio is ever stored or compared.** |
| `toDisplay(frac)` | Renders as an integer, a simple fraction, or a ratio `a : b`, and to the narration-ready spoken form per PRD §11. |

**`utils/geoReasons.js`** and **`utils/geoFacts.js`** (copied from `congruence-quest-main`, extended)

| Item | Purpose |
|---|---|
| `REASONS` | The closed list from the sibling repos for shared entries (parallel-line angle reasons, `vertically-opposite-angles`, `common-angle`, `given`). Extended here with: `similar-aa`, `similar-sss-ratio`, `similar-sas-ratio`, `corresponding-sides-proportional`, `corresponding-angles-equal-similar-triangles`. **Shared entries must keep identical keys and wording with `congruence-quest-main` and `reason-quest-main`** (§11). |
| `REASON_DISPLAY` | Full-words wording (for narration) and the textbook abbreviation shown on screen; the test appears in brackets at the end of the similarity step, for example "(AA)". |
| `RULES` | For each key, premises and conclusion as patterns over facts. `similar-aa` requires **two** matched angle pairs, each of which must itself be established earlier in the chain (given, or derived by a parallel-line, vertically-opposite, or common-angle reason). `similar-sas-ratio` requires two proportional side pairs in the **same** ratio and the matched angle *between* them. `similar-sss-ratio` requires all three side pairs in one ratio. `corresponding-sides-proportional` requires an earlier similarity fact for those two triangles, so using a ratio before similarity is shown is computable as a flaw. |
| `Fact` | Extended with `ratio` facts (side pair → exact fraction), `scaleFactor(from, to)` facts, and `similarity` statements with an explicit vertex correspondence. |
| `deriveClosure(givens)` / `checkChain(chain, givens)` / `validOrderings(chain)` | As in `congruence-quest-main`. `checkChain` returns `{ valid, failsAtStep, failureType }` with `failureType` including, for this module: `condition-not-met`, `test-positions-wrong`, `statement-order-mismatch`, `ratio-before-similarity`, `non-corresponding-sides-compared`, and `circular`. |

**`utils/similarityMath.js`** (new)

| Function | Purpose |
|---|---|
| `areSimilar(figA, figB)` | Exact check over all vertex rotations and reflections: corresponding angles equal and corresponding side ratios all equal (via `ratio.js`). The authority for every audit. Returns the scale factor and correspondence when similar. |
| `scaleFactor(figA, figB, correspondence)` | Returns the exact fraction **from A to B** with an explicit `direction` field and an `enlargement`/`reduction`/`congruent` label. |
| `classifyTriangleMarks(marks)` | Returns `similar-aa`, `similar-sss-ratio`, `similar-sas-ratio`, or `insufficient` from the matched angles and proportional sides and *where* each sits (included vs. non-included angle). |
| `findCounterexample(marks)` | For any marks that are not a test (one angle pair; two ratios with a non-included angle; angle-only or sides-only for polygons), constructs two **non-similar** figures satisfying the same marks. For valid tests, samples constructions and confirms every one is similar. |
| `verdict(marks, givenMeasures)` | Returns `similar` (a test applies), `not-similar` (a violated angle or ratio shown in `givenMeasures`), or `cannot-tell` (not a test **and** `findCounterexample` succeeds). A `cannot-tell` without a counterexample is rejected as a generator bug. |
| `lengthScale(k)`, `areaScale(k)`, `volumeScale(k)` | Return `k`, `k²`, and `k³` as exact fractions. |
| `polygonArea(coords)`, `cuboidVolume(l, w, h)` | Compute area (shoelace) and volume directly from constructed figures, used for the dual-check audit. |
| `mapConvert(value, scale, fromUnit, toUnit, dimension)` | Exact conversion for map and model scales `1 : n`, with `dimension` of 1 (length) or 2 (area). All unit factors are integers or exact fractions. |

**`utils/similarityDiagram.js`** (new)

| Function | Purpose |
|---|---|
| `buildConstruction(spec, freeParams)` | Coordinates for a figure specification: two similar polygons (rotated and reflected as needed), nested triangles, and cuboid pairs. |
| `applyEnlargement(figure, k)` | Scales a figure about a point by an exact `k` (used for constructing similar pairs and for the station sliders). |
| `nonUniformStretch(figure, kx, ky)` | Stretches in one direction only; the result must fail `areSimilar` when `kx ≠ ky` (used by The Scale Lab's "break it" switch and for counterexamples). |
| `embeddedFigure(kind)` | Builds hidden-triangle figures: `parallel-cut` (a line parallel to one side of a triangle), `nested-right-triangles`, and `crossing-between-parallels` (a "butterfly"). Returns the figure, its two triangles, and the reason chain that establishes the equal angles. |
| `separateOverlapping(construction)` | Returns the two triangles as two separate, consistently labelled figures (labels and orientation preserved). |
| `distortNotToScale(spec)` | Returns a different valid construction satisfying the same marks, so the drawing cannot be measured to get the answer. |
| `perturbationTest(spec, target)` | Builds several different constructions consistent with the marks and returns whether the target quantity (or the similarity itself) is the same in all of them. |

**`utils/similarityProblems.js`** (new)

| Function | Purpose |
|---|---|
| `generateSimilarOrNotItem()` | World 0: a pair built with `applyEnlargement` (similar) or `nonUniformStretch` (not similar); the answer comes from `areSimilar`. |
| `generateStatementItem()` | World 1: builds the correspondence first, then the statement and the corresponding-part question from it. |
| `generateScaleFactorItem()` | World 2: states the direction explicitly; the answer is the exact fraction from `scaleFactor`, with distractors including the reversed direction. |
| `generateUnknownLengthItem()` | World 3: unknown lengths via the exact scale factor; algebraic versions pick an integer `x` first and check every length is valid. |
| `generatePolygonSimilarityItem()` | World 4: rectangles, squares, rhombuses, and other polygon pairs where only one condition holds; the answer comes from `areSimilar`, and the counterexample from `findCounterexample`. |
| `generateTriangleTestItem()` | World 5: marks come from a constructed pair; the answer comes from `classifyTriangleMarks` and `verdict`. |
| `generateHiddenTriangleItem()` | World 6: uses `embeddedFigure`, and runs a **necessity check**: with any one equal-angle fact removed, `classifyTriangleMarks` must no longer return a test. |
| `generateAreaVolumeItem()` | World 7: ratios from `areaScale`/`volumeScale`, **dual-checked** against `polygonArea` and `cuboidVolume` on the constructed figures. |
| `generateMapModelItem()` | World 8: exact `mapConvert` for length and area, with unit slips as distractors. |
| `generateArgumentItem()` | Ordering and completion items for The Full Exhibit and the argument-style questions; validated by `checkChain` and graded with `validOrderings`. |
| `misconception.*` | Every distractor and every seeded flaw comes from here, never hand-authored: `areaScaledByK`, `volumeScaledByK`, `volumeScaledByKSquared`, `perimeterScaledByKSquared`, `additiveInsteadOfMultiplicative`, `reversedScaleFactor`, `nonCorrespondingSides`, `partVsWholeSide`, `anglesOnlyForPolygons`, `sidesOnlyForPolygons`, `needThreeAnglePairs`, `similarImpliesEqualSides`, `lookSameAsEvidence`, `vertexOrderMismatch`, `testNotNamed`, `cannotTellAsNotSimilar`, `mapUnitSlip`. |

**Clean-number and clean-geometry constraints (hard requirements, not inline magic numbers):**
- Scale factors are drawn from a curated set of simple exact fractions (for example 2, 3, 4, 1/2, 1/3, 3/2, 2/3, 5/2) so that every resulting length is a whole number or a one-decimal value, and every area and volume is a whole number.
- Side lengths are whole centimetres in a safe range and every figure satisfies the triangle inequality with no near-zero angle.
- Map scales are drawn from a curated set (for example `1 : 100`, `1 : 500`, `1 : 1 000`, `1 : 10 000`, `1 : 50 000`) and every conversion is exact.
- Algebraic items give integer `x` and every resulting length valid.
- A figure's marks must be sufficient for its question, except World 5's "cannot tell" items, where insufficiency is the point.

**`data/questionBank.js` generation:** one or more template functions per `conceptFocus` (10 slugs from §4.1), each producing the fixed output schema (unchanged): `{ id, districtId, category, visual, questionText, options, correctAnswer, explanation, hint1, hint2, visualData }`, with `visualData` carrying the figure specification, marks, correspondence, scale direction, and any chain. Also export `DISTRICTS` (derived from `WORLDS`) so `PlayPhase.jsx`'s existing import is unmodified.

## 5. Component Specs

### 5.1 `SimilarityVisual.jsx`
Replaces the reference's domain visual component. Takes `{ type, data, compact }`. Supported `type` values:
- `"figure-pair"` — two figures with matching marks and an optional correspondence overlay (colour **and** text labels).
- `"scale-overlay"` — a figure and its scaled copy with unit squares drawn, showing lengths scaling by k and area by k².
- `"nested-triangles"` — an embedded figure with a "show separately" toggle that animates to the two separated triangles.
- `"correspondence-table"` — a vertex and side correspondence table built from the statement.
- `"ratio-table"` — matching sides in two columns with the exact scale factor and its direction.
- `"solid-pair"` — two cuboids (or a model and a real object) with their volumes labelled.
- `"map-strip"` — a map segment with its scale bar and a real-distance label.
- `"argument-chain"` — a numbered argument with a reason line per step, including the test in brackets.

Every type carries a text description of its marks, correspondence, and values (PRD §12); none relies on colour alone. `compact` shrinks rendering for inline use in `QuestionRenderer.jsx`.

### 5.2 Additional answer types
`QuestionRenderer.jsx` needs four formats beyond 4-option MCQ, all still conforming to the fixed schema so `PlayPhase.jsx` scoring is unchanged:
1. **Scale factor with direction:** a fraction choice plus an enlargement/reduction choice.
2. **Statement building:** the student arranges vertex letters to write a similarity statement.
3. **Three-way verdict:** similar / not similar / cannot tell, with a short justification choice.
4. **Step ordering and reason/test selection:** shuffled steps with keyboard-operable "move up / move down" controls, graded with `validOrderings`, and a reason or test chosen from `REASONS` for each step.

## 6. Simulate Station Specs

All 4 follow the fixed per-station contract: `<StationComponent onComplete={fn} audioEnabled={bool} />`, self-contained internal state, live SVG visuals themed with `design-tokens.css` variables, a `station-success` panel with a "Complete Station ✓" CTA, and keyboard-operable +/− controls alongside any slider/drag interaction. Standard single-pass architecture.

| Component | Archetype | Student manipulates | Live feedback | Completion gate |
|---|---|---|---|---|
| `TheScaleLab.jsx` | Concept Discovery Lab | A scale-factor slider (exact curated values, keyboard +/−) and a "break it" switch | Lengths and perimeter scale by `k`, area by `k²` (unit squares drawn), and angles stay fixed, all from `similarityMath`; with "break it" on, `nonUniformStretch` makes angles change and the readout says "not similar" | Free exploration that includes at least one enlargement, one reduction, and one "break it" setting, **plus one confirmation question** ("what happened to the area when the lengths doubled?") per the platform's default archetype |
| `ScaleToFit.jsx` | Build-to-Target Challenge | The scale factor, aimed at a constraint (shelf height, base area, or paint budget) | A live readout shows matching lengths, area, and volume as exact values; "fits" or "does not fit" is text-labelled | The constraint met on at least two different exhibits; a "next exhibit" loop offers a fresh constraint |
| `TheFullExhibit.jsx` | Multi-Step/Composite Construction | On an embedded figure: separates the triangles (`separateOverlapping`), marks equal angles with reasons, chooses the test, writes the similarity statement, finds the scale factor and an unknown length, then the area ratio | `checkChain` runs after each action and reports the first failing step and its `failureType` in plain words | A fully valid argument and correct values — targets PRD LOs 5, 6, 7, and 8 |
| `SpotTheBadScale.jsx` | Error-Detective | Taps the flawed step of a club member's working, then supplies the correction | The tapped step highlights; flaws are generated from `misconception.*` and confirmed to fail `checkChain` (or the exact-arithmetic check) at exactly the seeded step | Correctly identifying the flawed step and supplying a valid fix |

Wire all 4 into `SimulatePhase.jsx`'s `STATIONS` array and station-index render switch; tab bar, footer navigation, progress dots, and `COMPLETE_SIM_STATION`/`ADVANCE_SIM_STATION` gating logic are reused verbatim from the reference.

### 6.3 `ReflectPhase.jsx` Recap Questions
Replace the 3 hard-coded recap questions with 3 targeting scaling area or volume by `k` (PRD §8.5), adding the difference instead of multiplying (and reversing the scale factor), and treating equal angles alone, or proportional sides alone, as enough for polygons — matching the Error-Detective station's focus.

## 7. Gamification

`utils/scoring.js` (`calcXP`, `calcStars`) — reuse formulas as-is. `utils/badgeEngine.js` — reuse `checkBadges(state)` trigger logic as-is; only the `BADGES` array's display strings change, per PRD §10's rename table (First Model Built, Steady Scaling, Perfect Proportion Streak, Full Model Kit, Exhibit Ready, Replica Approved, Seasoned Model Maker, Master Model Maker Badge).

## 8. Audio Pipeline

`config/audio.config.js`, `utils/audio.js`, `hooks/useAudio.js`, `utils/audioMap.js` — reuse mechanics as-is.

Rewrite `utils/narration.js` function *bodies* (signatures unchanged, same list as earlier modules' TRDs) and `scripts/generate_audio.js`'s `phrases` array using PRD §11's rules: vertex labels letter by letter; `∼` always "is similar to"; every statement narrated with its correspondence; every scale factor spoken with its direction and its enlargement/reduction label; ratios, fractions, and map scales spoken consistently; squares and cubes in words; tests spoken in words; the three verdicts spoken exactly and never shortened; units always spoken. Dynamic generation covers numbers, fractions, and vertex-label variations in procedurally generated questions. After content lock: `npm run generate-audio` then `npm run clean-audio`.

## 9. Design Tokens

`styles/design-tokens.css` — reuse core palette/type/radii/shadows/transitions as-is. Regenerate only the `--world-0` through `--world-9` accent block, using a model-exhibition palette distinct from the earlier modules' palettes:

| World | Accent (indicative) |
|---|---|
| 0 — Same Shape, Different Size | `#4D908E` (otter-pond teal) |
| 1 — Matching Sides and Angles | `#F9C74F` (kit-box yellow) |
| 2 — Find the Scale Factor | `#F8961E` (ruler orange) |
| 3 — Missing Lengths | `#90BE6D` (modelling-clay green) |
| 4 — Both Conditions | `#43AA8B` (paint-pot mint) |
| 5 — Triangle Tests | `#577590` (drafting steel) |
| 6 — Hidden Similar Triangles | `#9D4EDD` (magnifier violet) |
| 7 — Area and Volume Scale | `#F3722C` (paint-tin orange) |
| 8 — Maps and Models | `#277DA1` (map-sea blue) |
| 9 — The Grand Exhibition | `#14213D` (deep exhibition-hall navy — most dramatic, for the finale) |

## 10. Build, QA, and Delivery

1. **Question bank stress test** — ≥300 randomized generations (30,000 questions) across all 10 concept categories; assert no duplicate options, no malformed/`NaN`/`undefined` fields, no degenerate figure, every value within the clean ranges in §4.4, and **no floating-point ratio anywhere in the generated data**.
2. **Similarity-test validity audit (module-specific, highest stakes)** — for every valid test, sample many constructions satisfying the same marks and confirm every one passes `areSimilar`; for every "not enough" case used in the bank, confirm `findCounterexample` returns two genuinely non-similar figures satisfying the same marks.
3. **Verdict audit** — confirm every `similar` item satisfies a test, every `not-similar` item shows a violated angle or ratio in its marks, and every `cannot-tell` item has a computed counterexample.
4. **Exact-scale audit** — confirm every scale factor is an exact fraction with its direction stated, that the reversed direction is exactly the reciprocal, and that every length answer equals the value measured from the constructed figures.
5. **Area/volume dual-check audit** — for every World 7 and World 8 item, confirm the formula answer (k², k³, or the map-area conversion) equals `polygonArea` / `cuboidVolume` computed directly from the constructed figures; confirm every unit conversion is exact.
6. **Hidden-triangle audit** — confirm each hidden figure's equal angles are derivable by a stated reason, and that removing any one equal-angle fact makes `classifyTriangleMarks` stop returning a test; confirm no item compares a part with a whole (for example AD with DB) as corresponding.
7. **Chain-validity audit** — run `checkChain` on every generated correct argument and every accepted ordering and confirm all pass; run it on every seeded flaw and confirm each fails at exactly the intended step with the intended `failureType`, including `ratio-before-similarity` and `non-corresponding-sides-compared`.
8. **Not-to-scale audit** — confirm every flagged figure is rendered from `distortNotToScale`, and that no drawn value reveals an answer.
9. **Cross-module vocabulary audit** — diff `REASONS`, `REASON_DISPLAY`, and shared test wording against `congruence-quest-main` and `reason-quest-main`; confirm the similarity and congruence test functions remain separate (§1, risk 3).
10. **Audio parity check** — every string passed to a narration helper has an exact match in `audioMap.js`, or is intentionally dynamic.
11. **Full user-journey walkthrough** — Wonder → Story (all 4 panels) → Simulate (all 4 stations completable, tab-gating correct) → Practice (World Map, all 4 modes, all 10 Boss Battles, badges, and all extra answer types) → Reflect — zero console/page errors.
12. **Production build check** — `npm install && npm run build` succeeds from a clean extract.
13. **Accessibility spot-check** — fonts/touch targets at Secondary sizing; every figure has a text description of its marks, correspondence, and values; marks are not colour-only; sliders, ordering, and overlap separation have keyboard controls.
14. **Delivery checklist** — zip excludes `node_modules/`/`dist/`; 4 story image placeholders with art-brief README; `README.md` updated and checked for leftover branding (§1.5); `.env.local.example` documents `VITE_ELEVENLABS_API_KEY` with no real key committed.

## 11. Risks

- **Exact arithmetic is non-negotiable.** One float in a ratio path can make an answer key disagree with a correct student answer. Keep `ratio.js` as the only way ratios are created, compared, and stored, and lint for raw division in the generators.
- **Direction errors are easy to ship.** If a template states a scale factor without a direction, 2/5 and 5/2 are both defensible. The audit in §10.4 should block any item whose direction is missing or whose stated direction disagrees with its answer.
- **Similarity and congruence test code must not be merged.** Reusing one "triangle test" function across both modules would blur the central contrast (AA proves similarity but not congruence). Keep `similarityMath.js` and `congruenceMath.js` separate, and delete the unused congruence code when cloning (§1.5).
- **Cross-repo engine drift.** The reasoning engine is duplicated across three repos with no automatic check; run the diff in §10.9 whenever any of them changes. If duplication becomes costly, a small shared package would be a platform-level decision.
- **Nested-figure mislabelling.** In embedded figures the most common error is comparing a part (AD) with a whole side of the other triangle's partner (AB); the hidden-triangle audit and `non-corresponding-sides-compared` exist to catch it, and `separateOverlapping` must preserve labels and orientation exactly.
- **Pathway-dependent scope.** If the target pathway places area and volume ratios later (PRD §15.1), World 7 may need an "extension" flag without disturbing the rest of the bank; keep its items tagged so they can be separated.
- **Answer-type surface.** Four extra answer types increase interaction and accessibility testing compared with a plain MCQ module.
- **Concept Discovery Lab tension, unresolved for this module** (PRD §15.5).
