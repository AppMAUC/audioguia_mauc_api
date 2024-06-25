const { body } = require("express-validator");

const artWorkCreateValidation = () => {
    return [
        body("title")
            .isString()
            .withMessage("O título é obrigatório.")
            .isLength({ min: 3 })
            .withMessage("O título precisa ter no mínimo três caracteres."),
        body("partial_desc")
            .isString()
            .withMessage("A descrição curta é obrigatória."),
        body("complete_desc")
            .isString()
            .withMessage("A descrição completa é obrigatória."),
        body("author")
            .isString()
            .withMessage("O nome do autor é obrigatório"), // lembrar de colocar um checkbox para desconhecido - checkbox ativa desabled no campo mas preenche o json com "Autor Desconhecido ou Desconhecido"
        body("suport")
            .isString()
            .withMessage("O suporte da obra é obrigatório"), // óleo sobre tela etc
        body("date")
            .isDate()
            .withMessage("A data da obra é obrigatória"),// lembrar de colocar um checkbox para desconhecido - checkbox ativa desabled no campo mas preenche o json com "Autor Desconhecido ou Desconhecido"
        body("dimension")
            .isString()
            .withMessage("As dimensões da obra são onrigatórias"),  // 00 x 00    mm / cm / m
    ];
};

const artWorkUpdateValidation = () => {
    return [
        body("title")
            .optional()
            .isLength({ min: 3 })
            .withMessage("O título precisa ter no mínimo três caracteres."),
        body("partial_desc")
            .optional()
            .isString()
            .withMessage("Formato inválido"),
        body("complete_desc")
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
        body("date")
            .optional()
            .isString()
            .withMessage("Formato inválido"),// lembrar de colocar um checkbox para desconhecido - checkbox ativa desabled no campo mas preenche o json com "Autor Desconhecido ou Desconhecido"
        body("dimension")
            .optional()
            .isString()
            .withMessage("Formato inválido"),  // 00 x 00    mm / cm / m
    ];
};

module.exports = {
    artWorkCreateValidation,
    artWorkUpdateValidation
};