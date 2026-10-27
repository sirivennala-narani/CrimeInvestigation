const express = require('express');
const router = express.Router();
const caseController = require('../controllers/caseController');

// 15.1 Create Mystery
router.post('/', caseController.createCase);

// 15.2 Retrieve Case state
router.get('/:id', caseController.getCase);

// 15.3 Discover Clue
router.post('/:id/clues/:clueId/discover', caseController.discoverClue);

// 15.4 Request Hint
router.post('/:id/hints', caseController.requestHint);

// 15.5 Submit Accusation
router.post('/:id/accuse', caseController.submitAccusation);

// 15.6 Retrieve Result
router.get('/:id/result', caseController.getResult);

module.exports = router;
