// scripts/generate_audio.js
// Offline pre-generation script for ElevenLabs narration audio files for CongruenceQuest.
// Strictly follows audio_generation_pipeline (5).md specifications.

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
  { text: "Welcome to CongruenceQuest! Let's investigate the backstage match mystery!", style: 'statement' },
  { text: "Two stage flats look identical from the audience, but you can only afford to measure three things.", style: 'statement' },
  { text: "Which three measurements would guarantee that the two flats match exactly?", style: 'question' },
  { text: "Let's investigate how corresponding parts and congruence tests work!", style: 'celebration' },

  // ─── STORY PHASE: PANEL 1 ────────────────────────────────────────────────
  { text: "Backstage at the school musical, Li Ting and Haikal need to construct identical twin stage flats for the left and right wings of the theatre.", style: 'statement' },
  { text: "Li Ting glances across the workshop and smiles: Look, they look identical to the audience!", style: 'statement' },
  { text: "But Haikal shakes his head: Looking identical from row ten is not enough! Every joint has to fit the backstage track. We need exact proof, but we only have time to take three measurements!", style: 'emphasis' },

  // ─── STORY PHASE: PANEL 2 ────────────────────────────────────────────────
  { text: "Echo the Mynah swoops down with a blueprint.", style: 'statement' },
  { text: "Two figures are congruent if they have the exact same shape and size, even if one flat is turned sideways or flipped over like a mirror reflection!", style: 'statement' },
  { text: "Writing triangle A B C is congruent to triangle P Q R tells us the exact correspondence: vertex A matches P, vertex B matches Q, and vertex C matches R. The vertex order is the law!", style: 'emphasis' },

  // ─── STORY PHASE: PANEL 3 ────────────────────────────────────────────────
  { text: "Haikal holds up two triangular timber frames. We do not need to measure all six parts! Three matching pieces are enough, but only if they are the right three.", style: 'statement' },
  { text: "Matching two sides and an angle that is not between them lets the frame swing into two different shapes! And three angles can make a tiny prop and a giant flat!", style: 'thinking' },
  { text: "The only five valid tests are side side side, side angle side, angle side angle, angle angle side, and right angle hypotenuse side.", style: 'statement' },

  // ─── STORY PHASE: PANEL 4 ────────────────────────────────────────────────
  { text: "Curtain call is in ten minutes! Two large set pieces overlap across the centre stage, sharing a hidden centre beam.", style: 'statement' },
  { text: "Li Ting spots it: That shared beam is a common side for both triangles!", style: 'statement' },
  { text: "Together, the crew builds a watertight three-step argument with geometric reasons, states the side angle side test in brackets, and deduces the missing timber length. The show goes on!", style: 'celebration' },

  // ─── SIMULATE STATION INTROS ─────────────────────────────────────────────
  { text: "Welcome to Station A — The Pin Board!", style: 'instruction' },
  { text: "Pin three chosen parts on the triangle frame. Wiggle the free vertex to see whether the frame is locked into one unique triangle, or can swing into multiple shapes!", style: 'instruction' },
  { text: "Welcome to Station B — Cut the Copy!", style: 'instruction' },
  { text: "A target stage flat has hidden measurements. Choose your test, adjust the measurements with the steppers, and test if your cut copy fits the target flat overlay!", style: 'instruction' },
  { text: "Welcome to Station C — The Full Rehearsal!", style: 'instruction' },
  { text: "Separate the overlapping stage panels, mark the hidden shared side, choose the congruence test, and arrange the complete proof chain in logical order!", style: 'instruction' },
  { text: "Welcome to Station D — Spot the Bad Match!", style: 'instruction' },
  { text: "A fellow stagehand's argument contains a seeded geometric flaw. Tap the flawed step, identify why it fails, and select the valid mathematical correction!", style: 'instruction' },

  // ─── FEEDBACK & HINTS ────────────────────────────────────────────────────
  { text: "Spot on! That's correct! 🎉", style: 'celebration' },
  { text: "Awesome! Three in a row! ⭐", style: 'celebration' },
  { text: "Smooth scene change! Five in a row! 🎭", style: 'celebration' },
  { text: "Standing ovation! Ten in a row without missing a cue! 🔥", style: 'celebration' },
  { text: "Not quite — check the hint, inspect the marked parts carefully, and try again! 💡", style: 'thinking' },
  { text: "Here's your first clue! Count how many sides and how many angles are marked equal.", style: 'encouragement' },
  { text: "Here's your final hint! Check whether the angle is between the two sides, or whether the side is between the two angles.", style: 'encouragement' },

  // ─── DISTRICT & BOSS BATTLES ─────────────────────────────────────────────
  { text: "World Complete! Spectacular job on this congruence world! 🌟", style: 'celebration' },
  { text: "The Boss Battle begins! Answer correctly to defeat the boss and claim your backstage badge!", style: 'emphasis' },
  { text: "Encore! You defeated the boss and claimed the World Badge! 👑", style: 'celebration' },

  // ─── REFLECT PHASE ───────────────────────────────────────────────────────
  { text: "Welcome to the Reflect Phase! Let's review the headline congruence misconceptions and check your scorecard! 📓", style: 'statement' },
  { text: "Outstanding! You have mastered triangle congruence tests, corresponding parts, and geometric deduction! You are a true Stage Master! 🏆", style: 'celebration' },
];

const outputDir = './public/assets/audio';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function cleanString(str) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 45).replace(/_+/g, '_').replace(/^_|_$/g, '');
}

async function main() {
  console.log(`\n🎙️ Starting ElevenLabs Audio Generation Pipeline`);
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
  const mapContent = `// Auto-generated by generate_audio.js\n// Static asset mapping for offline generated narration phrases in CongruenceQuest\n\nexport const audioMap = ${JSON.stringify(mapping, null, 2)};\n\nexport default audioMap;\n`;
  fs.writeFileSync('./src/utils/audioMap.js', mapContent);
  console.log("\n✨ Audio mapping updated in src/utils/audioMap.js!");
  console.log("🎉 Audio generation completed successfully!\n");
}

main().catch(console.error);
