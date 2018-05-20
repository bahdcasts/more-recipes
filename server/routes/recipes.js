import { Router } from 'express';
import middleware from '../middleware';
import controllers from '../controllers';

const recipesRoutes = new Router();
const reviewsController = new controllers.ReviewsController();
const recipesController = new controllers.RecipesController();
const votesController = new controllers.VotesController();

recipesRoutes.get('/', recipesController.index);
recipesRoutes.get('/:id', middleware.hasRecipe, recipesController.find);
recipesRoutes.delete('/:id', middleware.auth, middleware.hasRecipe, middleware.authorize, recipesController.destroy);
recipesRoutes.post('/', middleware.auth, middleware.createRecipeValidator, recipesController.create);
recipesRoutes.put('/:id', middleware.auth, middleware.hasRecipe, middleware.authorize, middleware.updateRecipeValidator, recipesController.update);

recipesRoutes.get('/:id/voters', middleware.auth, middleware.hasRecipe, votesController.getVoters);
recipesRoutes.post('/:id/upvote', middleware.auth, middleware.hasRecipe, middleware.canUpvote, votesController.upvote);
recipesRoutes.get('/:id/reviews', middleware.hasRecipe, reviewsController.index);
recipesRoutes.post('/:id/downvote', middleware.auth, middleware.hasRecipe, middleware.canDownvote, votesController.downvote);
recipesRoutes.post('/:id/reviews', middleware.auth, middleware.hasRecipe, middleware.canReview, reviewsController.create);
recipesRoutes.post('/:id/views', middleware.auth, middleware.hasRecipe, recipesController.view);

export default recipesRoutes;
