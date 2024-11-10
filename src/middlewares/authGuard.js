const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");

/**
 * Middleware to protect routes by verifying JWT token and checking admin privileges.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 *
 * @returns {void}
 *
 * @throws {Error} If the token is invalid or not provided, responds with a 401 status and an error message.
 */
const authGuard = async (req, res, next) => {
  try {
    // check if token is valid
    const token = req.headers["authorization"]?.split(" ")[1];

    // check if header has a token
    if (!token) {
      const error = new Error("Acesso negado");
      error.statusCode = 401;
      throw error;
    }

    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      const error = new Error("Operação não autorizada");
      error.statusCode = 401;
      throw error;
    }

    const admin = await Admin.findOne({ refreshToken });
    if (!admin) {
      const error = new Error("Sessão expirada");
      error.statusCode = 403;
      throw error;
    }

    const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    req.admin = await Admin.findById(verified._id)
      .select("-password")
      .select("-refreshToken");

    next();
  } catch (error) {
    const statusCode = error.statusCode || 401;
    res.status(statusCode).json({ statusCode, message: error.message });
  }
};

module.exports = { authGuard };
