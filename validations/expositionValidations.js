const { body } = require("express-validator");
const { fileValidation } = require("../config/files");

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
        body("artWorks")
            .isArray()
            .withMessage("Formato de dado inválido.")
            .isLength({ min: 1 })
            .withMessage("A exposição precisa ter mais de uma obra."),
        body("place")
            .isString()
            .withMessage("O local da exposição é obrigatório."),
        body("dateStarts")
            .isDate()
            .withMessage("Adicione uma data válida."),
        body("dateEnds")
            .isDate()
            .withMessage("Adicione uma data válida."),
        body("type")
            .isInt()
            .withMessage("Adicione um tipo válido")
            .custom((value) => {
                const validAcess = [1, 2, "1", "2"];
                if (!validAcess.includes(value)) {
                    throw new Error("Escolha um tipo válido")
                };
                return true;
            }),
        body("archived")
            .optional()
            .isBoolean()
            .withMessage("O sistema deve saber o estado da obra"),
        body("image")
            .custom((value, { req }) => {
                return fileValidation('image', [req.file]);
            })
            .withMessage("Envie apenas arquivos png ou jpg"),
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
        body("artWorks")
            .optional()
            .isArray()
            .withMessage("Formato de dado inválido.")
            .isLength({ min: 1 })
            .withMessage("A exposição precisa ter mais de uma obra."),
        body("place")
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
            .withMessage("Adicione uma data válida."),
        body("type")
            .optional()
            .isInt()
            .withMessage("Adicione um tipo válido")
            .custom((value) => {
                const validAcess = [1, 2, "1", "2"];
                if (!validAcess.includes(value)) {
                    throw new Error("Escolha um tipo válido")
                };
                return true;
            }),
        body("archived")
            .optional()
            .isBoolean()
            .withMessage("O sistema deve saber o estado da obra"),
        body("image")
            .optional()
            .custom((value, { req }) => {
                if (fileExists(getFilePath('images', 'expositions', value))) {
                    return true;
                }
                return fileValidation('image', req.files['image']);
            })
            .withMessage("Envie apenas arquivos png ou jpg"),
    ];
};

module.exports = {
    expositionCreateValidation,
    expositionUpdateValidation
};