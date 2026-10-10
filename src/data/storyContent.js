// src/data/storyContent.js
// 4 story panels per PRD §8.2 & TRD §4.3
export const STORY_PANELS = [
  {
    panel: 0,
    title: "The Exhibition",
    text: "At the school scale-model exhibition hall, Dania and Kabir are building a miniature model of a landmark statue. Dania holds a can of spray paint: 'The original statue needs 40 litres of paint. Our model is at one-twentieth scale, so let's just halve the paint twice — maybe 2 litres?' Kabir pauses: 'Wait Dania! Scale models must be the exact same shape at a different size. Double the length does not mean double the paint!'",
    highlight: "Building miniature landmarks: same shape doesn't mean same size, and double the length doesn't mean double the paint!",
    character: "Dania & Kabir",
    characterEmoji: "👧🏽",
    imageBg: "radial-gradient(ellipse at center, rgba(77,144,142,0.4) 0%, #0a0a2e 100%)",
    imageEmoji: "🏛️",
  },
  {
    panel: 1,
    title: "Same Shape, Different Size",
    text: "Otto the Otter swims over with an otter family blueprint. 'Two figures are similar (∼) if they have the exact same shape: corresponding angles are equal, and corresponding sides are in the same ratio!' Otto wiggles his whiskers: 'The scale factor from figure A to B is (length in B) ÷ (matching length in A). When writing △ABC ∼ △PQR, vertex A matches P, B matches Q, and C matches R. Always state your scale factor with its direction!'",
    highlight: "Similar figures have equal angles and proportional sides: △ABC ∼ △PQR fixes the vertex match!",
    character: "Otto the Otter",
    characterEmoji: "🦦",
    imageBg: "radial-gradient(ellipse at center, rgba(249,199,79,0.4) 0%, #0a0a2e 100%)",
    imageEmoji: "🪞",
  },
  {
    panel: 2,
    title: "Two Checks, Not One",
    text: "Kabir draws on the whiteboard: 'For general polygons, checking angles alone or sides alone is not enough! A rectangle and a square have four 90° angles, but their sides are not in proportion. Two rhombuses can have matching side ratios, but different angles!' Otto adds: 'For triangles, three shortcuts work: AA (two equal angle pairs), SSS ratio (all three side pairs proportional), and SAS ratio (two proportional sides with the included angle equal).'",
    highlight: "Polygons require BOTH equal angles and proportional sides. For triangles, AA, SSS ratio, or SAS ratio proves similarity.",
    character: "Kabir & Otto",
    characterEmoji: "🧑🏽",
    imageBg: "radial-gradient(ellipse at center, rgba(87,117,144,0.4) 0%, #0a0a2e 100%)",
    imageEmoji: "📐",
  },
  {
    panel: 3,
    title: "Twice as Long, Four Times the Paint",
    text: "The exhibition opening is here! Dania discovers the secret: 'Length scales by k, but area scales by k²! Since the statue is scaled by 1/20, its surface area scales by (1/20)² = 1/400. That 40-litre paint job only needs 0.1 litres of paint for the model!' Kabir smiles: 'And the sand volume in the base scales by k³ = 1/8000! With our scale drawing and map distance verified, the grand model exhibition is open!'",
    highlight: "Lengths scale by k, surface area by k², and volume by k³! The model needs just 0.1 litres of paint.",
    character: "Dania & Kabir",
    characterEmoji: "👧🏽",
    imageBg: "radial-gradient(ellipse at center, rgba(243,114,44,0.4) 0%, #0a0a2e 100%)",
    imageEmoji: "🏆",
  },
];
