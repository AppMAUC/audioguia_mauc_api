const { body } = require("express-validator");
const { mimeTypeValidation } = require("../utils/mimeTypeValidation");
const { fileExists, getFilePath } = require("../utils/deleteFiles");

/**
 * Validation middleware for creating an admin.
 *
 * Validates the following fields:
 * - `name`: Must be a string and is required.
 * - `email`: Must be a string and is required.
 * - `password`: Must be a string and is required.
 * - `confirmPassword`: Must be a string and is required.
 * - `accessLevel`: Must be a number and is required.
 * - `image`: Must be a valid image file (png or jpg).
 *
 * @returns {Array} Array of validation rules.
 * @example
 * // Usage in an Express route
 * const { adminCreateValidation } = require('./validations/adminValidations');
 *
 * app.post('/admin', adminCreateValidation(), (req, res) => {
 *  // Handle request
 * });
 */
const adminCreateValidation = () => {
  return [
    body("name")
      .isString()
      .withMessage("O nome é obrigatório.")
      .isLength({ min: 3 })
      .withMessage("O nome precisa ter no mínimo três caracteres."),
    body("email")
      .isString()
      .withMessage("O e-mail é obrigatório.")
      .isEmail()
      .withMessage("Insira um email válido."),
    body("password")
      .isString()
      .withMessage("A senha é obrigatória.")
      .isLength({ min: 5 })
      .withMessage("A senha precisa ter no mínimo 5 caracteres."),
    body("confirmPassword")
      .isString()
      .withMessage("A confirmação de senha é obrigatória.")
      .custom((value, { req }) => {
        if (value != req.body.password) {
          throw new Error("As senhas não são iguais.");
        }
        return true;
      }),
    body("accessLevel").custom((value) => {
      const validAcess = ["1", "2"];
      if (!validAcess.includes(value)) {
        throw new Error("Escolha um nível de acesso válido.");
      }
      return true;
    }),
    body("image").custom((value, { req }) => {
      if (!mimeTypeValidation("image", [req.file])) {
        throw new Error("Envie apenas arquivos png, jpg ou tif.");
      }
      if (!fileExists(req.file.path)) {
        throw new Error("Erro ao salvar a imagem no servidor.");
      }

      return true;
    }),
  ];
};

/**
 * Validation middleware for admin login.
 *
 * Validates the following fields:
 * - `email`: Must be a string and is required.
 * - `password`: Must be a string and is required.
 *
 * @returns {Array} Array of validation rules.
 * @example
 * // Usage in an Express route
 * const { loginValidation } = require('./validations/adminValidations');
 *
 * app.post('/admin', loginValidation(), (req, res) => {
 *  // Handle request
 * });
 */
const loginValidation = () => {
  return [
    body("email")
      .isString()
      .withMessage("O e-mail é obrigatório.")
      .isEmail()
      .withMessage("Insira um e-mail válido."),
    body("password").isString().withMessage("A senha é obrigatória."),
  ];
};

/**
 * Validation middleware for updating an admin.
 *
 * Validates the following fields (all optional):
 * - `name`: Must be a string.
 * - `password`: Must be a string.
 * - `image`: Must be a valid image file (png or jpg) or an existing file.
 *
 * @returns {Array} Array of validation rules.
 * @example
 * // Usage in an Express route
 * const { adminUpdateValidation } = require('./validations/adminValidations');
 *
 * app.post('/admin', adminUpdateValidation(), (req, res) => {
 *  // Handle request
 * });
 */
const adminUpdateValidation = () => {
  return [
    body("name")
      .isLength({ min: 3 })
      .withMessage("O nome precisa ter no mínimo 3 caracteres.")
      .optional(),
    body("password")
      .isLength({ min: 5 })
      .withMessage("A senha precisa ter no mínimo 5 caracteres.")
      .optional(),
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
  adminCreateValidation,
  loginValidation,
  adminUpdateValidation,
};
  