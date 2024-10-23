const Exposition = require("../models/Exposition");
const ArtWork = require("../models/ArtWork");
const Artist = require("../models/Artist");
const { getDataWithPaginate } = require("../utils/paginate");

/**
 * Handles the general search request and responds with paginated data.
 *
 * @async
 * @function searchGeneral
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the response is sent.
 * @throws Will pass any caught errors to the next middleware.
 */
const searchGeneral = async (req, res, next) => {
  try {
    const data = await getDataWithPaginate([Exposition, ArtWork, Artist], req);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  searchGeneral,
};
