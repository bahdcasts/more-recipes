import kue from 'kue';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config';
import models from '../database/models';
import { updateUserAttributes } from '../helpers';

import redisConfig from '../config/redis';

/**
 * Controls endpoints for authentication
 * @class AuthController
 */
export default class AuthController {
  /**
  * Register a new user
  *
  * @param {object} req express request object
  * @param {object} res express response object
  *
  * @returns {object} newly created user
  */
  async signup(req, res) {
    const user = await models.User.create({
      name: req.body.name,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, process.env.NODE_ENV === 'production' ? 10 : 1)
    });
    const queue = kue.createQueue(process.env.NODE_ENV === 'production' ? redisConfig.production : {});

    //  Register a new mails job to the queue
    queue.create('mails', {
      recipient: user.get(),
      message: {
        subject: 'Welcome to Bahdcoder More-recipes'
      },
      template: {
        pug: 'welcome',
        locals: { name: user.name }
      }
    }).events(false).save();

    const accessToken = jwt.sign({ email: user.email }, config.JWT_SECRET);

    const updatedUser = await updateUserAttributes(user, models);
    return res.sendSuccessResponse({ user: updatedUser, access_token: accessToken });
  }


  /**
   * Sign in a user
   * @param {object} req express request object
   * @param {object} res express response object
   *
   * @returns {object} json with user access_token
   */
  async signin(req, res) {
    try {
      const user = await models.User.findOne({ where: { email: req.body.email } });
      if (user) {
        const isCorrectPassword = await bcrypt.compare(req.body.password, user.password);
        if (isCorrectPassword) {
          const accessToken = jwt.sign({ email: user.email }, config.JWT_SECRET);
          const updatedUser = await updateUserAttributes(user, models);
          return res.sendSuccessResponse({ user: updatedUser, access_token: accessToken });
        }

        throw new Error('The passwords did not match.');
      }

      throw new Error('No user was found.');
    } catch (error) {
      return res.sendFailureResponse({ errors: 'These credentials do not match our records.' }, 422);
    }
  }
}
