const { body } = require("express-validator");
const { mimeTypeValidation } = require("../utils/mimeTypeValidation");
const {
  fileExists,
  getFilePath,
  filesExists,
} = require("../utils/deleteFiles");
const { audioValidation } = require("../utils/audioValidation");
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
 * - `image`: Must be a valid image file (png or jpg).
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
    body("image")
      .custom((value, { req }) => {
        return mimeTypeValidation("image", req.files["image"]);
      })
      .withMessage("Envie apenas arquivos png, jpg ou tif."),
    body("audioDesc")
      .custom((value, { req }) => {
        if (!mimeTypeValidation("audio", req.files["audioDesc"])) {
          throw new Error("Envie apenas arquivos mp3 ou mp4.");
        }

        if (!filesExists(req.files["audioDesc"].map((file) => file.path))) {
          throw new Error("Erro ao salvar os áudios no servidor.");
        }

        return true;
      })
      .withMessage("Apenas arquivos mp3 ou mp4 são permitidos."),
    body("audioGuia")
      .custom((value, { req }) => {
        if (!mimeTypeValidation("audio", req.files["audioGuia"])) {
          throw new Error("Envie apenas arquivos mp3 ou mp4.");
        }

        if (!filesExists(req.files["audioGuia"].map((file) => file.path))) {
          throw new Error("Erro ao salvar os áudios no servidor.");
        }

        return true;
      })
      .withMessage("Apenas arquivos mp3 ou mp4 são permitidos."),
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
    body("description").optional().isString().withMessage("Formato inválido."),
    body("author").optional().isString().withMessage("Formato inválido."), // lembrar de colocar um checkbox para desconhecido - checkbox ativa desabled no campo mas preenche o json com "Autor Desconhecido ou Desconhecido"
    body("suport").optional().isString().withMessage("Formato inválido."), // óleo sobre tela etc
    body("year").optional().isString().withMessage("Formato inválido."), // lembrar de colocar um checkbox para desconhecido - checkbox ativa desabled no campo mas preenche o json com "Autor Desconhecido ou Desconhecido"
    body("dimension").optional().isString().withMessage("Formato inválido."), // 00 x 00    mm / cm / m
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
        return mimeTypeValidation("image", req.files["image"]);
      })
      .withMessage("Envie apenas arquivos png, jpg ou tif."),
    body("audioDesc")
      .optional()
      .custom((value, { req }) => {
        return audioValidation(value, req.files["audioDesc"]);
      })
      .withMessage("Apenas arquivos mp3 ou mp4 são permitidos."),
    body("audioGuia")
      .optional()
      .custom((value, { req }) => {
        return audioValidation(value, req.files["audioGuia"]);
      })
      .withMessage("Apenas arquivos mp3 ou mp4 são permitidos."),
  ];
};

module.exports = {
  artWorkCreateValidation,
  artWorkUpdateValidation,
};
