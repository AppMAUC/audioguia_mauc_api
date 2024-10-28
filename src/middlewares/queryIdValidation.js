const mongoose = require("mongoose");
const { rollBackFiles } = require("../utils/deleteFiles");

/**
 * Middleware to validate the `id` parameter in the request.
 * If the `id` parameter is present and is not a valid MongoDB ObjectId,
 * it rolls back any uploaded files and returns a 400 status with an error message.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.params - The parameters of the request.
 * @param {string} req.params.id - The `id` parameter to validate.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 *
 * @returns {Object|void} - Returns a 400 status with an error message if validation fails, otherwise calls the next middleware.
 */
const queryIdValidation = (req, res, next) => {
  if (req.params.id && !mongoose.Types.ObjectId.isValid(req.params.id)) {
    rollBackFiles(req);
    return res.status(400).json({
      statusCode: 400,
      message: "Identificador inválido",
    });
  }
  next();
};

module.exports = queryIdValidation;
