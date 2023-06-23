const User = require('../models/user');
const otpService = require('../services/otpService');
const { scrapeResearchPapers } = require('../services/webScraper');
const { sendEmail, generateEmailContent } = require('../services/scheduler');


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
    // Find an existing user
    let user = await User.findOne({ email });
    if (!user) {
      // Create a new user if not found
      console.error('User does not exist!', error);
      res.status(404).json({ error: 'User does not exist.' });
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
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Check if it has been more than 7 days since the last email was sent
    const lastEmailSent = new Date(user.lastEmailDate);
    const today = new Date();
    const daysSinceLastEmail = Math.floor((today - lastEmailSent) / (1000 * 60 * 60 * 24));

    if (daysSinceLastEmail < 7) {
      // Update the preferences without sending an email
      user.interests = [];
      for (const interest of interests) {
        const researchPapers = await scrapeResearchPapers(interest);
        const interestObject = {
          name: interest,
          researchPapers: researchPapers,
        };
        user.interests.push(interestObject);
      }

      user = await user.save();

      return res.json({ message: 'User preferences updated successfully. Email not sent.', user });
    }

    // Update the preferences and send the email
    user.interests = [];
    for (const interest of interests) {
      const researchPapers = await scrapeResearchPapers(interest);
      const interestObject = {
        name: interest,
        researchPapers: researchPapers,
      };
      user.interests.push(interestObject);
    }

    user.lastEmailDate = today; // Update the lastEmailDate field
    user = await user.save();

    // Send email to the user
    const emailContent = generateEmailContent(user.name, user.interests);

    // Send the email
    await sendEmail(email, 'Weekly Research Paper Recommendations', emailContent);

    res.json({ message: 'User preferences updated successfully. Email sent.', user });
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