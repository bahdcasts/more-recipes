require('dotenv').config();
/**
 * The different redis database configurations for different environments.
 */
const config = {
  development: {
    port: 6379,
    host: '127.0.0.1',
    auth: '',
    db: 1
  },
  test: {
    dialect: 'sqlite',
    storage: 'database.sqlite',
    logging: false
  },
  production: {
    redis: process.env.REDIS_URL
  }
};

module.exports = config;
