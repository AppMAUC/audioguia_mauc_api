const { body } = require("express-validator");
const { mimeTypeValidation } = require("../utils/mimeTypeValidation");
const {
  fileExists,
  getFilePath,
  filesExists,
} = require("../utils/deleteFiles");
const { audioValidation } = require("../utils/audioValidation");

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
      if (!mimeTypeValidation("image", req.files["image"])) {
        throw new Error("Envie apenas arquivos png, jpg ou tif.");
      }

      if (!fileExists(req.files["image"][0].path)) {
        throw new Error("Erro ao salvar a imagem no servidor.");
      }

      return true;
    }),
    body("artWorks")
      .optional()
      .isArray()
      .withMessage("Formato de dado inválido."),
    body("audioGuia").custom((value, { req }) => {
      if (!mimeTypeValidation("audio", req.files["audioGuia"])) {
        throw new Error("Envie apenas arquivos mp3 ou mp4.");
      }

      if (!filesExists(req.files["audioGuia"].map((file) => file.path))) {
        throw new Error("Erro ao salvar os áudios no servidor.");
      }

      return true;
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
        if (fileExists(getFilePath("images", value))) {
          return true;
        }
        return mimeTypeValidation("image", req.files["image"]);
      })
      .withMessage("Envie apenas arquivos png, jpg ou tif."),
    body("audioGuia")
      .optional()
      .custom((value, { req }) => {
        return audioValidation(value, req.files["audioGuia"]);
      })
      .withMessage("Apenas arquivos mp3 ou mp4 são permitidos."),
  ];
};

module.exports = {
  artistCreateValidation,
  artistUpdateValidation,
};
