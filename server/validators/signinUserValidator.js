import isValidEmail from './../helpers/index';
/**
 * Validate user data for sign in
 */
export default class SignInUserValidator {
  /**
   * Initialize validator
   * @param {obj} user user details
   */
  constructor(user) {
    this.user = user;

    this.errors = [];
  }
  /**
   * Call validator methods and check if validation was successfull or not
   * @returns {bool} true or false
   */
  isValid() {
    this.validatePassword();
    this.validateEmail();

    if (this.errors.length > 0) {
      return false;
    }

    return true;
  }
  /**
   * Validate password
   * @returns {null} null
   */
  validatePassword() {
    if (!this.user.password) {
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
      }
    } else {
      this.errors.push('The email is required.');
    }
  }
}
