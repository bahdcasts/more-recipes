import kue from 'kue';

import redisConfig from '../config/redis';
import models from '../database/models';


/**
 * Controller to handle all reviews for recipes
 * @export ReviewsController
 * @class ReviewsController
 */
export default class ReviewsController {
  /**
   * Get all reviews for a recipe
   * @param {object} req express request object
   * @param {object} res express response object
   *
   * @returns {array} array of recipes
   * @memberof ReviewsController
   */
  async index(req, res) {
    const recipe = req.currentRecipe;

    const reviews = await recipe.getReviews({
      include: { model: models.User, attributes: { exclude: ['password'] } }
    });

    return res.sendSuccessResponse({ reviews });
  }


  /**
   * Store a new review to the database
   * @param {object} req express request object
   * @param {object} res express response object
   *
   * @returns {object} json of newly saved review
   * @memberof ReviewsController
   */
  async create(req, res) {
    const { currentRecipe, authUser } = req;
    const user = currentRecipe.User;

    const createdReview = await models.Review.create({
      review: req.body.review,
      recipeId: currentRecipe.id,
      userId: authUser.id
    });

    const review = await models.Review.findById(createdReview.id, {
      include: { model: models.User, exclude: ['password'] }
    });

    const recipeCreatorSettings = JSON.parse(user.settings);
    if (recipeCreatorSettings.reviewEmails === Number(1)) {
      // queue an email to the recipe creator for sending later
      const queue = kue.createQueue(process.env.NODE_ENV === 'production' ? redisConfig.production : { redis: redisConfig[process.env.NODE_ENV] });

      //  Register a new mails job to the queue
      queue.create('mails', {
        recipient: user,
        message: {
          subject: `${authUser.name} commented on your recipe.`
        },
        template: {
          pug: 'welcome',
          locals: {
            name: user.name,
            reviewer: authUser.name,
            review: review.review,
            recipe: currentRecipe,
            recipeTitle: currentRecipe.title,
            link: `https://bahdcoder-more-recipes.herokuapp.com/recipe/${currentRecipe.id}`
          }
        }
      }).events(false).save();
    }

    return res.sendSuccessResponse({ review });
  }
}
