const { body } = require("express-validator");
const {
  fileCreateValidation,
  fileUpdateValidation,
} = require("../utils/handleFileValidations");

/**
 * Validation middleware for creating an artist.
 *
 * Validates the following fields:
 * - `name`: Must be a string and is required.
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
    body("birthDate")
      .isDate()
      .withMessage("A data de nascimento do artista é obrigatória."),
    body("biography")
      .isString()
      .withMessage("A biografia do artista é obrigatória."),
    body("image").custom((value, { req }) => {
      try {
        return fileCreateValidation(
          req.files["image"],
          "image",
          "png, jpg ou tif"
        );
      } catch (error) {
        throw error;
      }
    }),
    body("artWorks")
      .optional()
      .isArray()
      .withMessage("Formato de dado inválido."),
    body("audioGuia").custom((value, { req }) => {
      try {
        return fileCreateValidation(
          req.files["audioGuia"],
          "audio",
          "mp3, mp4"
        );
      } catch (error) {
        throw error;
      }
    }),
  ];
};

/**
 * Validation middleware for updating an artist.
 *
 * Validates the following fields (all optional):
 * - `name`: Must be a string.
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
    body("birthDate")
      .optional()
      .isDate()
      .withMessage("A data de nascimento do artista é obrigatória."),
    body("artWorks")
      .optional()
      .isArray()
      .withMessage("Formato de dado inválido."),
    body("biography")
      .optional()
      .isString()
      .withMessage("A biografia do artista é obrigatória."),
    body("image")
      .optional()
      .custom((value, { req }) => {
        try {
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
    body("audioGuia")
      .optional()
      .custom((value, { req }) => {
        try {
          return fileUpdateValidation(
            value,
            req.files["audioGuia"],
            "audio",
            "mp3, mp4"
          );
        } catch (error) {
          throw error;
        }
      }),
  ];
};

module.exports = {
  artistCreateValidation,
  artistUpdateValidation,
};
