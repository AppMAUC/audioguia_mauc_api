const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_PASS;

const authGuard = async (req, res, next) => {

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    // check if header has a token
    if (!token) return res.status(401).json({ errors: ["Acesso negado!"] });

    // check if token is valid
    try {

        const verified = jwt.verify(token, jwtSecret);

        req.admin = await Admin.findById(verified.id).select("-password");

        next();
    } catch (error) {
        res.status(401).json({ errors: ["Token inválido!"] });
    };
};

const verifyToken = async (req, res, next) => {

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    // check if header has a token
    if (!token) return res.status(401).json({ errors: ["Acesso negado!"] });

    // check if token is valid
    try {

        const verified = jwt.verify(token, jwtSecret);

        const admin = await Admin.findById(verified.id).select("-password");

        if (!admin) {
            res.status(401).json({ errors: ["Token inválido!"] });
        }

        next();
    } catch (error) {
        res.status(401).json({ errors: ["Token inválido"] });
    };
};

module.exports = { verifyToken, authGuard };