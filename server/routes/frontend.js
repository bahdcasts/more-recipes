import { Router } from 'express';

import controllers from '../controllers';

const frontendRouter = new Router();
const frontendController = new controllers.FrontEndController();

frontendRouter.get('/home', frontendController.home);


export default frontendRouter;

