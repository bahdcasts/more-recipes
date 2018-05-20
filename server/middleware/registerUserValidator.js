import validators from '../validators';


/**
 * Middleware to validate creating a recipe
 * @param {req} req express req object
 * @param {res} res express res object
 * @param {next} next express next method
 * @returns {next} next - express next method
 */
export default async (req, res, next) => {
  const validator = new validators.RegisterUserValidator(req.body);
  const isValid = await validator.isValid();
  if (!isValid) {
    return res.sendFailureResponse({ errors: validator.errors }, 422);
  }

  next();
};
