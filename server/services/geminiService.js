const { GoogleGenAI } = require('@google/genai');
const { z } = require('zod');

// Configuration per difficulty level (from SPEC.md section 5.2 & 22)
const DIFFICULTY_CONFIG = {
  easy: { suspects: 3, clues: 5, hints: 2, baseScore: 100 },
  medium: { suspects: 4, clues: 7, hints: 3, baseScore: 150 },
  hard: { suspects: 5, clues: 9, hints: 3, baseScore: 200 }
};

// Zod schema builder for validating generated mystery
function createMysteryZodSchema(difficulty) {
  const config = DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.easy;

  return z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    story: z.string().min(50, "Story must be at least 50 characters"),
    suspects: z.array(
      z.object({
        id: z.string().min(1),
        name: z.string().min(1),
        description: z.string().min(5)
      })
    ).length(config.suspects, `Must contain exactly ${config.suspects} suspects for ${difficulty} difficulty`),
    clues: z.array(
      z.object({
        id: z.string().min(1),
        text: z.string().min(5)
      })
    ).length(config.clues, `Must contain exactly ${config.clues} clues for ${difficulty} difficulty`),
    hints: z.array(
      z.string().min(5)
    ).length(config.hints, `Must contain exactly ${config.hints} hints for ${difficulty} difficulty`),
    culprit: z.string().min(1, "Culprit suspect ID is required"),
    solution: z.string().min(20, "Solution must be at least 20 characters")
  }).refine((data) => {
    // Culprit must match one of the suspects' id or name
    return data.suspects.some(s => s.id === data.culprit || s.name.toLowerCase() === data.culprit.toLowerCase());
  }, {
    message: "The culprit must match one of the suspects",
    path: ["culprit"]
  });
}

/**
 * Procedural fallback mystery cases when API key is missing or quota is reached
 */
function generateFallbackMystery(premise, difficulty) {
  const config = DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.easy;

  const names = [
    { id: 's1', name: 'Julian Vance', role: 'Chief Curator', motive: 'Suffering from mounting debt' },
    { id: 's2', name: 'Eleanor Sterling', role: 'Visiting Heiress', motive: 'Coveted the item for a private collection' },
    { id: 's3', name: 'Marcus Brody', role: 'Head of Security', motive: 'Disgruntled over imminent termination' },
    { id: 's4', name: 'Dr. Clara Thorne', role: 'Restoration Specialist', motive: 'Felt uncredited for historical discoveries' },
    { id: 's5', name: 'Arthur Pendelton', role: 'Night Caretaker', motive: 'Blackmailed by an anonymous underground syndicate' }
  ];

  const selectedSuspects = names.slice(0, config.suspects).map((s, idx) => ({
    id: `s${idx + 1}`,
    name: s.name,
    description: `${s.role} who was present during the incident. ${s.motive}.`
  }));

  const culpritSuspect = selectedSuspects[1]; // e.g. s2

  const cluePool = [
    `A single monogrammed embroidery cufflink was found caught on the velvet display latch.`,
    `Security logs show access codes were bypassed using a VIP master override keycard.`,
    `A subtle scent of rare French lavender perfume lingered near the shattered display pedestal.`,
    `Muddy shoe prints of luxury Italian leather boots lead toward the west terrace exit.`,
    `A discreetly encrypted text message on an abandoned burner phone reads: "The handover is at dawn."`,
    `The security camera in the gallery was deliberately angled upwards at 11:42 PM.`,
    `CCTV footage captured a silhouette slipping through the conservatory garden just after midnight.`,
    `Fingerprints on the display glass matched someone who wore satin evening gloves with a torn hem.`,
    `A duplicate receipt for customized vault lockpicking tools was recovered from a trash receptacle.`
  ];

  const selectedClues = cluePool.slice(0, config.clues).map((text, idx) => ({
    id: `c${idx + 1}`,
    text
  }));

  const hintPool = [
    `Inspect the personal accessories left behind at the crime scene carefully.`,
    `Pay special attention to who possessed both the privilege and motive to slip through unnoticed.`,
    `Review the physical traces—perfume and footwear point toward someone of distinguished wealth.`
  ];

  const selectedHints = hintPool.slice(0, config.hints);

  return {
    title: `The Enigma of: ${premise.slice(0, 40)}${premise.length > 40 ? '...' : ''}`,
    story: `An unsettling incident rocked the premises following this premise: "${premise}". In the quiet hours of the evening, an audacious heist occurred under mysterious circumstances. The local authorities have secured the perimeter, leaving ${config.suspects} primary suspects and ${config.clues} critical pieces of forensic evidence for you to analyze. Only a sharp detective will piece together the timeline and unmask the true culprit.`,
    suspects: selectedSuspects,
    clues: selectedClues,
    hints: selectedHints,
    culprit: culpritSuspect.id,
    solution: `Forensic evidence conclusively proves that ${culpritSuspect.name} (${culpritSuspect.id}) orchestrated the crime. The monogrammed cufflink, the scent of luxury lavender perfume, and the override key access directly tied back to their whereabouts during the critical window.`
  };
}

