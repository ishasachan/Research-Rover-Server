const mongoose = require('mongoose');
const ResearchPaper = require('./researchPaper');

const interestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  researchPapers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ResearchPaper',
  }],
});

module.exports = mongoose.model('Interest', interestSchema);
