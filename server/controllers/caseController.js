const { z } = require('zod');
const Case = require('../models/Case');
const { generateMystery, DIFFICULTY_CONFIG } = require('../services/geminiService');

// Zod schemas for request validation (Section 16)
const createCaseSchema = z.object({
  premise: z.string({
    required_error: 'Mystery premise is required'
  }).min(5, 'Premise must be at least 5 characters').max(500, 'Premise must not exceed 500 characters'),
  difficulty: z.enum(['easy', 'medium', 'hard'], {
    required_error: 'Difficulty level must be easy, medium, or hard'
  })
});

const accuseSchema = z.object({
  suspectId: z.string({
    required_error: 'suspectId is required'
  }).min(1, 'suspectId must not be empty')
});

/**
 * Helper: compute current score based on discovered clues, hints used, and optional base score
 */
function computeScore(difficulty, discoveredCount, hintsUsed, isCorrect = false) {
  const config = DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.easy;
  const baseScore = isCorrect ? config.baseScore : 0;
  const cluePoints = discoveredCount * 5;
  const hintDeductions = hintsUsed * 10;
  return Math.max(0, baseScore + cluePoints - hintDeductions);
}

/**
 * 15.1 POST /api/cases - Generate a new mystery case
 */
exports.createCase = async (req, res, next) => {
  try {
    const parseResult = createCaseSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: parseResult.error.errors[0]?.message || 'Invalid request data.',
        errors: parseResult.error.errors
      });
    }

    const { premise, difficulty } = parseResult.data;

    // Generate mystery via Gemini API (with Zod verification inside service)
    const generated = await generateMystery(premise, difficulty);

    // Save to MongoDB (Case Model)
    const newCase = new Case({
      title: generated.title,
      premise,
      story: generated.story,
      difficulty,
      suspects: generated.suspects,
      clues: generated.clues.map(c => ({ id: c.id, text: c.text, discovered: false })),
      hints: generated.hints,
      culprit: generated.culprit,
      solution: generated.solution,
      discoveredClues: [],
      hintsUsed: 0,
      accusation: null,
      score: 0,
      completed: false
    });

    await newCase.save();

    const config = DIFFICULTY_CONFIG[difficulty];

    // Return safe data without exposing culprit or solution (Section 15.1 & 19)
    return res.status(201).json({
      success: true,
      caseId: newCase._id,
      case: {
        id: newCase._id,
        title: newCase.title,
        story: newCase.story,
        difficulty: newCase.difficulty,
        suspects: newCase.suspects,
        clues: newCase.clues.map(c => ({
          id: c.id,
          text: null, // Hidden until discovered
          discovered: false
        })),
        hintsRemaining: config.hints,
        score: 0
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 15.2 GET /api/cases/:id - Retrieve case state for investigation
 */
exports.getCase = async (req, res, next) => {
  try {
    const { id } = req.params;
    const mysteryCase = await Case.findById(id);

    if (!mysteryCase) {
      return res.status(404).json({
        success: false,
        message: 'Mystery case not found.'
      });
    }

    const config = DIFFICULTY_CONFIG[mysteryCase.difficulty] || DIFFICULTY_CONFIG.easy;
    const hintsRemaining = Math.max(0, config.hints - mysteryCase.hintsUsed);

    // Filter clue texts: only show text if discovered (Section 15.2)
    const safeClues = mysteryCase.clues.map(c => {
      const isDiscovered = mysteryCase.discoveredClues.includes(c.id);
      return {
        id: c.id,
        discovered: isDiscovered,
        text: isDiscovered ? c.text : null
      };
    });

    // Hints revealed so far
    const revealedHints = mysteryCase.hints.slice(0, mysteryCase.hintsUsed);

    return res.status(200).json({
      success: true,
      case: {
        id: mysteryCase._id,
        title: mysteryCase.title,
        premise: mysteryCase.premise,
        story: mysteryCase.story,
        difficulty: mysteryCase.difficulty,
        suspects: mysteryCase.suspects,
        clues: safeClues,
        hintsRemaining,
        hintsUsed: mysteryCase.hintsUsed,
        revealedHints,
        score: mysteryCase.score,
        completed: mysteryCase.completed
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 15.3 POST /api/cases/:id/clues/:clueId/discover - Discover a clue
 */
exports.discoverClue = async (req, res, next) => {
  try {
    const { id, clueId } = req.params;
    const mysteryCase = await Case.findById(id);

    if (!mysteryCase) {
      return res.status(404).json({
        success: false,
        message: 'Mystery case not found.'
      });
    }

    if (mysteryCase.completed) {
      return res.status(400).json({
        success: false,
        message: 'Case is already closed.'
      });
    }

    const clue = mysteryCase.clues.find(c => c.id === clueId);
    if (!clue) {
      return res.status(404).json({
        success: false,
        message: 'Clue not found in this case.'
      });
    }

    // Only award points if not already discovered
    if (!mysteryCase.discoveredClues.includes(clueId)) {
      mysteryCase.discoveredClues.push(clueId);
      clue.discovered = true;
      mysteryCase.score = computeScore(
        mysteryCase.difficulty,
        mysteryCase.discoveredClues.length,
        mysteryCase.hintsUsed,
        false
      );
      await mysteryCase.save();
    }

    return res.status(200).json({
      success: true,
      clue: {
        id: clue.id,
        text: clue.text
      },
      score: mysteryCase.score
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 15.4 POST /api/cases/:id/hints - Request a hint
 */
exports.requestHint = async (req, res, next) => {
  try {
    const { id } = req.params;
    const mysteryCase = await Case.findById(id);

    if (!mysteryCase) {
      return res.status(404).json({
        success: false,
        message: 'Mystery case not found.'
      });
    }

    if (mysteryCase.completed) {
      return res.status(400).json({
        success: false,
        message: 'Case is already closed.'
      });
    }

    const config = DIFFICULTY_CONFIG[mysteryCase.difficulty] || DIFFICULTY_CONFIG.easy;
    if (mysteryCase.hintsUsed >= config.hints || mysteryCase.hintsUsed >= mysteryCase.hints.length) {
      return res.status(400).json({
        success: false,
        message: 'No hints remaining.'
      });
    }

    const hintText = mysteryCase.hints[mysteryCase.hintsUsed];
    mysteryCase.hintsUsed += 1;
    mysteryCase.score = computeScore(
      mysteryCase.difficulty,
      mysteryCase.discoveredClues.length,
      mysteryCase.hintsUsed,
      false
    );

    await mysteryCase.save();

    const hintsRemaining = Math.max(0, config.hints - mysteryCase.hintsUsed);

    return res.status(200).json({
      success: true,
      hint: hintText,
      hintsRemaining,
      score: mysteryCase.score
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 15.5 POST /api/cases/:id/accuse - Submit an accusation
 */
exports.submitAccusation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const parseResult = accuseSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: parseResult.error.errors[0]?.message || 'Invalid accusation request.',
        errors: parseResult.error.errors
      });
    }

    const { suspectId } = parseResult.data;
    const mysteryCase = await Case.findById(id);

    if (!mysteryCase) {
      return res.status(404).json({
        success: false,
        message: 'Mystery case not found.'
      });
    }

    if (mysteryCase.completed) {
      return res.status(400).json({
        success: false,
        message: 'An accusation has already been made for this case.'
      });
    }

    // Verify suspect exists in this case
    const suspectExists = mysteryCase.suspects.some(s => s.id === suspectId);
    if (!suspectExists) {
      return res.status(400).json({
        success: false,
        message: 'Specified suspect does not belong to this mystery.'
      });
    }

    // Backend validates whether suspectId matches culprit (Section 15.5 & 23)
    const culpritSuspect = mysteryCase.suspects.find(
      s => s.id === mysteryCase.culprit || s.name.toLowerCase() === String(mysteryCase.culprit).toLowerCase()
    );
    const accusedSuspect = mysteryCase.suspects.find(
      s => s.id === suspectId || s.name.toLowerCase() === String(suspectId).toLowerCase()
    );

    const isCorrect = 
      mysteryCase.culprit === suspectId || 
      (culpritSuspect && culpritSuspect.id === suspectId) ||
      (culpritSuspect && accusedSuspect && culpritSuspect.id === accusedSuspect.id);

    // Calculate final score
    const finalScore = computeScore(
      mysteryCase.difficulty,
      mysteryCase.discoveredClues.length,
      mysteryCase.hintsUsed,
      isCorrect
    );

    mysteryCase.accusation = suspectId;
    mysteryCase.score = finalScore;
    mysteryCase.completed = true;

    await mysteryCase.save();

    return res.status(200).json({
      success: true,
      correct: isCorrect,
      score: finalScore
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 15.6 GET /api/cases/:id/result - Retrieve full case results after accusation
 */
exports.getResult = async (req, res, next) => {
  try {
    const { id } = req.params;
    const mysteryCase = await Case.findById(id);

    if (!mysteryCase) {
      return res.status(404).json({
        success: false,
        message: 'Mystery case not found.'
      });
    }

    // Sensitive info is only revealed after completion (Section 15.6 & 19)
    if (!mysteryCase.completed) {
      return res.status(400).json({
        success: false,
        message: 'Case is still under active investigation. Accuse a suspect to see the verdict.'
      });
    }

    const accusedSuspect = mysteryCase.suspects.find(
      s => s.id === mysteryCase.accusation || s.name.toLowerCase() === String(mysteryCase.accusation).toLowerCase()
    );
    const culpritSuspect = mysteryCase.suspects.find(
      s => s.id === mysteryCase.culprit || s.name.toLowerCase() === String(mysteryCase.culprit).toLowerCase()
    );
    const isCorrect = 
      mysteryCase.culprit === mysteryCase.accusation ||
      (culpritSuspect && accusedSuspect && culpritSuspect.id === accusedSuspect.id);

    return res.status(200).json({
      success: true,
      result: {
        caseId: mysteryCase._id,
        title: mysteryCase.title,
        premise: mysteryCase.premise,
        difficulty: mysteryCase.difficulty,
        accusation: accusedSuspect ? accusedSuspect.name : mysteryCase.accusation,
        accusationId: mysteryCase.accusation,
        culprit: culpritSuspect ? culpritSuspect.name : mysteryCase.culprit,
        culpritId: mysteryCase.culprit,
        correct: isCorrect,
        score: mysteryCase.score,
        explanation: mysteryCase.solution,
        discoveredCluesCount: mysteryCase.discoveredClues.length,
        totalClues: mysteryCase.clues.length,
        hintsUsed: mysteryCase.hintsUsed
      }
    });
  } catch (error) {
    next(error);
  }
};
