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

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  interests: [{
    name: {
      type: String,
      required: true,
    },
    researchPapers: [researchPaperSchema],
  }],
  otp: {
    type: String,
  },
  registrationDate: {
    type: Date,
    default: Date.now,
  },
  emailDay: {
    type: String,
    default: new Date().toLocaleDateString('en-US', { weekday: 'long' }),
  },
  emailTime: {
    type: String,
    default: new Date().toLocaleTimeString('en-US', { timeStyle: 'short' }),
  },
  lastEmailDate: {
    type: Date,
  },
});

module.exports = mongoose.model('User', userSchema);
