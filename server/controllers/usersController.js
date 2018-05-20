import models from '../database/models';
import client from '../helpers/redis-client';
import { updateRecipeAttributes, updateUserAttributes, updateUserSettings } from '../helpers';
/**
 * Controller for all `users` endpoints
 * @export
 * @class UsersController
 */
export default class UsersController {
  /**
   * Favorite a recipe
   * @param {object} req express request object
   * @param {object} res express response object
   *
   * @returns {object} Confirmation message of favorite action
   * @memberof RecipesController
   */
  async favorite(req, res) {
    const recipe = await updateRecipeAttributes(req.currentRecipe);

    if (recipe.favoritersIds.findIndex(user => user === req.authUser.id) !== -1) {
      await client.srem(`user:${req.authUser.id}:favorites`, recipe.id);
      await client.srem(`recipe:${recipe.id}:favorites`, req.authUser.id);

      return res.sendSuccessResponse({ message: 'Recipe removed from favorites.' });
    }

    await client.sadd(`user:${req.authUser.id}:favorites`, recipe.id);
    await client.sadd(`recipe:${recipe.id}:favorites`, req.authUser.id);
    return res.sendSuccessResponse({ message: 'Recipe favorited.' });
  }


  /**
   * Get all the user favorite recipes
   * @param {object} req express request object
   * @param {object} res express response object
   *
   * @returns {json} object of favorite recipes
   * @memberof RecipesController
   */
  async getFavorites(req, res) {
    const favoritesIds = await client.smembers(`user:${req.authUser.id}:favorites`);

    const favorites = await models.Recipe.findAll({
      where: {
        id: {
          [models.Sequelize.Op.in]: favoritesIds
        }
      },
      include: {
        model: models.User,
        attributes: { exclude: ['password'] }
      }
    });

    favorites.map(async (favorite) => {
      const updatedRecipe = await updateRecipeAttributes(favorite);
      return updatedRecipe;
    });

    return res.sendSuccessResponse({ favorites });
  }
  /**
   * Find a user with user Id
   *
   * @param {any} req express request object
   * @param {any} res express response object
   *
   * @returns {json} user
   * @memberof UsersController
   */
  async getUser(req, res) {
    const user = await models.User.findById(req.params.id);

    if (!user) {
      return res.sendFailureResponse({ message: 'User not found.' }, 404);
    }
    const updatedUser = await updateUserAttributes(user, models);
    return res.sendSuccessResponse({ user: updatedUser });
  }
  /**
   * Update authenticated user profile
   *
   * @param {object} req express request object
   * @param {object} res express response object
   *
   * @returns {json} user
   * @memberof UsersController
   */
  async updateProfile(req, res) {
    const { name, about, settings } = req.body;
    if (settings) {
      await updateUserSettings(req.authUserObj, settings);
    }
    const user = await req.authUserObj.update({
      name, about
    });
    const updatedUser = await updateUserAttributes(user, models);
    return res.sendSuccessResponse({ user: updatedUser });
  }
  /**
   * Get all the recipes for a user
   *
   * @param {object} req express request object
   * @param {object} res express response object
   *
   * @returns {json} json[Recipe]
   * @memberof UsersController
   */
  async getRecipes(req, res) {
    try {
      const user = await models.User.findById(req.params.id);

      if (!user) {
        return res.sendFailureResponse({ message: 'User not found.' }, 404);
      }

      const recipes = await user.getRecipes({
        include: { model: models.User, attributes: { exclude: ['password'] } }
      });

      return res.sendSuccessResponse({ user, recipes });
    } catch (error) {
      return res.sendFailureResponse({ message: 'User not found.' }, 404);
    }
  }
}
