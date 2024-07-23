const { body } = require("express-validator");

const artWorkCreateValidation = () => {
    return [
        body("title")
            .isString()
            .withMessage("O título é obrigatório.")
            .isLength({ min: 3 })
            .withMessage("O título precisa ter no mínimo três caracteres."),
        body("partialDesc")
            .isString()
            .withMessage("A descrição curta é obrigatória."),
        body("completeDesc")
            .isString()
            .withMessage("A descrição completa é obrigatória."),
        body("author")
            .isString()
            .withMessage("O nome do autor é obrigatório"), // lembrar de colocar um checkbox para desconhecido - checkbox ativa desabled no campo mas preenche o json com "Autor Desconhecido ou Desconhecido"
        body("suport")
            .isString()
            .withMessage("O suporte da obra é obrigatório"), // óleo sobre tela etc
        body("year")
            .isString()
            .withMessage("O ano da obra é obrigatório"),
        body("dimension")
            .isString()
            .withMessage("As dimensões da obra são obrigatórias"),  // 00 x 00    mm / cm / m
        body("archived")
            .optional()
            .isBoolean()
            .withMessage("O sistema deve saber o estado da obra"),
    ];
};

const artWorkUpdateValidation = () => {
    return [
        body("title")
            .optional()
            .isLength({ min: 3 })
            .withMessage("O título precisa ter no mínimo três caracteres."),
        body("partialDesc")
            .optional()
            .isString()
            .withMessage("Formato inválido"),
        body("completeDesc")
            .optional()
            .isString()
            .withMessage("Formato inválido"),
        body("author")
            .optional()
            .isString()
            .withMessage("Formato inválido"), // lembrar de colocar um checkbox para desconhecido - checkbox ativa desabled no campo mas preenche o json com "Autor Desconhecido ou Desconhecido"
        body("suport")
            .optional()
            .isString()
            .withMessage("Formato inválido"), // óleo sobre tela etc
        body("year")
            .optional()
            .isString()
            .withMessage("Formato inválido"),// lembrar de colocar um checkbox para desconhecido - checkbox ativa desabled no campo mas preenche o json com "Autor Desconhecido ou Desconhecido"
        body("dimension")
            .optional()
            .isString()
            .withMessage("Formato inválido"),  // 00 x 00    mm / cm / m
        body("archived")
            .optional()
            .isBoolean()
            .withMessage("O sistema deve saber o estado da obra"),
    ];
};

module.exports = {
    artWorkCreateValidation,
    artWorkUpdateValidation
};