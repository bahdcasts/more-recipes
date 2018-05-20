/* eslint-disable */
import config from './../config';
import redisClient from './redis-client';

/**
 * Helper methods to use throughout the app
 */

/**
 * Check if an email is of valid format
 * @param {string} email the email to check validity for
 * @returns {bool} true or false
 */
const isValidEmail = email => /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email);
export const reWebUrl = new RegExp(
  "^" +
  // protocol identifier
  "(?:(?:https?|ftp)://)" +
  // user:pass authentication
  "(?:\\S+(?::\\S*)?@)?" +
  "(?:" +
  // IP address exclusion
  // private & local networks
  "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
  "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
  "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
  // IP address dotted notation octets
  // excludes loopback network 0.0.0.0
  // excludes reserved space >= 224.0.0.0
  // excludes network & broacast addresses
  // (first & last IP address of each class)
  "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
  "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
  "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
  "|" +
  // host name
  "(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)" +
  // domain name
  "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*" +
  // TLD identifier
  "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" +
  // TLD may end with dot
  "\\.?" +
  ")" +
  // port number
  "(?::\\d{2,5})?" +
  // resource path
  "(?:[/?#]\\S*)?" +
  "$", "i"
);

export default isValidEmail;

/**
 * Updates the recipe attributes
 *
 * @param {any} sequelizeRecipe sequelize Recipe instance
 * @returns {Recipe} recipe with upvotes, downvotes and favorites attributes
 */
export async function updateRecipeAttributes(sequelizeRecipe) {
  const recipe = sequelizeRecipe.get();

  const upvotersIds = await redisClient.smembers(`recipe:${recipe.id}:upvotes`);
  recipe.upvotersIds = upvotersIds;

  const downvotersIds = await redisClient.smembers(`recipe:${recipe.id}:downvotes`);
  recipe.downvotersIds = downvotersIds;

  const favoritersIds = await redisClient.smembers(`recipe:${recipe.id}:favorites`);
  recipe.favoritersIds = favoritersIds;

  const viewers = await redisClient.smembers(`recipe:${recipe.id}:viewers`);
  recipe.viewers = viewers;

  return recipe;
}

/**
 * Return updated users details
 * @param {obj} user
 * @param {obj} models
 * @return {obj} updated user
 */
export async function updateUserAttributes(user, models) {
  const recipes = await models.Recipe.findAll({
    where: {
      userId: user.id
    }
  });

  user = user.get();
  user.recipes = recipes;
  delete user.password;

  return user;
}

/**
 * Return updated users settings
 * @param {obj} user
 * @param {obj} requestData
 * @return {obj} updated user
 */
export async function updateUserSettings(user, requestData) {
  const newSettings = JSON.parse(user.settings);

  Object.entries(requestData).forEach(([key, value]) => {
    if (config.VALID_USER_SETTINGS.indexOf(key) !== -1) {
      console.log(value);
      if (Number(value) === 1 || Number(value) === 0) {
        newSettings[key] = Number(value);
      }
    }
  });

  user.settings = JSON.stringify(newSettings);
  await user.save();
  return newSettings;
}
