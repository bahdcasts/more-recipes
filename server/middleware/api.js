/**
 * Express middleware to modify response object
 * @param {object} req express request object
 * @param {object} res express response object
 * @param {function} next express middleware next() function
 * @returns {function} express next() function
 */
export default (req, res, next) => {
  res.sendSuccessResponse = (data, statusCode = 200) => res.status(statusCode).json({
    status: 'success',
    data
  });

  res.sendFailureResponse = (data, statusCode = 404) => res.status(statusCode).json({
    status: 'fail',
    data
  });

  return next();
};
