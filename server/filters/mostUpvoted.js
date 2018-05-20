import models from './../database/models';
import client from './../helpers/redis-client';

const filterMostUpvotedRecipes = async (page, perPage) => {
  const recipeUpvotesIds = await client.keys('recipe:*:upvotes');

  client.multi();
  recipeUpvotesIds.forEach(id => client.smembers(id));

  const recipeUpvotesIdsValues = await client.exec();
  const recipeUpvotesIdsObject = {};

  for (let index = 0; index < recipeUpvotesIds.length; index += 1) {
    const recipeId = recipeUpvotesIds[index].slice(0, -8).slice(-36);
    recipeUpvotesIdsObject[recipeId] = recipeUpvotesIdsValues[index].length;
  }

  const sortedRecipeIds = Object.keys(recipeUpvotesIdsObject)
    .sort((a, b) => recipeUpvotesIdsObject[a] < recipeUpvotesIdsObject[b]);

  const mostUpvotedRecipes = await models.Recipe.findAll({
    where: {
      id: {
        [models.Sequelize.Op.in]: sortedRecipeIds.slice(page - 1, perPage)
      }
    },
    include: {
      model: models.User,
      attributes: { exclude: ['password'] }
    }
  });

  mostUpvotedRecipes
    .sort((r1, r2) => r1.get().upvotersIds.length < r2.get().upvotersIds.length);

  return {
    rows: mostUpvotedRecipes,
    count: recipeUpvotesIds.length
  };
};

export default filterMostUpvotedRecipes;

