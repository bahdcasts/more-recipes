import models from '../database/models';
import client from '../helpers/redis-client';

/**
 * Express middleware to verify if request has jwt auth token
 * @param {object} req express request object
 * @param {object} res express response object
 * @param {function} next express middleware next() function
 * @returns {function} express next() function
 */
export default async (req, res, next) => {
  if (req.currentRecipe.userId === req.authUser.id) {
    return res.sendFailureResponse({ message: 'Unauthorized.' }, 401);
  }

  await client.srem(`recipe:${req.currentRecipe.id}:upvotes`, req.authUser.id);

  next();
};
