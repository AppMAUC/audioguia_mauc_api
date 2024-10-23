const { rollBackFiles } = require("../utils/deleteFiles");

/**
 * Middleware to handle errors in the application.
 *
 * @param {Object} err - The error object.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 *
 * @returns {void}
 */
const handleError = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  rollBackFiles(req);
  res.status(statusCode).json({
    statusCode: statusCode,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = handleError;
