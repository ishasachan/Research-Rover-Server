const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/register', userController.generateOTP);
router.put('/register', userController.registerUser);
router.post('/login', userController.generateLoginOTP);
router.put('/login', userController.loginUser);
router.put('/preferences', userController.updateUserPreferences);
router.get('/:email', userController.getUserByEmail);
router.put('/preferences/:email', userController.updateDayAndTime);

module.exports = router;
