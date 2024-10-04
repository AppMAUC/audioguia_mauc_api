const { body } = require("express-validator");
const { mimetypeValidation, mimeTypeValidation } = require("../utils/mimetypeValidation");

const eventCreateValidation = () => {
  return [
    body("title").isString().withMessage("O título é obrigatório"),
    body("description").isString().withMessage("A descrição é obrigatória"),
    body("date").isDate().withMessage("A data do evento é obrigatória"),
    body("archived")
      .optional()
      .isBoolean()
      .withMessage("O sistema deve saber o estado da obra"),
    body("image")
      .custom((value, { req }) => {
        return mimetypeValidation("image", req.files["image"]);
      })
      .withMessage("Envie apenas arquivos png ou jpg"),
  ];
};

const eventUpdateValidation = () => {
  return [
    body("title").optional().isString().withMessage("O título é obrigatório"),
    body("description")
      .optional()
      .isString()
      .withMessage("A descrição é obrigatória"),
    body("date")
      .optional()
      .isDate()
      .withMessage("A data do evento é obrigatória"),
    body("archived")
      .optional()
      .isBoolean()
      .withMessage("O sistema deve saber o estado da obra"),
    body("image")
      .optional()
      .custom((value, { req }) => {
        if (fileExists(getFilePath("images", "events", value))) {
          return true;
        }
        return mimeTypeValidation("image", req.files["image"]);
      })
      .withMessage("Envie apenas arquivos png ou jpg"),
  ];
};

module.exports = {
  eventCreateValidation,
  eventUpdateValidation,
};
