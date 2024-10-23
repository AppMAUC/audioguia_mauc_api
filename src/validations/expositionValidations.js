const { body } = require("express-validator");
const {
  fileCreateValidation,
  fileUpdateValidation,
} = require("../utils/handleFileValidations");
/**
 * Validation rules for creating an exposition.
 *
 * Validates the following fields:
 * - `title`: Must be a string and is required.
 * - `description`: Must be a string and is required.
 * - `artWorks`: Must be an array and is required.
 * - `place`: Must be a string and is required.
 * - `dateStarts`: Must be a date and is required.
 * - `dateEnds`: Must be a date and is required.
 * - `type`: Must be an integer and is required.
 * - `archived`: Must be a boolean and is optional.
 * - `image`: Must be a valid image file (png or jpg).
 *
 * @returns {Array} Array of validation rules.
 * @example
 * // Usage in an Express route
 * const { expositionCreateValidation } = require('./validations/expositionValidations');
 *
 * app.post('/expositions', expositionCreateValidation(), (req, res) => {
 *  // Handle request
 * });
 */
const expositionCreateValidation = () => {
  return [
    body("title")
      .isString()
      .withMessage("O título é obrigatório.")
      .isLength({ min: 3 })
      .withMessage("O título precisa ter no mínimo três caracteres."),
    body("description").isString().withMessage("A descrição é obrigatória."),
    body("artWorks")
      .isArray()
      .withMessage("Formato de dado inválido.")
      .isLength({ min: 1 })
      .withMessage("A exposição precisa ter mais de uma obra."),
    body("place").isString().withMessage("O local da exposição é obrigatório."),
    body("dateStarts").isDate().withMessage("Adicione uma data válida."),
    body("dateEnds").isDate().withMessage("Adicione uma data válida."),
    body("type").custom((value) => {
      const types = ["1", "2"];
      if (!types.includes(value)) {
        throw new Error("Escolha um tipo válido.");
      }
      return true;
    }),
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
 * Validation rules for updating an exposition.
 *
 * Validates the following fields (all optional):
 * - `title`: Must be a string.
 * - `description`: Must be a string.
 * - `artWorks`: Must be an array.
 * - `place`: Must be a string.
 * - `dateStarts`: Must be a date.
 * - `dateEnds`: Must be a date.
 * - `type`: Must be an integer.
 * - `archived`: Must be a boolean.
 * - `image`: Must be a valid image file (png or jpg).
 *
 * @returns {Array} Array of validation rules.
 * @example
 * // Usage in an Express route
 * const { expositionUpdateValidation } = require('./validations/expositionValidations');
 *
 * app.post('/expositions', expositionUpdateValidation(), (req, res) => {
 *  // Handle request
 * });
 */
const expositionUpdateValidation = () => {
  return [
    body("title")
      .optional()
      .isString()
      .withMessage("O título é obrigatório.")
      .isLength({ min: 3 })
      .withMessage("O título precisa ter no mínimo três caracteres."),
    body("description")
      .optional()
      .isString()
      .withMessage("A descrição é obrigatória."),
    body("artWorks")
      .optional()
      .isArray()
      .withMessage("Formato de dado inválido.")
      .isLength({ min: 1 })
      .withMessage("A exposição precisa ter mais de uma obra."),
    body("place")
      .optional()
      .isString()
      .withMessage("O local da exposição é obrigatório."),
    body("dateStarts")
      .optional()
      .isDate()
      .withMessage("Adicione uma data válida."),
    body("dateEnds")
      .optional()
      .isDate()
      .withMessage("Adicione uma data válida."),
    body("type")
      .optional()
      .isInt()
      .withMessage("Adicione um tipo válido.")
      .custom((value) => {
        const validAcess = [1, 2, "1", "2"];
        if (!validAcess.includes(value)) {
          throw new Error("Escolha um tipo válido.");
        }
        return true;
      }),
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
  expositionCreateValidation,
  expositionUpdateValidation,
};
