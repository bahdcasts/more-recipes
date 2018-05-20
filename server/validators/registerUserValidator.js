import models from '../database/models';
import isValidEmail from './../helpers/index';


/**
 * Validate request for registering a new user
 */
export default class RegisterUserValidator {
  /**
   * Initialize validator
   * @param {object} user user data to validate
   */
  constructor(user) {
    this.user = user;

    this.errors = [];
  }


  /**
   * Call validations, and check if it passed or not
   * @returns {bool} validation passed or failed
   */
  async isValid() {
    this.validateName();
    this.validatePassword();
    await this.validateEmail();

    if (this.errors.length > 0) {
      return false;
    }
    return true;
  }


  /**
   * Validate the user's name
   * @returns {null} null
   */
  validateName() {
    if (this.user.name) {
      if (this.user.name.length < 5) {
        this.errors.push('The name must be longer than 5 characters.');
      }
    } else {
      this.errors.push('The name is required.');
    }
  }


  /**
   * Validate password
   * @returns {null} null
   */
  validatePassword() {
    if (this.user.password) {
      if (this.user.password.length < 6) {
        this.errors.push('The password must be longer than 5 characters.');
      }
    } else {
      this.errors.push('The password is required.');
    }
  }


  /**
   * Validate user email
   * @returns {null} null
   */
  async validateEmail() {
    if (this.user.email) {
      if (!isValidEmail(this.user.email)) {
        this.errors.push('The email must be a valid email address.');
      } else {
        const user = await models.User.findOne({ where: { email: this.user.email } });
        if (user) {
          this.errors.push('A user with this email already exists.');
        }
      }
    } else {
      this.errors.push('The email is required.');
    }
  }
}
