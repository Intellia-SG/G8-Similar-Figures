# CongruenceQuest — Grade 8 Congruence & Geometric Proof

**Grade 8 · Secondary 2 Mathematics**
Interactive educational module built on the five-phase learning architecture:
**Wonder ➔ Story ➔ Simulate ➔ Practice (Play) ➔ Reflect**

---

## 🎭 Theme & Narrative
- **Story Theme:** Backstage crew of a school musical.
- **Goal:** Build matching pairs of stage flats and timber props with the fewest, right measurements.
- **Characters:**
  - **Li Ting** (`👧🏻`) — trusts what looks the same from row ten.
  - **Haikal** (`🧑🏽`) — counts matched parts and checks where they sit.
  - **Echo the Mynah** (`🐦`) — mascot and mentor who demonstrates that flipped and turned copies are still congruent.

---

## 🧪 The 4 Interactive Simulate Stations
1. **The Pin Board (`ThePinBoard.jsx`)** — *Concept Discovery Lab*: Pin SSS, SAS, ASA, AAS, RHS, SSA, and AAA to discover why five are valid tests while SSA and AAA are ambiguous or scale-only non-tests.
2. **Cut the Copy (`CutTheCopy.jsx`)** — *Build-to-Target Challenge*: Choose 3 parts, enter values via keyboard/steppers, and test if the cut copy fits the target flat overlay.
3. **The Full Rehearsal (`TheFullRehearsal.jsx`)** — *Multi-Step Construction*: Separate overlapping set pieces, mark hidden common edges, choose tests, and arrange the complete proof chain.
4. **Spot the Bad Match (`SpotTheBadMatch.jsx`)** — *Error-Detective*: Inspect a stagehand's argument, spot seeded geometric flaws (SSA trap, circular CPCTC deduction), and provide the watertight fix.

---

## 🎨 Story Art Briefs (PRD §13)
The 4 story panels (`src/data/storyContent.js`) use responsive placeholders framed with rich theatre gradients:
1. **Panel 1 — The Matching Pair:** A backstage workshop with a left and a right wing flat being built; Li Ting and Haikal stand at the workbench holding tape measures.
2. **Panel 2 — Same Shape, Same Size — Even Flipped:** Echo the Mynah swoops down displaying a blueprint showing a left stage flat flipped over onto a right flat, demonstrating identical correspondence ($A \leftrightarrow P, B \leftrightarrow Q, C \leftrightarrow R$).
3. **Panel 3 — Three Is Enough (If They're the Right Three):** Haikal holds up a timber frame that swings into acute and obtuse shapes (the SSA trap) while Echo highlights the valid criteria (SSS, SAS, ASA, AAS, RHS).
4. **Panel 4 — Opening Night:** Two overlapping set pieces on stage with the shared centre edge highlighted in gold, the cast cheering as the spotlight shines.

---

## 🚀 Running the Project
```bash
# Install dependencies
npm install

# Start local Vite development server
npm run dev

# Run production build
npm run build

# Pre-generate narration audio (requires VITE_ELEVENLABS_API_KEY in .env.local)
npm run generate-audio
```
