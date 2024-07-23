const { body } = require("express-validator");

const adminCreateValidation = () => {

    return [
        body("name")
            .isString()
            .withMessage("O nome é obrigatório.")
            .isLength({ min: 3 })
            .withMessage("O nome precisa ter no mínimo três caracteres."),
        body("email")
            .isString()
            .withMessage("O e-mail é obrigatório.")
            .isEmail()
            .withMessage("Insira um email válido."),
        body("password")
            .isString()
            .withMessage("A senha é obrigatória.")
            .isLength({ min: 5 })
            .withMessage("O senha precisa ter no mínimo 5 caracteres."),
        body("confirmPassword")
            .isString()
            .withMessage("A confirmação de senha é obrigatória.")
            .custom((value, { req }) => {
                if (value != req.body.password) {
                    throw new Error("As senhas não são iguais")
                }
                return true
            }),
        body("accessLevel")
            .isString()
            .withMessage("Adicione um nível de acesso válido")
            .custom((value) => {
                const validAcess = [1, 2, "1", "2"];
                if (!validAcess.includes(value)) {
                    throw new Error("Escolha um nível de acesso válido")
                };
                return true;
            }),
    ];
};

const loginValidation = () => {
    return [
        body("email")
            .isString()
            .withMessage("O e-mail é obrigatório")
            .isEmail()
            .withMessage("Insira um e-mail válido"),
        body("password")
            .isString()
            .withMessage("A senha é obrigatória")
    ];
};

const adminUpdateValidation = () => {
    return [
        body("name")
            .isLength({ min: 3 })
            .withMessage("O nome precisa ter no mínimo 3 caracteres")
            .optional(),
        body("password")
            .isLength({ min: 5 })
            .withMessage("A senha precisa ter no mínimo 5 caracteres")
            .optional()

    ];
};

module.exports = {
    adminCreateValidation,
    loginValidation,
    adminUpdateValidation
};