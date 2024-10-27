
// Sort functions related to the paginate functions, should be two parameters.
// The first parameter is the data to be sorted and the second is the limit.
// The sort function should return the sorted data.
// The limit parameter is used to calculate the number of items based on the request query and it is optional.
// If you can use limit parameter, make a custom sort function and take with the second parameter.
// It happend because the paginate function receive data about an array of models.
// And the limit in the moongoose query will use the limit for each model.
// The result is an array of arrays of models with the minimum number of items.
// And if you want to get especific number of items, you can use the limit parameter in the custom sort function.

/**
 * Sorts an array of documents in descending order based on the score.
 *
 * @param {Array} data - The array of documents to sort.
 * @param {number} limit - The number of items per page. 
 * @returns {Array} The sorted array of documents.
 */
const handleSort = (data, limit) => {
  return data.sort((a, b) => b._doc.score - a._doc.score);
};

module.exports = {
  handleSort,
};
