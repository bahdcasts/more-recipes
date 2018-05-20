require('dotenv').config();

let jwtSecret = process.env.JWT_SECRET;

if (process.env.NODE_ENV === 'test') {
  jwtSecret = 'secret';
}

/**
 * Application wide configurations
 */
module.exports = {
  JWT_SECRET: jwtSecret,
  MAILER: {
    SERVICE: process.env.MAILER_SERVICE,
    USER: process.env.MAILER_USER,
    PASS: process.env.MAILER_PASS,
    HOST: process.env.MAILER_HOST,
    PORT: process.env.MAILER_PORT
  },
  VALID_USER_SETTINGS: ['reviewEmails', 'favoriteModifiedEmail']
};
