const nodemailer = require('nodemailer');
const config = require('../config/config');
const User = require('../models/user');
const ResearchPaper = require('../models/researchPaper');

// Function to send recommendation email
const sendEmail = async (email, papers) => {
  try {
    const transporter = nodemailer.createTransport({
      host: config.smtpHost,
      port: config.smtpPort,
      auth: {
        user: config.smtpUser,
        pass: config.smtpPassword,
      },
    });

    const message = {
      from: config.smtpUser,
      to: email,
      subject: 'Weekly Research Paper Recommendations',
      html: `
        <h1>Recommended Research Papers:</h1>
        <ul>
          ${papers.map((paper) => `<li>${paper.title}</li>`).join('')}
        </ul>
      `,
    };

    await transporter.sendMail(message);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email.');
  }
};

// Function to schedule recommendation emails
exports.scheduleEmails = async () => {
  try {
    // Get all users
    const users = await User.find();

    // Loop through each user
    for (const user of users) {
      const { interests } = user;

      // Get research papers based on user interests
      const papers = await ResearchPaper.find({ interests }).limit(10);

      // Send recommendation email to the user
      await sendEmail(user.email, papers);
    }
  } catch (error) {
    console.error('Error scheduling emails:', error);
    throw new Error('Failed to schedule emails.');
  }
};
