import { updateUserSettings } from './../helpers';
/**
 * Manage user settings
 */
export default class SettingsController {
  /**
   * Update settings for a user
   * @param {object} req the express request object
   * @param {object} res the express response object
   *
   * @returns {object} json response to user with new settings
   */
  async updateUserSettings(req, res) {
    const newSettings = await updateUserSettings(req.authUserObj, req.body);
    return res.sendSuccessResponse({ settings: newSettings });
  }
}
