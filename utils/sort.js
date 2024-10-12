/**
 * Sorts an array of documents in descending order based on the score.
 *
 * @param {Array} data - The array of documents to sort.
 * @returns {Array} The sorted array of documents.
 */
const handleSort = (data) => {
  return data.sort((a, b) => b._doc.score - a._doc.score);
};

module.exports = {
  handleSort,
};
