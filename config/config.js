const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  port: process.env.PORT || 3000,
  mongoURI: process.env.MONGO_URI || 'mongodb+srv://Abhi6722:Abhi6722@researchrover.ckwzho3.mongodb.net/?retryWrites=true&w=majority',
  smtpHost: process.env.SMTP_HOST || 'smtp.hostinger.com',
  smtpPort: process.env.SMTP_PORT || 465,
  smtpUser: process.env.SMTP_USER || 'hackshark@heistat49.com',
  smtpPassword: process.env.SMTP_PASSWORD || 'Hack@shark11',
};
