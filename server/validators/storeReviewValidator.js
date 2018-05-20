
/**
 * Validate storing a review into database
 * @export
 * @class StoreReviewValidator
 */
export default class StoreReviewValidator {
  /**
   * Creates an instance of StoreReviewValidator.
   * @param {any} review review from request
   * @memberof StoreReviewValidator
   */
  constructor(review) {
    this.review = review;

    this.errors = [];
  }


  /**
   * Check if request data is valid
   * @returns {boolean} true or false
   * @memberof StoreReviewValidator
   */
  isValid() {
    this.validateReview();

    if (this.errors.length > 0) {
      return false;
    }

    return true;
  }


  /**
   * Validate the review from request
   * @memberof StoreReviewValidator
   * @returns {null} null
   */
  validateReview() {
    if (this.review) {
      if (this.review.length < 5) {
        this.errors.push('The review must be longer than 5 characters.');
      }
    } else {
      this.errors.push('The review is required.');
    }
  }
}
