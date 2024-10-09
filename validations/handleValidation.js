const { validationResult } = require("express-validator");
const { rollBackFiles } = require("../utils/deleteFiles");
/**
 * Middleware function to handle validation results from express-validator.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {void|Object} - Calls next middleware if no validation errors, otherwise returns a 422 status with error messages.
 * @example
 * // Example of using the validate middleware in a route
 * router.post("/register", validate, register);
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Como o mullter está sendo chamado antes das validações do express-validator, os arquivos são salvos no disco antes de serem validados.
    // Por isso, é necessário deletar os arquivos que foram salvos no servidor antes de retornar o erro.
    rollBackFiles(req);
    return res.status(400).json({
      statusCode: 400,
      message: "Validation Error",
      errors: errors.array().map((err) => {
        console.log(err);
        return {
          field: err.path,
          message: err.msg,
        };
      }),
    });
  }

  next();
};

module.exports = validate;
