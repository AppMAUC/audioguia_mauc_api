const { body } = require('express-validator');
const { fileValidation } = require('../config/files');
const { fileExists, getFilePath } = require('../utils/removeFile');

const artistCreateValidation = () => {
    return [
        body("name")
            .isString()
            .withMessage("O nome do artista é obrigatório."),
        body("description")
            .isString()
            .withMessage("A descrição é obrigatória"),
        body("birthDate")
            .isDate()
            .withMessage("A data de nascimento do artista é obrigatória"),
        body("biography")
            .isString()
            .withMessage("A biografia do artista é obrigatória"),
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
        body("birthDate")
            .optional()
            .isDate()
            .withMessage("A data de nascimento do artista é obrigatória"),
        body("biography")
            .optional()
            .isString()
            .withMessage("A biografia do artista é obrigatória"),
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
    artistCreateValidation,
    artistUpdateValidation
}