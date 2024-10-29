const { body } = require("express-validator");

/**
 * Validation middleware for creating a timeline.
 *
 * Validates the following fields:
 * - `title`: Must be a string and is required.
 * - `description`: Must be a string and is required.
 * - `events`: Must be an array and is required.
 *
 * @returns {Array} Array of validation rules.
 * @example
 * // Usage in an Express route
 * const { timeLineCreateValidation } = require('./validations/timeLineValidations');
 *
 * app.post('/timelines', timeLineCreateValidation(), (req, res) => {
 *   // Handle request
 * });
 */
const timeLineCreateValidation = () => {
  return [
    body("title")
      .isString()
      .withMessage("O título é obrigatório.")
      .isLength({ min: 3 })
      .withMessage("O título deve ter no mínimo 3 caracteres."),
    body("description")
      .isString()
      .withMessage("A descrição é obrigatória.")
      .isLength({ min: 10 })
      .withMessage("A descrição deve ter no mínimo 3 caracteres."),
    body("events")
      .optional()
      .isArray()
      .withMessage("Os eventos são obrigatórios.")
      .isLength({ min: 1 })
      .withMessage("Deve haver pelo menos um evento."),
  ];
};

/**
 * Validation middleware for updating a timeline.
 *
 * Validates the following fields (all optional):
 * - `title`: Must be a string.
 * - `description`: Must be a string.
 * - `events`: Must be an array.
 *
 * @returns {Array} Array of validation rules.
 * @example
 * // Usage in an Express route
 * const { timeLineUpdateValidation } = require('./validations/timeLineValidations');
 *
 * app.put('/timelines/:id', timeLineUpdateValidation(), (req, res) => {
 *   // Handle request
 * });
 */
const timeLineUpdateValidation = () => {
  return [
    body("title")
      .optional()
      .isString()
      .withMessage("O título é obrigatório.")
      .isLength({ min: 3 })
      .withMessage("O título deve ter no mínimo 3 caracteres."),
    body("description")
      .optional()
      .isString()
      .withMessage("A descrição é obrigatória.")
      .isLength({ min: 10 })
      .withMessage("A descrição deve ter no mínimo 3 caracteres."),
    body("events")
      .optional()
      .isArray()
      .withMessage("Os eventos são obrigatórios.")
      .isLength({ min: 1 })
      .withMessage("Deve haver pelo menos um evento."),
  ];
};

module.exports = {
  timeLineCreateValidation,
  timeLineUpdateValidation,
};
