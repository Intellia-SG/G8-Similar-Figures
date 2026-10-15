// src/utils/narration.js
/**
 * Narration script builder for SimilarQuest
 * Strictly matches on-screen text 1:1, following PRD §11 & TRD §8 rules.
 */

export const say       = (text) => ({ text, style: 'statement' });
export const ask       = (text) => ({ text, style: 'question' });
export const cheer     = (text) => ({ text, style: 'celebration' });
export const celebrate = (text) => ({ text, style: 'celebration' });
export const emphasize = (text) => ({ text, style: 'emphasis' });
export const think     = (text) => ({ text, style: 'thinking' });
export const instruct  = (text) => ({ text, style: 'instruction' });
export const encourage = (text) => ({ text, style: 'encouragement' });

export function introNarration() {
  return [
    say("Welcome to SimilarQuest! Master scale factors, triangle tests, and model scaling!"),
    say("Hi! I'm Otto the Otter. Ready to join Dania and Kabir at the scale-model exhibition hall, find scale factors, test similarity, and discover why double length means four times the paint?"),
  ];
}

export function wonderNarration() {
  return [
    say("Welcome to SimilarQuest! Let's investigate the scale-model paint mystery!"),
    say("A landmark statue needs 40 litres of paint to cover its surface."),
    say("The club builds a scale model where every length is one-twentieth of the real statue."),
    ask("How much paint does the model need — about 2 litres, a tiny fraction of a litre, or something else?"),
    cheer("Let's investigate how scaling lengths changes perimeter, area, and volume!"),
  ];
}

export function storyNarration(panel) {
  const scripts = [
    [
      say("At the school scale-model exhibition hall, Dania and Kabir are building a miniature model of a landmark statue."),
      say("Dania holds a can of spray paint: The original statue needs 40 litres of paint. Our model is at one-twentieth scale, so let's just halve the paint twice — maybe 2 litres?"),
      emphasize("Kabir pauses: Wait Dania! Scale models must be the exact same shape at a different size. Double the length does not mean double the paint!"),
    ],
    [
      say("Otto the Otter swims over with an otter family blueprint."),
      say("Two figures are similar if they have the exact same shape: corresponding angles are equal, and corresponding sides are in the same ratio!"),
      emphasize("The scale factor from figure A to figure B is length in B divided by matching length in A. When writing triangle A B C is similar to triangle P Q R, vertex A matches P, B matches Q, and C matches R. Always state your scale factor with its direction!"),
    ],
    [
      say("Kabir draws on the whiteboard: For general polygons, checking angles alone or sides alone is not enough! A rectangle and a square have four 90 degree angles, but their sides are not in proportion. Two rhombuses can have matching side ratios, but different angles!"),
      say("Otto adds: For triangles, three shortcuts work: angle angle — two equal angle pairs; side side side — all three side pairs proportional; and side angle side — two proportional sides with the included angle equal."),
    ],
    [
      say("The exhibition opening is here! Dania discovers the secret: Length scales by the scale factor, but area scales by the scale factor squared!"),
      say("Since the statue is scaled by one-twentieth, its surface area scales by one-twentieth squared, which is one over four hundred. That 40-litre paint job only needs 0.1 litres of paint for the model!"),
      cheer("And the sand volume in the base scales by the scale factor cubed! With our scale drawing and map distance verified, the grand model exhibition is open!"),
    ],
  ];

  return scripts[panel] || scripts[0];
}

export function simStationIntro(stationIdx) {
  const intros = [
    [
      instruct("Welcome to Station A — The Scale Lab!"),
      instruct("Drag the scale slider to see lengths scale by k and area by k squared. Then toggle Break It to see how non-uniform stretching destroys similarity!"),
    ],
    [
      instruct("Welcome to Station B — Scale to Fit!"),
      instruct("Target the scale factor so the miniature model fits within the exhibition constraint for height, base area, or water volume!"),
    ],
    [
      instruct("Welcome to Station C — The Full Exhibit!"),
      instruct("Separate the overlapping triangles, mark equal corresponding angles with reasons, choose the similarity test, and deduce unknown lengths and area ratios!"),
    ],
    [
      instruct("Welcome to Station D — Spot the Bad Scale!"),
      instruct("A club member's notebook contains a seeded scaling error. Tap the flawed step, identify why it fails, and select the valid mathematical correction!"),
    ],
  ];

  return intros[stationIdx] || intros[0];
}

