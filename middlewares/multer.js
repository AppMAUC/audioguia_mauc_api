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
} = require("../config/multer");

/**
 * Upload middleware configured with default storage and file filter.
 *
 * @type {multer.Instance}
 */
const upload = multer({ storage: defaultStorage, fileFilter: defaultFilter });

/**
 * Combined upload middleware configured with combined storage and default file filter.
 * Allows uploading of multiple file fields.
 *
 * @type {multer.Instance}
 */
const combinedUpload = multer({
  storage: combinedStorage,
  fileFilter: defaultFilter,
}).fields([
  { name: "image", maxCount: 1 },
  { name: "audioDesc", maxCount: 2 },
  { name: "audioGuia", maxCount: 2 },
]);

module.exports = {
  upload,
  combinedUpload,
};
