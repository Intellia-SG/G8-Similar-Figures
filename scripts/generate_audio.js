// scripts/generate_audio.js
// Offline pre-generation script for ElevenLabs narration audio files for SimilarQuest.
// Strictly follows audio_generation_pipeline (5).md specifications and PRD §11 rules.

import fs from 'fs';
import path from 'path';

// Helper to read environment variables without external dependencies
function loadEnv() {
  const envFiles = ['.env.local', '.env'];
  for (const file of envFiles) {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf-8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const [key, ...rest] = trimmed.split('=');
          const val = rest.join('=').replace(/^["']|["']$/g, '').trim();
          if (!process.env[key.trim()]) {
            process.env[key.trim()] = val;
          }
        }
      }
    }
  }
}

loadEnv();

const apiKey = process.env.VITE_ELEVENLABS_API_KEY || process.env.ELEVENLABS_API_KEY;
if (!apiKey) {
  console.log("\nℹ️ Notice: VITE_ELEVENLABS_API_KEY is not defined in .env.local or .env.");
  console.log("Audio files can be generated once an API key is provided in .env.local.\n");
}

const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice — Clear, Engaging Educator
const VOICE_MODEL = 'eleven_multilingual_v2';

const VOICE_SETTINGS = {
  statement:     { stability: 0.65, similarity_boost: 0.80, style: 0.30, use_speaker_boost: true },
  instruction:   { stability: 0.65, similarity_boost: 0.80, style: 0.30, use_speaker_boost: true },
  question:      { stability: 0.55, similarity_boost: 0.75, style: 0.50, use_speaker_boost: true },
  encouragement: { stability: 0.50, similarity_boost: 0.85, style: 0.60, use_speaker_boost: true },
  emphasis:      { stability: 0.75, similarity_boost: 0.90, style: 0.20, use_speaker_boost: true },
  thinking:      { stability: 0.70, similarity_boost: 0.78, style: 0.40, use_speaker_boost: true },
  celebration:   { stability: 0.45, similarity_boost: 0.85, style: 0.80, use_speaker_boost: true },
};

