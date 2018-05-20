import models from '../database/models';

/**
 * Express middleware to verify if request has a valid recipe
 * @param {object} req express request object
 * @param {object} res express response object
 * @param {function} next express middleware next() function
 * @returns {function} express next() function
 */
export default async (req, res, next) => {
  try {
    const recipe = await models.Recipe.findById(req.params.recipeId || req.params.id, {
      include: {
        model: models.User,
        attributes: { exclude: ['password'] }
      }
    });

    if (!recipe) {
      return res.sendFailureResponse({ message: 'Recipe not found.' }, 404);
    }

    req.currentRecipe = recipe;
    next();
  } catch (error) {
    return res.sendFailureResponse({ message: 'Recipe not found.' }, 404);
  }
};
