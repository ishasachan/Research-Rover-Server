const mongoose = require('mongoose');

const researchPaperSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  htmlUrl: {
    type: String,
    required: true,
  },
  pdfUrl: {
    type: String,
    required: true,
  },
  creators: {
    type: [String],
    required: true,
  },
  contentType: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('ResearchPaper', researchPaperSchema);
