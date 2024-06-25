const { body } = require('express-validator');

const eventCreateValidation = () => {
    return [
        body("title")
            .isString()
            .withMessage("O título é obrigatório"),
        body("description")
            .isString()
            .withMessage("A descrição é obrigatória"),
        body("date")
            .isDate()
            .withMessage("A data do evento é obrigatória")
    ];
};

const eventUpdateValidation = () => {
    return [
        body("title")
            .optional()
            .isString()
            .withMessage("O título é obrigatório"),
        body("description")
            .optional()
            .isString()
            .withMessage("A descrição é obrigatória"),
        body("date")
            .optional()
            .isDate()
            .withMessage("A data do evento é obrigatória")
    ];
};

module.exports = {
    eventCreateValidation,
    eventUpdateValidation
}