const phrases = [
  // ─── INTRO & WONDER ────────────────────────────────────────────────────────
  { text: "Welcome to SimilarQuest! Let's investigate the scale-model paint mystery!", style: 'statement' },
  { text: "A landmark statue needs 40 litres of paint to cover its surface.", style: 'statement' },
  { text: "The club builds a scale model where every length is one-twentieth of the real statue.", style: 'statement' },
  { text: "How much paint does the model need — about 2 litres, a tiny fraction of a litre, or something else?", style: 'question' },
  { text: "Let's investigate how scaling lengths changes perimeter, area, and volume!", style: 'celebration' },

  // ─── STORY PHASE: PANEL 1 ────────────────────────────────────────────────
  { text: "At the school scale-model exhibition hall, Dania and Kabir are building a miniature model of a landmark statue.", style: 'statement' },
  { text: "Dania holds a can of spray paint: The original statue needs 40 litres of paint. Our model is at one-twentieth scale, so let's just halve the paint twice — maybe 2 litres?", style: 'statement' },
  { text: "Kabir pauses: Wait Dania! Scale models must be the exact same shape at a different size. Double the length does not mean double the paint!", style: 'emphasis' },

  // ─── STORY PHASE: PANEL 2 ────────────────────────────────────────────────
  { text: "Otto the Otter swims over with an otter family blueprint.", style: 'statement' },
  { text: "Two figures are similar if they have the exact same shape: corresponding angles are equal, and corresponding sides are in the same ratio!", style: 'statement' },
  { text: "The scale factor from figure A to figure B is length in B divided by matching length in A. When writing triangle A B C is similar to triangle P Q R, vertex A matches P, B matches Q, and C matches R. Always state your scale factor with its direction!", style: 'emphasis' },

  // ─── STORY PHASE: PANEL 3 ────────────────────────────────────────────────
  { text: "Kabir draws on the whiteboard: For general polygons, checking angles alone or sides alone is not enough! A rectangle and a square have four 90 degree angles, but their sides are not in proportion. Two rhombuses can have matching side ratios, but different angles!", style: 'statement' },
  { text: "Otto adds: For triangles, three shortcuts work: angle angle — two equal angle pairs; side side side — all three side pairs proportional; and side angle side — two proportional sides with the included angle equal.", style: 'statement' },

  // ─── STORY PHASE: PANEL 4 ────────────────────────────────────────────────
  { text: "The exhibition opening is here! Dania discovers the secret: Length scales by the scale factor, but area scales by the scale factor squared!", style: 'statement' },
  { text: "Since the statue is scaled by one-twentieth, its surface area scales by one-twentieth squared, which is one over four hundred. That 40-litre paint job only needs 0.1 litres of paint for the model!", style: 'statement' },
  { text: "And the sand volume in the base scales by the scale factor cubed! With our scale drawing and map distance verified, the grand model exhibition is open!", style: 'celebration' },

  // ─── SIMULATE STATIONS INTROS ────────────────────────────────────────────
  { text: "Welcome to Station A — The Scale Lab!", style: 'instruction' },
  { text: "Drag the scale slider to see lengths scale by k and area by k squared. Then toggle Break It to see how non-uniform stretching destroys similarity!", style: 'instruction' },

  { text: "Welcome to Station B — Scale to Fit!", style: 'instruction' },
  { text: "Target the scale factor so the miniature model fits within the exhibition constraint for height, base area, or water volume!", style: 'instruction' },

  { text: "Welcome to Station C — The Full Exhibit!", style: 'instruction' },
  { text: "Separate the overlapping triangles, mark equal corresponding angles with reasons, choose the similarity test, and deduce unknown lengths and area ratios!", style: 'instruction' },

  { text: "Welcome to Station D — Spot the Bad Scale!", style: 'instruction' },
  { text: "A club member's notebook contains a seeded scaling error. Tap the flawed step, identify why it fails, and select the valid mathematical correction!", style: 'instruction' },

  // ─── PRACTICE & FEEDBACK ──────────────────────────────────────────────────
  { text: "Perfect proportion streak! Ten in a row with absolute precision! 🔥", style: 'celebration' },
  { text: "Steady scaling! Five in a row! 📏", style: 'celebration' },
  { text: "Awesome! Three in a row! ⭐", style: 'celebration' },
  { text: "Spot on! That's correct! 🎉", style: 'celebration' },
  { text: "Not quite — check the hint, check whether it scales by k or k squared, and try again! 💡", style: 'thinking' },
  { text: "Here's your first clue! Check the direction of scaling and see if corresponding parts match.", style: 'encouragement' },
  { text: "Here's your final hint! Remember that lengths scale by k, areas scale by k squared, and volumes scale by k cubed.", style: 'encouragement' },

  // ─── WORLD COMPLETE & BOSS ────────────────────────────────────────────────
  { text: "World Complete! Spectacular job on this scale-model world! 🌟", style: 'celebration' },
  { text: "The Boss Battle begins! Answer correctly to defeat the boss and claim your scale badge!", style: 'emphasis' },
  { text: "Replica Approved! You defeated the boss and claimed the World Badge! 🏅", style: 'celebration' },

  // ─── REFLECT PHASE ────────────────────────────────────────────────────────
  { text: "Welcome to the Reflect Phase! Let's review the headline similarity misconceptions and check your scorecard! 📓", style: 'statement' },
  { text: "Outstanding! You have mastered similar figures, scale factors, triangle tests, and area-volume scaling! You are a true Master Model Maker! 🏆", style: 'celebration' },

  // ─── INTRO SCREEN DIALOGUES ───────────────────────────────────────────────
  { text: "Welcome to SimilarQuest! Master scale factors, triangle tests, and model scaling!", style: 'statement' },
  { text: "Hi! I'm Otto the Otter. Ready to join Dania and Kabir at the scale-model exhibition hall, find scale factors, test similarity, and discover why double length means four times the paint?", style: 'statement' },

  // ─── SIMULATION STATIONS TAKEAWAYS & COMPLETIONS ───────────────────────────
  { text: "Notice that when lengths scale by k, the perimeter scales by k and area scales by k squared. When we break uniformity, angles change and similarity is destroyed!", style: 'thinking' },
  { text: "Model fitted to precision! The scale factor meets all height, area, and volume constraints!", style: 'celebration' },
  { text: "Full exhibit solved! The overlapping triangles are separated, proven similar by angle angle, and all lengths and area ratios verified!", style: 'celebration' },
  { text: "Error spotted and corrected! Always use multiplicative scale factors and square for area!", style: 'celebration' },

  // ─── PLAY PHASE EXTRA DIALOGUES & BOSS DEFEAT ─────────────────────────────
  { text: "Practice Phase Complete! You have explored all 10 scale-model worlds!", style: 'celebration' },
  { text: "The boss was too tricky this time! Review the similarity and scaling rules and challenge the boss again!", style: 'thinking' },

  // ─── 10 WORLD BOSS CHALLENGE DIALOGUES ────────────────────────────────────
  { text: "The Stretchy Mirror challenges you! Show that you understand what makes figures similar!", style: 'emphasis' },
  { text: "The Mislabelled Model Kit challenges you! Match every corresponding vertex and side!", style: 'emphasis' },
  { text: "The Backwards Ratio challenges you! State the scale factor in the correct direction!", style: 'emphasis' },
  { text: "The Missing Piece challenges you! Use multiplicative reasoning to find the unknown length!", style: 'emphasis' },
  { text: "The Half-Right Replica challenges you! Remember that polygons require both equal angles and proportional sides!", style: 'emphasis' },
  { text: "The Test Gatekeeper challenges you! Apply angle angle, side side side, or side angle side!", style: 'emphasis' },
  { text: "The Hidden Mini challenges you! Uncover the hidden similar triangles and find the unknown side!", style: 'emphasis' },
  { text: "The Size Squasher challenges you! Scale lengths by k, areas by k squared, and volumes by k cubed!", style: 'emphasis' },
  { text: "The Map Mix-Up challenges you! Master map scales and scale drawings!", style: 'emphasis' },
  { text: "The Exhibition Curator challenges you! Prove your mastery of all similar figures concepts!", style: 'emphasis' },

  // ─── REFLECT QUESTIONS & MASCOT ───────────────────────────────────────────
  { text: "Let's check your key takeaways and review your scorecard!", style: 'thinking' },
  { text: "A miniature model has length scale factor k = 1/10 of the original building. Dania thinks the model's floor area will also be 1/10 of the original. What is the actual area ratio?", style: 'question' },
  { text: "A scale model triangle has side 4 cm matching a real 12 cm side. Another real side is 15 cm. Dania says the matching model side is 7 cm. Kabir says it is 5 cm. Who is right?", style: 'question' },
  { text: "Two quadrilaterals both have four 90 degree angles. Are they similar?", style: 'question' },

  // ─── GEOMETRIC REASONS & STEP EXPLANATIONS ────────────────────────────────
  { text: "because of the angle, angle similarity criterion", style: 'statement' },
  { text: "because all three pairs of corresponding sides are in the same ratio", style: 'statement' },
  { text: "because two pairs of sides are in the same ratio and the angle between them is equal", style: 'statement' },
  { text: "because corresponding sides of similar triangles are proportional", style: 'statement' },
  { text: "because corresponding angles of similar triangles are equal", style: 'statement' },
  { text: "using the scale factor from figure A to figure B", style: 'statement' },
  { text: "because area scales by the scale factor squared", style: 'statement' },
  { text: "because volume scales by the scale factor cubed", style: 'statement' },
  { text: "because vertically opposite angles are equal", style: 'statement' },
  { text: "because alternate angles are equal when lines are parallel", style: 'statement' },
  { text: "because corresponding angles are equal when lines are parallel", style: 'statement' },
  { text: "because interior angles of a triangle sum to 180 degrees", style: 'statement' },
];

