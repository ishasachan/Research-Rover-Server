const express = require('express');
const emailController = require('../controllers/emailController');

const router = express.Router();

router.post('/recommendation', emailController.sendRecommendationEmail);
router.post('/send', emailController.sendEmailController);

module.exports = router;
