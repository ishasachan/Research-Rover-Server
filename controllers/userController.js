const User = require('../models/user');
const otpService = require('../services/otpService');
const { scrapeResearchPapers } = require('../services/webScraper');
const { sendEmail } = require('../services/emailService');

// Generate OTP and send it to the user's email
exports.generateOTP = async (req, res) => {
  try {
    const { name, email } = req.body;

    // Generate OTP
    const otp = otpService.generateOTP();

    // Create a new user or find an existing user
    let user = await User.findOne({ email });

    if (!user) {
      // Create a new user if not found
      user = new User({ name, email });
    }

    // Save the generated OTP to the user's document in the database
    user.otp = otp;
    await user.save();

    // Send OTP to the user's email
    await otpService.sendOTP(email, otp);

    res.json({ message: 'OTP sent successfully.' });
  } catch (error) {
    console.error('Error generating OTP:', error);
    res.status(500).json({ error: 'Failed to generate OTP.' });
  }
};

// Verify OTP and register the user
exports.registerUser = async (req, res) => {
  try {
    const { email, otp, name } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Check if the provided OTP matches the stored OTP
    if (otp !== user.otp) {
      return res.status(400).json({ error: 'Invalid OTP.' });
    }

    // Update the user's name and clear the OTP field
    user.name = name;
    user.otp = undefined;
    await user.save();

    res.json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Failed to register user.' });
  }
};



// Generate login OTP
exports.generateLoginOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Generate OTP
    const otp = otpService.generateOTP();

    // Create a new user or find an existing user
    let user = await User.findOne({ email });

    if (!user) {
      // Create a new user if not found
      user = new User({ email });
    }

    // Save the generated OTP to the user's document in the database
    user.otp = otp;
    await user.save();

    // Send OTP to the user's email
    await otpService.sendOTP(email, otp);

    res.json({ message: 'OTP sent successfully.' });
  } catch (error) {
    console.error('Error generating OTP:', error);
    res.status(500).json({ error: 'Failed to generate OTP.' });
  }
};


//Verify OTP and login user
exports.loginUser = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Check if the user exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the OTP matches
    if (user.otp !== otp) {
      return res.status(401).json({ message: 'Invalid OTP' });
    }

    // Clear the OTP after successful verification
    user.otp = undefined;
    await user.save();

    res.json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Error verifying OTP' });
  }
};



// Controller for updating user preferences
exports.updateUserPreferences = async (req, res) => {
  try {
    const { email, interests } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Check if the user has already updated their preferences
    if (user.interests.length > 0) {
      // User has already updated their preferences, send weekly email
      const lastEmailDate = user.lastEmailDate || user.registrationDate;
      const oneWeekAgo = new Date().setDate(new Date().getDate() - 7);

    // Iterate over the interests array and save the associated research papers
    for (const interest of interests) {
      const researchPapers = await scrapeResearchPapers(interest);
      const interestObject = {
        name: interest,
        researchPapers: researchPapers,
      };
      user.interests.push(interestObject);
    }

    await user.save();

    if (lastEmailDate > oneWeekAgo) {
      // It has not been a week since the last email, skip sending
      return res.json({ message: 'User preferences updated successfully. Weekly email skipped.' });
    }
  }

  // Iterate over the interests array and save the associated research papers
  for (const interest of interests) {
    const researchPapers = await scrapeResearchPapers(interest);
    const interestObject = {
      name: interest,
      researchPapers: researchPapers,
    };
    user.interests.push(interestObject);
  }

    // Compose and send the email
    const emailContent = `Dear ${user.name},\n\nYour preferences and associated research papers have been updated successfully. Here are your research papers:\n\n${user.interests.map(interest => {
      return `Interest: ${interest.name}\nResearch Papers:\n${interest.researchPapers.map(paper => `Title: ${paper.title}\nAuthors: ${paper.creators.join(', ')}\n\n`).join('')}`;
    }).join('\n')}`;

    await sendEmail(user.email, 'Preferences and Research Papers Updated', emailContent);

    await user.save();

    res.json({ message: 'User preferences updated successfully. Email sent.' });
  } catch (error) {
    console.error('Error updating user preferences:', error);
    res.status(500).json({ error: 'Failed to update user preferences.' });
  }
}



// Get user details by email
exports.getUserByEmail = async (req, res, next) => {
  try {
    const { email } = req.params;
    // Find the user by email with an increased timeout value
    const user = await User.findOne({ email }).maxTimeMS(30000);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ user });
  } catch (error) {
    return next(error);
  }
};


// Update the day and time for a user
exports.updateDayAndTime = async (req, res) => {
  try {
    const { email } = req.params;
    const { day, time } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Update day and time
    user.emailDay = day;
    user.emailTime = time;
    await user.save();

    res.json({ message: 'Day and time updated successfully.' });
  } catch (error) {
    console.error('Error updating day and time:', error);
    res.status(500).json({ error: 'Failed to update day and time.' });
  }
};