const { body } = require('express-validator');

const artistCreateValidation = () => {
    return [
        body("name")
            .isString()
            .withMessage("O nome do artista é obrigatório."),
        body("description")
            .isString()
            .withMessage("A descrição é obrigatória"),
        body("birth_date")
            .isDate()
            .withMessage("A data de nascimento do artista é obrigatória"),
        body("biography")
            .isString()
            .withMessage("A biografia do artista é obrigatória")

    ];
};
const artistUpdateValidation = () => {
    return [
        body("name")
            .optional()
            .isString()
            .withMessage("O nome do artista é obrigatório."),
        body("description")
            .optional()
            .isString()
            .withMessage("A descrição é obrigatória"),
        body("birth_date")
            .optional()
            .isDate()
            .withMessage("A data de nascimento do artista é obrigatória"),
        body("biography")
            .optional()
            .isString()
            .withMessage("A biografia do artista é obrigatória")

    ];
};


module.exports = {
    artistCreateValidation,
    artistUpdateValidation
}