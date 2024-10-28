const jwt = require("jsonwebtoken");

/**
 * Generates an access token.
 *
 * @param {string} id - The user ID.
 * @param {string} email - The user email.
 * @returns {string} The generated access token.
 */
const generateAccessToken = (id, email) => {
  return jwt.sign({ _id: id, email: email }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "60min",
  });
};

/**
 * Generates a refresh token.
 *
 * @param {string} id - The user ID.
 * @param {string} email - The user email.
 * @returns {string} The generated refresh token.
 */
const generateRefreshToken = (id, email) => {
  return jwt.sign({ _id: id, email: email }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
