const nodemailer = require('nodemailer');
const config = require('../config/config');


// Function to send an email
exports.sendEmail = async (recipient, subject, message) => {
  try {
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
    const emailOptions = {
      from: config.smtpUser,
      to: recipient,
      subject: subject,
      text: message,
    };

    // Send the email
    await transporter.sendMail(emailOptions);

    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email.');
  }
};

// Send OTP to user's email
exports.sendOTP = async (email, otp) => {
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
      subject: 'OTP for Registration',
      text: `Your OTP is: ${otp}`,
    };

    await transporter.sendMail(message);
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Failed to send OTP email.');
  }
};


// Function to send recommendation email
exports.sendRecommendationEmail = async (email, papers) => {
  try {
    // Create a nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.hostinger.com',
      port: 465,
      auth: {
        user: 'hackshark@heistat49.com',
        pass: 'Hack@shark11',
      },
    });

    // Compose the email message
    const message = {
      from: 'hackshark@heistat49.com',
      to: email,
      subject: 'Weekly Research Paper Recommendations',
      html: `
        <h1>Recommended Research Papers:</h1>
        <ul>
          ${papers.map((paper) => `<li>${paper.title}</li>`).join('')}
        </ul>
      `,
    };

    // Send the email
    await transporter.sendMail(message);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email.');
  }
};
