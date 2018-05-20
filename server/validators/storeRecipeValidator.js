import { reWebUrl } from '../helpers/index';

/**
 * Validate the data for storing a new recipe
 */
export default class StoreRecipeValidator {
  /**
   * Initialize the data to be validated
   * @param {object} recipe the recipe to be validated
   */
  constructor(recipe) {
    this.recipe = recipe;
    this.errors = [];
  }


  /**
   * Validate the recipe
   * @returns {boolean} true or false
   */
  isValid() {
    if (this.recipe) {
      this.validateTitle();
      this.validateDescription();
      this.validateTimeToCook();
      this.validateImageUrl();
      this.validateIngredients();
      this.validateProcedure();
    } else {
      this.errors.push('No recipe was provided.');
    }

    if (this.errors.length > 0) {
      return false;
    }

    return true;
  }


  /**
   * Validate the name field of the request
   * It must be found in request, and it must not be an empty string
   * @returns {null} no return value
   */
  validateTitle() {
    if (this.recipe.title) {
      if (this.recipe.title.length < 5) {
        this.errors.push('The title must be longer than 5 characters.');
      }
    } else {
      this.errors.push('The title is required.');
    }
  }


  /**
   * Validate the name field of the request
   * It must be found in request, and it must
   * @returns {null} no return value
   */
  validateDescription() {
    if (this.recipe.description) {
      if (this.recipe.description.length < 5) {
        this.errors.push('The description must be longer than 5 characters.');
      }
    } else {
      this.errors.push('The description is required.');
    }
  }


  /**
   * Validate the time to cook field
   * @returns {null} null
   */
  validateTimeToCook() {
    if (this.recipe.timeToCook) {
      if (Number.isNaN(parseInt(this.recipe.timeToCook, 10))) {
        this.errors.push('The time to cook must be a number in minutes.');
      }
    } else {
      this.errors.push('The time to cook is required.');
    }
  }


  /**
   * Validate the ingredients field
   * @returns {null} no return
   */
  validateIngredients() {
    let { ingredients } = this.recipe;

    if (ingredients) {
      try {
        ingredients = JSON.parse(ingredients);
      } catch (error) {
        this.errors.push('The ingredients must be a json list of ingredients.');
        return;
      }

      if (!Array.isArray(ingredients)) {
        this.errors.push('There must be a list of ingredients.');
      }

      if (Array.isArray(ingredients)) {
        if (ingredients.length < 1) {
          this.errors.push('There must be at least one ingredient.');
        }
      }
    } else {
      this.errors.push('The ingredients are required.');
    }
  }

  /**
   * Validate user email
   * @returns {null} null
   */
  validateImageUrl() {
    if (this.recipe.imageUrl) {
      if (!reWebUrl.test(this.recipe.imageUrl)) {
        this.errors.push('The image url must be a valid web url.');
      }
    } else {
      this.errors.push('The image url is required.');
    }
  }


  /**
   * Validate the procedure field
   * @returns {null} no return
   */
  validateProcedure() {
    let { procedure } = this.recipe;

    if (procedure) {
      try {
        procedure = JSON.parse(procedure);
      } catch (error) {
        this.errors.push('The procedure must be a json of procedural steps.');
        return;
      }
      if (!Array.isArray(procedure)) {
        this.errors.push('There must be a list of procedure steps.');
      }

      if (Array.isArray(procedure)) {
        if (procedure.length < 1) {
          this.errors.push('There must be at least one procedure step.');
        }
      }
    } else {
      this.errors.push('The procedure is required.');
    }
  }
}
