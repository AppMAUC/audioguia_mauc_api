const { body } = require("express-validator");
const { fileValidation } = require("../config/files");
const { fileExists, getFilePath } = require("../utils/removeFile");

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
        body("image")
            .custom((value, { req }) => {
                return fileValidation('image', req.files['image']);
            })
            .withMessage("Envie apenas arquivos png ou jpg"),
        body("audioDesc")
            .custom((value, { req }) => {
                return fileValidation('audio', req.files['audioDesc']);
            })
            .withMessage("Apenas arquivos mp3 ou mp4 são permitidos"),
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
        body("image")
            .optional()
            .custom((value, { req }) => {
                if (fileExists(getFilePath('images', 'artworks', value))) {
                    return true;
                }
                return fileValidation('image', req.files['image']);
            })
            .withMessage("Envie apenas arquivos png ou jpg"),
        body("audioDesc")
            .optional()
            .custom((value, { req }) => {

                if (value && req.files['audioDesc']) {
                    return fileExists(getFilePath('audios', 'artworks', value)) && fileValidation('audio', req.files['audioDesc']);
                }

                if (typeof (value) == 'object') {
                    const audioExists = value.map((item) => {
                        return fileExists(getFilePath('audios', 'artworks', item))
                    })

                    return audioExists.includes(false) ? false : true;
                }

                return fileValidation('audio', req.files['audioDesc']);
            })
            .withMessage("Apenas arquivos mp3 ou mp4 são permitidos"),
    ];
};

module.exports = {
    artWorkCreateValidation,
    artWorkUpdateValidation
};