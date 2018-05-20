import { Router } from 'express';
import middleware from '../middleware';
import controllers from './../controllers';

const userRoutes = new Router();
const authController = new controllers.AuthController();
const usersController = new controllers.UsersController();
const settingsController = new controllers.SettingsController();

userRoutes.get('/profile/:id', usersController.getUser);
userRoutes.put('/update', middleware.auth, usersController.updateProfile);
userRoutes.get('/:id/recipes', usersController.getRecipes);
userRoutes.post('/settings', middleware.auth, settingsController.updateUserSettings);
userRoutes.get('/favorites', middleware.auth, usersController.getFavorites);
userRoutes.post('/signin', middleware.signinUserValidator, authController.signin);
userRoutes.post('/signup', middleware.registerUserValidator, authController.signup);
userRoutes.post('/:recipeId/favorites', middleware.auth, middleware.hasRecipe, middleware.canFavorite, usersController.favorite);

export default userRoutes;
