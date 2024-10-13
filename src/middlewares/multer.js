const path = require("path");

/**
 * Middleware for handling file uploads using multer.
 *
 * @module middlewares/multer
 */
const dest = path.resolve(__dirname, "..", "..", "tmp", "uploads");

const multer = require("multer");
const {
  defaultStorage,
  defaultFilter,
  combinedStorage,
} = require("../config/multer");

/**
 * Upload middleware configured with default storage and file filter.
 *
 * @type {multer.Instance}
 */
const upload = multer({
  dest: dest,
  storage: defaultStorage,
  fileFilter: defaultFilter,
});

/**
 * Combined upload middleware configured with combined storage and default file filter.
 * Allows uploading of multiple file fields.
 *
 * @type {multer.Instance}
 */
const combinedUpload = multer({
  dest: dest,
  storage: combinedStorage,
  fileFilter: defaultFilter,
}).fields([
  { name: "image", maxCount: 1 },
  { name: "audioDesc", maxCount: 2 },
  { name: "audioGuia", maxCount: 2 },
]);

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
  }).fields(fields);
};

module.exports = {
  upload,
  combinedUpload,
  genericUpload,
};
