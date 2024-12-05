const { body } = require("express-validator");
const {
  fileCreateValidation,
  fileUpdateValidation,
  verifyReqFiles,
} = require("../utils/handleFileValidations");

/**
 * Validation rules for creating a new artwork entry.
 *
 * Validates the following fields:
 * - `title`: Must be a string and is required.
 * - `description`: Must be a string and is required.
 * - `author`: Must be a string and is required.
 * - `suport`: Must be a string and is required.
 * - `year`: Must be a string and is required.
 * - `dimension`: Must be a string and is required.
 * - `archived`: Must be a boolean and is optional.
 * - `image`: Must be a valid image file (png, jpg or tiff).
 * - `audioDesc`: Must be a valid audio file (mp3 or mp4).
 * - `audioGuia`: Must be a valid audio file (mp3 or mp4).
 *
 * @returns {Array} Array of validation rules.
 * @example
 * // Usage in an Express route
 * const { artWorkCreateValidation } = require('./validations/artWorkValidations');
 *
 * app.post('/artworks', artWorksCreateValidation(), (req, res) => {
 *  // Handle request
 * });
 */
const artWorkCreateValidation = () => {
  return [
    body("title")
      .isString()
      .withMessage("O título é obrigatório.")
      .isLength({ min: 3 })
      .withMessage("O título precisa ter no mínimo três caracteres."),
    body("description").isString().withMessage("A descrição é obrigatória."),
    body("author").isString().withMessage("O nome do autor é obrigatório."),
    body("suport").isString().withMessage("O suporte da obra é obrigatório."),
    body("year").isString().withMessage("O ano da obra é obrigatório."),
    body("dimension")
      .isString()
      .withMessage("As dimensões da obra são obrigatórias."),
    body("image").custom((value, { req }) => {
      try {
        verifyReqFiles(req.files, "png, jpg ou tif");
        return fileCreateValidation(
          req.files["image"],
          "image",
          "png, jpg ou tif"
        );
      } catch (error) {
        throw error;
      }
    }),
    body("audioDesc")
      .optional()
      .custom((value, { req }) => {
        try {
          verifyReqFiles(req.files, "mp3 ou mp4");
          return fileCreateValidation(
            req.files["audioDesc"],
            "audio",
            "mp3 ou mp4"
          );
        } catch (error) {
          throw error;
        }
      }),
    body("audioGuia")
      .optional()
      .custom((value, { req }) => {
        try {
          verifyReqFiles(req.files, "mp3 ou mp4");
          return fileCreateValidation(
            req.files["audioGuia"],
            "audio",
            "mp3 ou mp4"
          );
        } catch (error) {
          throw error;
        }
      }),
  ];
};

/**
 * Validation rules for updating an existing artwork entry.
 *
 * Validates the following fields (all optional):
 * - `title`: Must be a string and.
 * - `description`: Must be a string and.
 * - `author`: Must be a string and.
 * - `suport`: Must be a string and.
 * - `year`: Must be a string and.
 * - `dimension`: Must be a string and.
 * - `archived`: Must be a boolean and is optional.
 * - `image`: Must be a valid image file (png or jpg).
 * - `audioDesc`: Must be a valid audio file (mp3 or mp4).
 * - `audioGuia`: Must be a valid audio file (mp3 or mp4).
 *
 * @returns {Array} Array of validation rules.
 * @example
 * // Usage in an Express route
 * const { artWorkUpdateValidation } = require('./validations/artWorkValidations');
 *
 * app.post('/artworks', artWorkUpdateValidation(), (req, res) => {
 *  // Handle request
 * });
 */
const artWorkUpdateValidation = () => {
  return [
    body("title")
      .optional()
      .isLength({ min: 3 })
      .withMessage("O título precisa ter no mínimo três caracteres."),
    body("description")
      .optional()
      .isString()
      .withMessage("Formato inválido.")
      .isLength({ min: 10 })
      .withMessage("A descrição precisa ter no mínimo dez caracteres."),
    body("author")
      .optional()
      .isString()
      .withMessage("Formato inválido.")
      .isLength({ min: 3 })
      .withMessage("O nome do autor precisa ter no mínimo três caracteres."),
    body("suport")
      .optional()
      .isString()
      .withMessage("Formato inválido.")
      .isLength({ min: 3 })
      .withMessage("O suporte precisa ter no mínimo três caracteres."),
    body("year")
      .optional()
      .isString()
      .withMessage("Formato inválido.")
      .isLength({ min: 4 })
      .withMessage("O ano precisa ter no mínimo quatro caracteres."),
    body("dimension")
      .optional()
      .isString()
      .withMessage("Formato inválido.")
      .isLength({ min: 3 })
      .withMessage("As dimensões precisam ter no mínimo três caracteres."),
    body("archived")
      .optional()
      .isBoolean()
      .withMessage("O sistema deve saber o estado da obra."),
    body("image")
      .optional()
      .custom((value, { req }) => {
        try {
          verifyReqFiles(req.files, "png, jpg ou tif");
          return fileUpdateValidation(
            value,
            req.files["image"],
            "image",
            "png, jpg ou tif"
          );
        } catch (error) {
          throw error;
        }
      }),
    body("audioDesc")
      .optional()
      .custom((value, { req }) => {
        try {
          verifyReqFiles(req.files, "mp3 ou mp4");
          return fileUpdateValidation(
            value,
            req.files["audioDesc"],
            "audio",
            "mp3 ou mp4"
          );
        } catch (error) {
          throw error;
        }
      }),
    body("audioGuia")
      .optional()
      .custom((value, { req }) => {
        try {
          verifyReqFiles(req.files, "mp3 ou mp4");
          return fileUpdateValidation(
            value,
            req.files["audioGuia"],
            "audio",
            "mp3 ou mp4"
          );
        } catch (error) {
          throw error;
        }
      }),
  ];
};

module.exports = {
  artWorkCreateValidation,
  artWorkUpdateValidation,
};
