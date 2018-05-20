import models from '../database/models';
import client from '../helpers/redis-client';
import { updateRecipeAttributes } from '../helpers';

/**
 * Class VotesCorntroller to take care of all votes
 */
export default class VotesController {
  /**
   * Return all upvoters for a recipe
   * @param {object} req express request object
   * @param {object} res express response object
   *
   * @returns {array} array of users
   * @memberof VotesController
   */
  async getVoters(req, res) {
    const recipe = await models.Recipe.findById(req.params.id);

    if (!recipe) {
      return res.sendFailureResponse({ message: 'Recipe not found.' });
    }

    const upvotersUserIds = await client.smembers(`recipe:${recipe.id}:upvotes`);
    const downvotersUserIds = await client.smembers(`recipe:${recipe.id}:downvotes`);

    const upvoters = await models.User.findAll({
      where: {
        id: {
          [models.Sequelize.Op.in]: upvotersUserIds
        }
      }
    });

    const downvoters = await models.User.findAll({
      where: {
        id: {
          [models.Sequelize.Op.in]: downvotersUserIds
        }
      }
    });

    return res.sendSuccessResponse({ upvoters, downvoters });
  }


  /**
   * Upvote a recipe
   * @param {object} req express request object
   * @param {object} res express response object
   *
   * @returns {array} json
   * @memberof RecipesController
   */
  async upvote(req, res) {
    const recipe = await updateRecipeAttributes(req.currentRecipe);

    if (recipe.upvotersIds.findIndex(user => user === req.authUser.id) !== -1) {
      await client.srem(`recipe:${recipe.id}:upvotes`, req.authUser.id);
      return res.sendSuccessResponse({ message: 'Recipe upvote removed successfully.' });
    }

    await client.sadd(`recipe:${recipe.id}:upvotes`, req.authUser.id);
    return res.sendSuccessResponse({ message: 'Recipe upvoted successfully.' });
  }

  /**
   * Upvote a recipe
   * @param {object} req express request object
   * @param {object} res express response object
   *
   * @returns {object} successful message
   * @memberof RecipesController
   */
  async downvote(req, res) {
    const recipe = await updateRecipeAttributes(req.currentRecipe);

    if (recipe.downvotersIds.findIndex(user => user === req.authUser.id) !== -1) {
      await client.srem(`recipe:${recipe.id}:downvotes`, req.authUser.id);
      return res.sendSuccessResponse({ message: 'Recipe downvote removed successfully.' });
    }

    await client.sadd(`recipe:${recipe.id}:downvotes`, req.authUser.id);
    return res.sendSuccessResponse({ message: 'Recipe downvoted successfully.' });
  }
}
