const { body } = require("express-validator");

const expositionCreateValidation = () => {
    return [
        body("title")
            .isString()
            .withMessage("O título é obrigatório.")
            .isLength({ min: 3 })
            .withMessage("O título precisa ter no mínimo três caracteres."),
        body("description")
            .isString()
            .withMessage("A descrição é obrigatória."),
        body("artWork")
            .isArray()
            .withMessage("Formato de dado inválido.")
            .isLength({ min: 2 })
            .withMessage("A exposição precisa ter mais de uma obra."),
        body("livingRoom")
            .isString()
            .withMessage("O local da exposição é obrigatório."),
        body("dateStarts")
            .isDate()
            .withMessage("Adicione uma data válida."),
        body("dateEnds")
            .isDate()
            .withMessage("Adicione uma data válida.")
    ];
};
// Verificar se o Array terá problemas

const expositionUpdateValidation = () => {
    return [
        body("title")
            .optional()
            .isString()
            .withMessage("O título é obrigatório.")
            .isLength({ min: 3 })
            .withMessage("O título precisa ter no mínimo três caracteres."),
        body("description")
            .optional()
            .isString()
            .withMessage("A descrição é obrigatória."),
        body("artWork")
            .optional()
            .isArray()
            .withMessage("Formato de dado inválido.")
            .isLength({ min: 2 })
            .withMessage("A exposição precisa ter mais de uma obra."),
        body("livingRoom")
            .optional()
            .isString()
            .withMessage("O local da exposição é obrigatório."),
        body("dateStarts")
            .optional()
            .isDate()
            .withMessage("Adicione uma data válida."),
        body("dateEnds")
            .optional()
            .isDate()
            .withMessage("Adicione uma data válida.")
    ];
};

module.exports = {
    expositionCreateValidation,
    expositionUpdateValidation
};