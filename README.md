# SimilarQuest — Grade 8 Similar Figures & Scale Factors

**Grade 8 · Secondary 2 Mathematics (Express / G3 Pathway)**
Interactive educational module built on the five-phase learning architecture:
**Wonder ➔ Story ➔ Simulate ➔ Practice (Play) ➔ Reflect**

---

## 🏛️ Theme & Narrative
- **Story Theme:** School scale-model exhibition. A club builds miniature versions of familiar landmarks and structures where every model must be the same shape as the real thing at a different size.
- **Throughline:** *"Same shape doesn't mean same size, and double the length does not mean double the paint!"*
- **Characters:**
  - **Dania** (`👧🏽`) — assumes "twice as long" means "twice as much of everything," including area.
  - **Kabir** (`🧑🏽`) — checks every pair of corresponding sides and states which figure he is scaling *from*.
  - **Otto the Otter** (`🦦`) — mascot and mentor who demonstrates that similar figures share the exact same shape across different sizes.

---

## 🧪 The 4 Interactive Simulate Stations (Archetype-Mapped)
1. **The Scale Lab (`TheScaleLab.jsx`)** — *Concept Discovery Lab*: Drag the scale factor slider to watch lengths scale by $k$, area by $k^2$ (with unit squares drawn), while angles stay fixed. Toggle "Break It" to stretch non-uniformly and witness how similarity is broken.
2. **Scale to Fit (`ScaleToFit.jsx`)** — *Build-to-Target Challenge*: Set the scale factor to fit stated constraints (shelf height limit, base area budget, water volume limit) with a live readout of matching dimensions and a multi-exhibit loop.
3. **The Full Exhibit (`TheFullExhibit.jsx`)** — *Multi-Step / Composite Construction*: Separate overlapping triangles on an embedded parallel-cut figure, mark equal angles with geometric reasons, choose the similarity test (AA), write the similarity statement, and deduce missing lengths and area ratios.
4. **Spot the Bad Scale (`SpotTheBadScale.jsx`)** — *Error-Detective*: Inspect a club member's notebook, tap the seeded flaw (area scaled by $k$ instead of $k^2$, reversed scale factor direction, or additive reasoning), and select the exact mathematical fix.

---

## 🎨 Story Art Briefs (PRD §13)
The 4 story panels (`src/data/storyContent.js`) use CSS-framed placeholders and art briefs for production illustration:
1. **Panel 1 — The Exhibition:** A school hall set up for a model exhibition, Dania and Kabir at a table with a half-built landmark model and spray paint cans.
2. **Panel 2 — Same Shape, Different Size:** Otto the Otter standing with an otter family of different sizes with the exact same shape, illustrating similarity, corresponding parts, and scale factor with direction.
3. **Panel 3 — Two Checks, Not One:** Kabir at a whiteboard comparing a rectangle and a square (equal angles but unequal side ratios) and a rhombus and square, with Otto displaying the 3 triangle similarity shortcuts (AA, SSS ratio, SAS ratio).
4. **Panel 4 — Twice as Long, Four Times the Paint:** The finished miniature model beside its paint tin (0.1 L), a sand tray base demonstrating volume scaling ($k^3$), and an exhibition map with a scale bar on the wall.

---

## 🎮 Practice Worlds (10 Worlds × 10 Questions = 100 Questions)
- **World 0:** Same Shape, Different Size (`similar-vs-congruent-figures`) · Boss: The Stretchy Mirror 🪞
- **World 1:** Matching Sides and Angles (`corresponding-parts-and-similarity-statements`) · Boss: The Mislabelled Model Kit 📦
- **World 2:** Find the Scale Factor (`find-scale-factor`) · Boss: The Backwards Ratio 🔁
- **World 3:** Missing Lengths (`find-unknown-lengths-similar`) · Boss: The Missing Piece 🧩
- **World 4:** Both Conditions (`are-polygons-similar`) · Boss: The Half-Right Replica 🪆
- **World 5:** Triangle Tests (`similar-triangle-tests`) · Boss: The Test Gatekeeper 🚧
- **World 6:** Hidden Similar Triangles (`embedded-similar-triangles`) · Boss: The Hidden Mini 🔍
- **World 7:** Area and Volume Scale (`area-and-volume-ratios`) · Boss: The Size Squasher 🧊
- **World 8:** Maps and Models (`scale-drawings-maps-models`) · Boss: The Map Mix-Up 🗺️
- **World 9:** The Grand Exhibition (`mixed-review`) · Boss: The Exhibition Curator 🏛️

---

## 🚀 Running the Project
```bash
# Install dependencies
npm install

# Start local Vite development server
npm run dev

# Run comprehensive QA audit suite (14 Acceptance Criteria checks)
node scripts/audit_suite.js

# Run production build
npm run build

# Pre-generate narration audio (requires VITE_ELEVENLABS_API_KEY in .env.local)
npm run generate-audio
```