function cleanString(str) {
  return str
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .trim()
    .replace(/\s+/g, '_')
    .slice(0, 50);
}

async function main() {
  const outputDir = path.resolve('public/assets/audio');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log(`\n🎙️ Starting ElevenLabs Audio Generation Pipeline for SimilarQuest`);
  console.log(`Voice ID: ${VOICE_ID} | Model: ${VOICE_MODEL}`);
  console.log(`Total phrases to process: ${phrases.length}\n`);

  const mapping = {};

  for (let i = 0; i < phrases.length; i++) {
    const { text, style } = phrases[i];
    const cleanText = cleanString(text);
    const fileName = `audio_${cleanText}_${i}.mp3`;
    const destPath = path.join(outputDir, fileName);

    const relativeWebPath = `/assets/audio/${fileName}`;
    mapping[text] = relativeWebPath;

    if (fs.existsSync(destPath)) {
      console.log(`[${i + 1}/${phrases.length}] ⏩ Skipped (already exists): ${fileName}`);
      continue;
    }

    if (!apiKey) {
      continue;
    }

    console.log(`[${i + 1}/${phrases.length}] 🔊 Generating: "${text.substring(0, 40)}..." -> ${fileName}`);

    const settings = VOICE_SETTINGS[style] || VOICE_SETTINGS.statement;

    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: VOICE_MODEL,
          voice_settings: settings,
        }),
      });

      if (!response.ok) {
        const errBody = await response.text();
        throw new Error(`HTTP ${response.status}: ${errBody}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      fs.writeFileSync(destPath, buffer);
      console.log(`   ✅ Saved: ${destPath}`);
    } catch (e) {
      console.error(`   ❌ Failed to generate phrase "${text}":`, e.message);
    }
  }

  // Write mapping to src/utils/audioMap.js
  const mapContent = `// Auto-generated by generate_audio.js\n// Static asset mapping for offline generated narration phrases in SimilarQuest\n\nexport const audioMap = ${JSON.stringify(mapping, null, 2)};\n\nexport default audioMap;\n`;
  fs.writeFileSync('./src/utils/audioMap.js', mapContent);
  console.log("\n✨ Audio mapping updated in src/utils/audioMap.js!");
  console.log("🎉 Audio script processing completed successfully!\n");
}

main().catch(console.error);
