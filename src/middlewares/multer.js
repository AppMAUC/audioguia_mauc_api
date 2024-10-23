/**
 * Middleware for handling file uploads using multer.
 *
 * @module middlewares/multer
 */
const multer = require("multer");
const {
  defaultStorage,
  defaultFilter,
  combinedStorage,
  dest,
  limits,
} = require("../config/multer");

/**
 * Upload middleware configured with default storage and file filter.
 *
 * @type {multer.Instance}
 */
const upload = multer({
  dest,
  storage: defaultStorage,
  fileFilter: defaultFilter,
  limits: limits,
});

/**
 * Generic upload middleware that allows specifying custom fields.
 * Uses combined storage and default file filter.
 *
 * @param {Array} fields - Array of field objects specifying the field name and max count.
 * @returns {multer.Instance} - Multer instance for handling file uploads.
 * @example
 * // Usage in an Express route
 * const { genericUpload } = require('./middlewares/multer');
 *
 * app.post('/route', genericUpload([{ name: 'image', maxCount: 1 }]), (req, res) => {
 */
const genericUpload = (fields) => {
  return multer({
    storage: combinedStorage,
    fileFilter: defaultFilter,
    limits: limits,
  }).fields(fields);
};

module.exports = {
  upload,
  genericUpload,
};