/**
 * Calls Google Gemini API using @google/genai SDK to generate a structured mystery
 */
async function generateMystery(premise, difficulty) {
  const config = DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.easy;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key') {
    console.log(`[geminiService] No GEMINI_API_KEY found. Generating high-quality procedural case.`);
    const fallback = generateFallbackMystery(premise, difficulty);
    const schema = createMysteryZodSchema(difficulty);
    return schema.parse(fallback);
  }

  const prompt = `You are a master mystery writer for an interactive detective game.
Create a compelling, logically consistent mystery case based on the following user premise:
Premise: "${premise}"
Difficulty: "${difficulty}"

Strict Requirements:
1. Exact count of suspects: exactly ${config.suspects} suspects (with id "s1", "s2", ..., name, and short description).
2. Exact count of clues: exactly ${config.clues} clues (with id "c1", "c2", ..., and clear textual clue).
3. Exact count of hints: exactly ${config.hints} hints (strings that guide the player without directly revealing the culprit).
4. Exactly one clear culprit whose id MUST match one of the suspect ids (e.g. "s1" or "s2").
5. A logical, coherent solution explaining why the culprit committed the crime and how the clues tie together.
6. The clues must genuinely point to the culprit through deductive reasoning, with some red herrings for other suspects, but no contradictory facts.

Respond ONLY with valid JSON in this exact structure:
{
  "title": "Case Title",
  "story": "Atmospheric 2-3 paragraph background and crime description...",
  "suspects": [
    { "id": "s1", "name": "...", "description": "..." }
  ],
  "clues": [
    { "id": "c1", "text": "..." }
  ],
  "hints": [
    "Hint text..."
  ],
  "culprit": "s2",
  "solution": "Detailed explanation of how the evidence proves the culprit did it..."
}`;

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // Call Gemini model
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error('Empty response from Gemini API');
    }

    // Parse JSON
    let parsedJson;
    try {
      parsedJson = JSON.parse(responseText);
    } catch (e) {
      // Clean up markdown backticks if any
      const cleaned = responseText.replace(/```json\s*/gi, '').replace(/```\s*$/gi, '').trim();
      parsedJson = JSON.parse(cleaned);
    }

    // Standardize culprit id: ensure it's the suspect's id
    if (parsedJson.suspects && Array.isArray(parsedJson.suspects)) {
      const match = parsedJson.suspects.find(
        s => s.id === parsedJson.culprit || s.name.toLowerCase() === String(parsedJson.culprit).toLowerCase()
      );
      if (match) {
        parsedJson.culprit = match.id;
      }
    }

    // Validate with Zod
    const schema = createMysteryZodSchema(difficulty);
    const validated = schema.parse(parsedJson);

    return validated;
  } catch (error) {
    console.error('[geminiService] Error generating mystery with Gemini:', error.message);
    // Fallback if network or quota issue arises so user flow is never disrupted
    console.log('[geminiService] Using procedural fallback generator.');
    const fallback = generateFallbackMystery(premise, difficulty);
    const schema = createMysteryZodSchema(difficulty);
    return schema.parse(fallback);
  }
}

module.exports = {
  generateMystery,
  DIFFICULTY_CONFIG,
  createMysteryZodSchema
};
