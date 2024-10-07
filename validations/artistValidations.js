const { body } = require("express-validator");
const { mimeTypeValidation } = require("../utils/mimeTypeValidation");
const { fileExists, getFilePath } = require("../utils/deleteFiles");

/**
 * Validation middleware for creating an artist.
 *
 * Validates the following fields:
 * - `name`: Must be a string and is required.
 * - `description`: Must be a string and is required.
 * - `birthDate`: Must be a valid date and is required.
 * - `biography`: Must be a string and is required.
 * - `image`: Must be a valid image file (png or jpg).
 * - `audioGuia`: Must be a valid audio file (mp3 or mp4).
 *
 * @returns {Array} Array of validation chain middlewares.
 * @example
 * // Usage in an Express route
 * const { artistCreateValidation } = require('./validations/artistValidations');
 *
 * app.post('/artists', artistCreateValidation(), (req, res) => {
 *  // Handle request
 * });
 */
const artistCreateValidation = () => {
  return [
    body("name").isString().withMessage("O nome do artista é obrigatório."),
    body("description").isString().withMessage("A descrição é obrigatória"),
    body("birthDate")
      .isDate()
      .withMessage("A data de nascimento do artista é obrigatória"),
    body("biography")
      .isString()
      .withMessage("A biografia do artista é obrigatória"),
    body("image")
      .custom((value, { req }) => {
        return mimeTypeValidation("image", req.files["image"]);
      })
      .withMessage("Envie apenas arquivos png ou jpg"),
    body("artWorks")
      .isArray()
      .withMessage("Formato de dado inválido.")
      .isLength({ min: 1 })
      .withMessage("A exposição precisa ter mais de uma obra."),
    body("audioGuia")
      .custom((value, { req }) => {
        return mimeTypeValidation("audio", req.files["audioGuia"]);
      })
      .withMessage("Apenas arquivos mp3 ou mp4 são permitidos"),
  ];
};

/**
 * Validation middleware for updating an artist.
 *
 * Validates the following fields (all optional):
 * - `name`: Must be a string.
 * - `description`: Must be a string.
 * - `birthDate`: Must be a valid date.
 * - `biography`: Must be a string.
 * - `image`: Must be a valid image file (png or jpg) or an existing file.
 * - `audioGuia`: Must be a valid audio file (mp3 or mp4) or an existing file.
 *
 * @returns {Array} Array of validation chain middlewares.
 * @example
 * // Usage in an Express route
 * const { artistUpdateValidation } = require('./validations/artistValidations');
 *
 * app.post('/artists', artistUpdateValidation(), (req, res) => {
 *  // Handle request
 * });
 */
const artistUpdateValidation = () => {
  return [
    body("name")
      .optional()
      .isString()
      .withMessage("O nome do artista é obrigatório."),
    body("description")
      .optional()
      .isString()
      .withMessage("A descrição é obrigatória"),
    body("birthDate")
      .optional()
      .isDate()
      .withMessage("A data de nascimento do artista é obrigatória"),
    body("artWorks")
      .optional()
      .isArray()
      .withMessage("Formato de dado inválido.")
      .isLength({ min: 1 })
      .withMessage("A exposição precisa ter mais de uma obra."),
    body("biography")
      .optional()
      .isString()
      .withMessage("A biografia do artista é obrigatória"),
    body("image")
      .optional()
      .custom((value, { req }) => {
        if (fileExists(getFilePath("images", "artworks", value))) {
          return true;
        }
        return mimeTypeValidation("image", req.files["image"]);
      })
      .withMessage("Envie apenas arquivos png ou jpg"),
    body("audioGuia")
      .optional()
      .custom((value, { req }) => {
        // If the audioGuia is a string, it means that the audioGuia is an existing file
        if (value && req.files["audioGuia"]) {
          return (
            fileExists(getFilePath("audios", value)) &&
            mimeTypeValidation("audio", req.files["audioGuia"])
          );
        }
        // If the audioGuia is an array, it means that the audioGuia is a new file
        if (typeof value == "object") {
          // Check if all files exist
          const audioExists = value.map((item) => {
            return fileExists(getFilePath("audios", item));
          });

          // Check if all files are valid
          return audioExists.includes(false) ? false : true;
        }

        return mimeTypeValidation("audio", req.files["audioGuia"]);
      })
      .withMessage("Apenas arquivos mp3 ou mp4 são permitidos"),
  ];
};

module.exports = {
  artistCreateValidation,
  artistUpdateValidation,
};
