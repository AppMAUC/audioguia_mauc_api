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
    body("title").isString().withMessage("O título é obrigatório"),
    body("description").isString().withMessage("A descrição é obrigatória"),
    body("events").isArray().withMessage("Os eventos são obrigatórios"),
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
    body("title").optional().isString().withMessage("O título é obrigatório"),
    body("description")
      .optional()
      .isString()
      .withMessage("A descrição é obrigatória"),
    body("events")
      .optional()
      .isArray()
      .withMessage("Os eventos são obrigatórios"),
  ];
};

module.exports = {
  timeLineCreateValidation,
  timeLineUpdateValidation,
};
