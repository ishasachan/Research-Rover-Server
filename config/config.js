const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  port: process.env.PORT || 3000,
  apiKey: process.env.APIKEY || '0e24da79400db9440672437232a4be88',
  mongoURI: process.env.MONGO_URI || 'mongodb+srv://Abhi6722:Abhi6722@researchrover.ckwzho3.mongodb.net/?retryWrites=true&w=majority',
  smtpHost: process.env.SMTP_HOST || 'smtp.hostinger.com',
  smtpPort: process.env.SMTP_PORT || 465,
  smtpUser: process.env.SMTP_USER || 'researchrover@brandlime.in',
  smtpPassword: process.env.SMTP_PASSWORD || 'Research@11',
};
