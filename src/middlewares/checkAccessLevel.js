/**
 * Middleware to check if the authenticated admin has the required access level.
 *
 * @param {number} requiredLevel - The access level required to proceed.
 * @returns {function} Middleware function to check access level.
 *
 * @throws {Error} Throws an error with status code 403 if access level is insufficient.
 * @throws {Error} Throws an error with status code 401 if there is any other issue.
 *
 * @example
 * // Usage in an Express route
 * app.get('/admin', checkAccessLevel(2), (req, res) => {
 *   res.send('Welcome, admin!');
 * });
 */
const checkAccessLevel = (requiredLevel) => {
  return (req, res, next) => {
    try {
      const { accessLevel } = req.admin; // Assume que `req.admin` já tem o admin autenticado
      if (accessLevel !== requiredLevel) {
        const error = new Error(
          "Você não tem permissão para acessar este recurso, caso necessário solicite a um administrador com permissão."
        );
        error.statusCode = 403;
        throw error;
      }

      next();
    } catch (error) {
      const statusCode = error.statusCode || 401;
      res.status(statusCode).json({ statusCode, message: error.message });
    }
  };
};

module.exports = { checkAccessLevel };
