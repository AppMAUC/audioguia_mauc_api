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
  const token = req.headers["authorization"]?.split(" ")[1];

  // check if header has a token
  if (!token) return res.status(401).json({ errors: ["Acesso negado"] });

  // check if token is valid
  try {
    const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    req.admin = await Admin.findById(verified._id).select("-password");

    next();
  } catch (error) {
    res.status(401).json({ errors: ["Acesso Negado"] });
  }
};

module.exports = { authGuard };
