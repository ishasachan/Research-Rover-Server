const express = require('express');
const researchPaperController = require('../controllers/researchPaperController');

const router = express.Router();

router.get('/', researchPaperController.getResearchPapers);
router.post('/', researchPaperController.postResearchPapers);

module.exports = router;
