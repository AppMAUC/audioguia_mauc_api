const { handleSort } = require("./sort");

/**
 * @typedef {Object} Pagination
 * @property {number} first - The first page number.
 * @property {number|null} prev - The previous page number, or null if on the first page.
 * @property {number|null} next - The next page number, or null if on the last page.
 * @property {number} last - The last page number.
 * @property {number} pages - The total number of pages.
 * @property {number} items - The total number of items.
 */

/**
 * Paginates the given page and limit based on the total number of items.
 * @function paginate
 * @param {number} page - The current page number.
 * @param {number} limit - The number of items per page.
 * @param {number} totalItems - The total number of items.
 * @returns {Pagination} An object containing pagination information.
 */
const paginate = (page, limit, totalItems) => {
  const totalPages = Math.ceil(totalItems / limit);
  return {
    first: 1,
    prev: page > 1 ? page - 1 : null,
    next: page < totalPages ? page + 1 : null,
    last: totalPages,
    pages: totalPages,
    items: totalItems,
  };
};

/**
 * Retrieves data with pagination based on the request query parameters.
 *
 * @async
 * @function getDataWithPaginate
 * @param {Array} models - An array of Mongoose models to query.
 * @param {Object} req - The request object containing query parameters.
 * @param {Object} req.query - The query parameters from the request.
 * @param {string} [req.query.q] - The search query string.
 * @param {string} [req.query.page] - The current page number as a string.
 * @param {string} [req.query.limit] - The number of items per page as a string.
 * @param {Function} [sort=handleSort] - The sorting function to use.
 * @returns {Promise<Object>} A promise that resolves to an object containing pagination information and the retrieved data.
 * @returns {Pagination} return.pagination - The pagination information.
 * @returns {Array} return.data - The retrieved data from the models.
 *
 * @example
 * const data = await getDataWithPaginate([Exposition, ArtWork, Artist], req);
 * console.log(data);
 * // Output: {
 * //     first: 1,
 * //     prev: null,
 * //     next: 2,
 * //     last: 5,
 * //     pages: 5,
 * //     items: 50
 * //     data: [
 * //     Exposition1, Exposition2, Exposition3,
 * //     ArtWork1, ArtWork2, ArtWork3,
 * //     Artist1, Artist2, Artist3
 * //   ]
 * // }
 *
 * @example
 * const customSort = (data) => {
 *  return data.sort((a, b) => a._doc.score - b._doc.score);
 * };
 * const data = await getDataWithPaginate([Exposition, ArtWork, Artist], req, customSort);
 *
 */
const getDataWithPaginate = async (models, req, sort = handleSort) => {
  const query = req.query.q || "";
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10; // O limite significa que vai vir no mínimo um item de cada model por página
  const skip = (page - 1) * limit;

  const searchQuery = { $text: { $search: query } };
  const projection = { score: { $meta: "textScore" } };

  const data = await Promise.all(
    models.map((model) =>
      model
        .find(searchQuery, projection)
        .sort({ score: { $meta: "textScore" } })
        .skip(skip)
        .limit(limit)
    )
  );

  const counts = await Promise.all(
    models.map((model) => model.countDocuments(searchQuery))
  );

  const totalItems = counts.reduce((acc, count) => acc + count, 0);

  return { ...paginate(page, limit, totalItems), data: sort(data.flat()) };
};

/**
 * Retrieves paginated data from a given model based on the request query parameters.
 *
 * @async
 * @function getAllWithPaginate
 * @param {Object} model - The Mongoose model to query.
 * @param {Object} req - The request object containing query parameters.
 * @param {Object} req.query - The query parameters from the request.
 * @param {string} [req.query.page=1] - The page number to retrieve.
 * @param {string} [req.query.limit=10] - The number of items per page.
 * @param {Object} sort - The sorting criteria for the query.
 * @returns {Promise<Object>} The paginated data and pagination details.
 * 
 * @example
 * const data = await getAllWithPaginate(Artist, req, [["date", -1]]);
 */
const getAllWithPaginate = async (model, req, sort) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const data = await model.find({}).sort(sort).skip(skip).limit(limit).exec();

  const totalItems = await model.countDocuments();
  return { ...paginate(page, limit, totalItems), data: data };
};

module.exports = {
  paginate,
  getDataWithPaginate,
  getAllWithPaginate,
  handleSort,
};
