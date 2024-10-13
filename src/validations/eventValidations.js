const { body } = require("express-validator");
const { mimeTypeValidation } = require("../utils/mimeTypeValidation");
const { fileExists, getFilePath } = require("../utils/deleteFiles");
/**
 * Validation rules for creating an event.
 *
 * Validates the following fields:
 * - `title`: Must be a string and is required.
 * - `description`: Must be a string and is required.
 * - `date`: Must be a date and is required.
 * - `archived`: Must be a boolean and is optional.
 * - `image`: Must be a valid image file (png or jpg).
 *
 * @returns {Array} Array of validation rules.
 * @example
 * // Usage in an Express route
 * const { eventCreateValidation } = require('./validations/eventValidations');
 *
 * app.post('/events', eventCreateValidation(), (req, res) => {
 *  // Handle request
 * });
 */
const eventCreateValidation = () => {
  return [
    body("title").isString().withMessage("O título é obrigatório."),
    body("description").isString().withMessage("A descrição é obrigatória."),
    body("date").isDate().withMessage("A data do evento é obrigatória."),
    body("image")
      .custom((value, { req }) => {
        if (!mimeTypeValidation("image", [req.file])) {
          throw new Error("Envie apenas arquivos png, jpg ou tif.");
        }
        if (!fileExists(req.file.path)) {
          throw new Error("Erro ao salvar a imagem no servidor.");
        }

        return true;
      })
      .withMessage("Envie apenas arquivos png, jpg ou tif."),
  ];
};

/**
 * Validation rules for updating an event.
 *
 * Validates the following fields (all optional):
 * - `title`: Must be a string.
 * - `description`: Must be a string.
 * - `date`: Must be a date.
 * - `archived`: Must be a boolean.
 * - `image`: Must be a valid image file (png or jpg) or an existing file.
 *
 * @returns {Array} Array of validation rules.
 * @example
 * // Usage in an Express route
 * const { eventUpdateValidation } = require('./validations/eventValidations');
 *
 * app.post('/events', eventUpdateValidation(), (req, res) => {
 *  // Handle request
 * });
 */
const eventUpdateValidation = () => {
  return [
    body("title").optional().isString().withMessage("O título é obrigatório."),
    body("description")
      .optional()
      .isString()
      .withMessage("A descrição é obrigatória."),
    body("date")
      .optional()
      .isDate()
      .withMessage("A data do evento é obrigatória."),
    body("archived")
      .optional()
      .isBoolean()
      .withMessage("O sistema deve saber o estado da obra."),
    body("image")
      .optional()
      .custom((value, { req }) => {
        if (fileExists(getFilePath("images", value))) {
          return true;
        }
        return (
          mimeTypeValidation("image", [req.file]) && fileExists(req.file.path)
        );
      })
      .withMessage("Envie apenas arquivos png, jpg ou tif."),
  ];
};

module.exports = {
  eventCreateValidation,
  eventUpdateValidation,
};
