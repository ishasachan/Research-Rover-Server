const schedulerService = require('../services/schedulerService');

// Controller for triggering the scheduler to send recommendation emails
exports.scheduleEmails = async (req, res) => {
  try {
    await schedulerService.scheduleEmails();
    res.json({ message: 'Emails scheduled successfully.' });
  } catch (error) {
    console.error('Error scheduling emails:', error);
    res.status(500).json({ error: 'Failed to schedule emails.' });
  }
};
