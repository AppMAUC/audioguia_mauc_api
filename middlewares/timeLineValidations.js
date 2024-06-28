const { body } = require('express-validator');

const timeLineCreateValidation = () => {
    return [
        body("title")
            .isString()
            .withMessage("O título é obrigatório"),
        body("description")
            .isString()
            .withMessage("A descrição é obrigatória"),
        body("events")
            .isArray()
            .withMessage("Os eventos são obrigatórios")
    ];
};

const timeLineUpdateValidation = () => {
    return [
        body("title")
            .optional()
            .isString()
            .withMessage("O título é obrigatório"),
        body("description")
            .optional()
            .isString()
            .withMessage("A descrição é obrigatória"),
        body("events")
            .optional()
            .isArray()
            .withMessage("Os eventos são obrigatórios")
    ];
};

module.exports = {
    timeLineCreateValidation,
    timeLineUpdateValidation
};