import models from './../database/models';
import client from './../helpers/redis-client';

const filterMostFavoritedRecipes = async (page, perPage) => {
  const recipeFavoritesIds = await client.keys('recipe:*:favorites');

  client.multi();
  recipeFavoritesIds.forEach(id => client.smembers(id));

  const recipeFavoritesIdsValues = await client.exec();
  const recipeFavoritesIdsObject = {};

  for (let index = 0; index < recipeFavoritesIds.length; index += 1) {
    const recipeId = recipeFavoritesIds[index].slice(0, -10).slice(-36);
    recipeFavoritesIdsObject[recipeId] = recipeFavoritesIdsValues[index].length;
  }

  const sortedRecipeIds = Object.keys(recipeFavoritesIdsObject)
    .sort((a, b) => recipeFavoritesIdsObject[a] < recipeFavoritesIdsObject[b]);

  const mostFavoritedRecipes = await models.Recipe.findAll({
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

  mostFavoritedRecipes
    .sort((r1, r2) => r1.get().favoritersIds.length < r2.get().favoritersIds.length);

  return {
    rows: mostFavoritedRecipes,
    count: recipeFavoritesIds.length
  };
};

export default filterMostFavoritedRecipes;

