const express = require('express');
const userRoutes = require('./userRoutes');
const researchPaperRoutes = require('./researchPaperRoutes');
const emailRoutes = require('./emailRoutes');

const router = express.Router();

router.use('/users', userRoutes);
router.use('/research-papers', researchPaperRoutes);
router.use('/emails', emailRoutes);

module.exports = router;
