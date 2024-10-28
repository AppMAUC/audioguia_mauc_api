const { body } = require("express-validator");
const {
  fileCreateValidation,
  fileUpdateValidation,
} = require("../utils/handleFileValidations");

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
    body("image").custom((value, { req }) => {
      try {
        return fileCreateValidation([req.file], "image", "png, jpg ou tif");
      } catch (error) {
        throw error;
      }
    }),
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
    body("title")
      .optional()
      .isString()
      .withMessage("O título é obrigatório.")
      .isLength({ min: 3 })
      .withMessage("O título deve ter pelo menos 3 caracteres."),
    body("description")
      .optional()
      .isString()
      .withMessage("A descrição é obrigatória.")
      .isLength({ min: 10 })
      .withMessage("A descrição deve ter pelo menos 10 caracteres."),
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
        try {
          return fileUpdateValidation(
            value,
            [req.file],
            "image",
            "png, jpg ou tif"
          );
        } catch (error) {
          throw error;
        }
      }),
  ];
};

module.exports = {
  eventCreateValidation,
  eventUpdateValidation,
};
