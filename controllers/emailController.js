const nodemailer = require('nodemailer');
const config = require('../config/config');
const ResearchPaper = require('../models/researchPaper');

// Controller for sending emails
exports.sendEmailController = async (req, res, next) => {
  try {
    const { recipient, subject, message } = req.body;

    await sendEmail(recipient, subject, message);

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    next(error);
  }
};

// Controller for sending recommendation emails
exports.sendRecommendationEmail = async (email, interests) => {
  try {
    // Fetch the research papers based on the user's interests
    const researchPapers = await ResearchPaper.find({ interest: { $in: interests } });

    // Create a nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: config.smtpHost,
      port: config.smtpPort,
      auth: {
        user: config.smtpUser,
        pass: config.smtpPassword,
      },
    });

    // Compose the email message
    const message = {
      from: config.smtpUser,
      to: email,
      subject: 'Weekly Research Paper Recommendations',
      html: generateEmailContent(interests, researchPapers),
    };

    // Send the email
    await transporter.sendMail(message);
  } catch (error) {
    console.error('Error sending recommendation email:', error);
  }
};

// Generate the HTML content for the email
function generateEmailContent(interests, researchPapers) {
  let content = '';

  interests.forEach((interest) => {
    content += `<h2>${interest.name}</h2>`;
    const papers = researchPapers.filter((paper) => paper.interest.toString() === interest._id.toString());

    if (papers.length > 0) {
      content += '<ul>';
      papers.forEach((paper) => {
        content += `<li>Title: ${paper.title}</li>`;
        content += `<li>Authors: ${paper.creators.join(', ')}</li>`;
        content += `<li>HTML URL: <a href="${paper.htmlUrl}">${paper.htmlUrl}</a></li>`;
        content += `<li>PDF URL: <a href="${paper.pdfUrl}">${paper.pdfUrl}</a></li>`;
        content += '<br>';
      });
      content += '</ul>';
    } else {
      content += '<p>No research papers available.</p>';
    }
  });

  return content;
}