export function simStationTakeaway(stationIdx) {
  const takeaways = [
    think("Notice that when lengths scale by k, the perimeter scales by k and area scales by k squared. When we break uniformity, angles change and similarity is destroyed!"),
    cheer("Model fitted to precision! The scale factor meets all height, area, and volume constraints!"),
    cheer("Full exhibit solved! The overlapping triangles are separated, proven similar by angle angle, and all lengths and area ratios verified!"),
    cheer("Error spotted and corrected! Always use multiplicative scale factors and square for area!"),
  ];
  return [takeaways[stationIdx] || takeaways[0]];
}

export function playQuestionNarration(questionText) {
  return [
    ask(questionText)
  ];
}

export function playCorrectNarration(streak = 1) {
  if (streak >= 10) {
    return [cheer("Perfect proportion streak! Ten in a row with absolute precision! 🔥")];
  }
  if (streak >= 5) {
    return [cheer("Steady scaling! Five in a row! 📏")];
  }
  if (streak >= 3) {
    return [cheer("Awesome! Three in a row! ⭐")];
  }
  return [cheer("Spot on! That's correct! 🎉")];
}

export function playWrongNarration() {
  return [
    think("Not quite — check the hint, check whether it scales by k or k squared, and try again! 💡")
  ];
}

export function playHint1Narration() {
  return [
    encourage("Here's your first clue! Check the direction of scaling and see if corresponding parts match.")
  ];
}

export function playHint2Narration() {
  return [
    encourage("Here's your final hint! Remember that lengths scale by k, areas scale by k squared, and volumes scale by k cubed.")
  ];
}

export function districtCompleteNarration() {
  return [
    cheer("World Complete! Spectacular job on this scale-model world! 🌟")
  ];
}

export function practiceCompleteNarration() {
  return [
    cheer("Practice Phase Complete! You have explored all 10 scale-model worlds!")
  ];
}

export function bossStartNarration() {
  return [
    emphasize("The Boss Battle begins! Answer correctly to defeat the boss and claim your scale badge!")
  ];
}

export function bossChallengeNarration(worldId) {
  const challenges = [
    "The Stretchy Mirror challenges you! Show that you understand what makes figures similar!",
    "The Mislabelled Model Kit challenges you! Match every corresponding vertex and side!",
    "The Backwards Ratio challenges you! State the scale factor in the correct direction!",
    "The Missing Piece challenges you! Use multiplicative reasoning to find the unknown length!",
    "The Half-Right Replica challenges you! Remember that polygons require both equal angles and proportional sides!",
    "The Test Gatekeeper challenges you! Apply angle angle, side side side, or side angle side!",
    "The Hidden Mini challenges you! Uncover the hidden similar triangles and find the unknown side!",
    "The Size Squasher challenges you! Scale lengths by k, areas by k squared, and volumes by k cubed!",
    "The Map Mix-Up challenges you! Master map scales and scale drawings!",
    "The Exhibition Curator challenges you! Prove your mastery of all similar figures concepts!",
  ];
  return [emphasize(challenges[worldId] || challenges[0])];
}

export function bossWinNarration() {
  return [
    cheer("Replica Approved! You defeated the boss and claimed the World Badge! 🏅")
  ];
}

export function bossDefeatNarration() {
  return [
    think("The boss was too tricky this time! Review the similarity and scaling rules and challenge the boss again!")
  ];
}

export function reflectNarration() {
  return [
    say("Welcome to the Reflect Phase! Let's review the headline similarity misconceptions and check your scorecard! 📓")
  ];
}

export function reflectMascotNarration() {
  return [
    think("Let's check your key takeaways and review your scorecard!")
  ];
}

export function reflectQuestionNarration(qIdx) {
  const questions = [
    ask("A miniature model has length scale factor k = 1/10 of the original building. Dania thinks the model's floor area will also be 1/10 of the original. What is the actual area ratio?"),
    ask("A scale model triangle has side 4 cm matching a real 12 cm side. Another real side is 15 cm. Dania says the matching model side is 7 cm. Kabir says it is 5 cm. Who is right?"),
    ask("Two quadrilaterals both have four 90 degree angles. Are they similar?"),
  ];
  return [questions[qIdx] || questions[0]];
}

export function reflectCompleteNarration() {
  return [
    cheer("Outstanding! You have mastered similar figures, scale factors, triangle tests, and area-volume scaling! You are a true Master Model Maker! 🏆")
  ];
}
