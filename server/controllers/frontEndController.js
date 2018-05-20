import models from '../database/models';
import filterMostFavoritedRecipes from './../filters/mostFavorited';
/**
 * Controller to handle the personal requests of the frontend
 *
 * @export
 * @class FrontEndController
 */
export default class FrontEndController {
  /**
   * Return data needed by the home page
   *
   * @param {object} req express request object
   * @param {object} res express response object
   *
   * @returns {object} json
   * @memberof FrontEndController
   */
  async home(req, res) {
    const recipesMeta = await filterMostFavoritedRecipes(1, 3);
    const mostFavoritedRecipes = recipesMeta.rows;
    // Get the latest recipes begin
    const latestRecipes = await models.Recipe.findAll({
      limit: 6,
      order: [['createdAt', 'DESC']],
      include: {
        model: models.User,
        attributes: { exclude: ['password'] }
      }
    });

    // Get the latest recipes end


    return res.sendSuccessResponse({
      mostFavoritedRecipes,
      latestRecipes
    });
  }
}
