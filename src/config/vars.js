const path = require('path');

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpirationInterval: Number(process.env.JWT_EXPIRATION_MINUTES),
  SGKey: process.env.SENDGRID_KEY,
  emailSender: process.env.EMAIL_SENDER,
  bcryptSalt: process.env.BCRYPT_SALT,
  pageAccessToken: process.env.FB_ACCESS_TOKEN,
  pageId: process.env.FB_PAGE_ID,
  logs: process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
};
