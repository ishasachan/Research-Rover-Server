const User = require('../models/user');
const nodemailer = require('nodemailer');
const config = require('../config/config');

// Function to check the last email date and send an email if it's been more than a week
async function sendWeeklyEmails() {
  try {
    const users = await User.find();
    const currentDate = new Date();

    for (const user of users) {
      const { name, email, emailDay, emailTime, interests, lastEmailDate } = user;

      console.log(`Checking email schedule for user: ${email}`);
      console.log(`Email Day: ${emailDay}`);
      console.log(`Email Time: ${emailTime}`);
      console.log(`Last Email Date: ${lastEmailDate}`);
      console.log(`Current Time: ${currentDate}`);

      if (lastEmailDate instanceof Date) {
        // Calculate the time difference in milliseconds between the last email date and the current date
        const timeDiff = currentDate.getTime() - lastEmailDate.getTime();
        const daysDiff = timeDiff / (1000 * 60 * 60 * 24);

        console.log(`Days since last email: ${daysDiff}`);

        // Check if it's been more than a week since the last email
        if (daysDiff >= 7) {
          console.log(`Sending weekly email to ${name} (${email})`);

          // Generate the email content
          const emailContent = generateEmailContent(interests);

          // Send the email
          await sendEmail(email, 'Weekly Research Paper Recommendations', emailContent);

          // Update the last email date to the current date
          user.lastEmailDate = new Date();
          await user.save();

          console.log(`Email sent to ${name} (${email})`);
        } else {
          console.log(`Not sending email to ${name} (${email}). Last email sent less than a week ago.`);
        }
      } else {
        console.log(`Not sending email to ${name} (${email}). Invalid last email date.`);
      }
    }
  } catch (error) {
    console.error('Error sending weekly emails:', error);
  }
}

// Function to generate the email content
function generateEmailContent(interests) {
  let emailContent = '';

  interests.forEach((interest) => {
    emailContent += `
      <div style="margin-bottom: 20px;">
        <h2 style="font-size: 20px; margin-bottom: 10px;">${interest.name}</h2>
    `;

    interest.researchPapers.forEach((paper) => {
      emailContent += `
        <div style="border: 1px solid #ddd; padding: 10px; margin-bottom: 10px;">
          <p style="font-weight: bold; margin-bottom: 5px;">Title: ${paper.title}</p>
          <p style="margin-bottom: 5px;">Authors: ${paper.creators.join(', ')}</p>
          <p style="margin-bottom: 5px;">HTML URL: <a href="${paper.htmlUrl}">${paper.htmlUrl}</a></p>
          <p style="margin-bottom: 5px;">PDF URL: <a href="${paper.pdfUrl}">${paper.pdfUrl}</a></p>
        </div>
      `;
    });

    emailContent += '</div>';
  });

  return emailContent;
}

// Function to send an email
async function sendEmail(recipient, subject, content) {
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
      to: recipient,
      subject: subject,
      html: content,
    };

    await transporter.sendMail(message);
  } catch (error) {
    throw new Error('Error sending email:', error);
  }
}

// Call the sendWeeklyEmails function every 10 seconds
// setInterval(sendWeeklyEmails, 3600000);
setInterval(sendWeeklyEmails, 60000);

module.exports = { sendWeeklyEmails };
