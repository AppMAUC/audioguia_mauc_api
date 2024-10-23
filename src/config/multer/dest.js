const path = require("path");
const { getAdvancedPath } = require("../../utils/multerFunctions");

/**
 * An object containing base paths for different storage options.
 * 
 * @property {string} local - The base path for local storage.
 * @property {string} firebase - The base path for Firebase storage.
 */
const basePath = {
  local: "tmp/uploads/",
  firebase: "uploads/",
};

/**
 * Dynamic destination function for multer storage.
 * @param {Object} req - Express request object.
 * @param {Object} file - File object.
 * @returns {string} Destination directory path.
 * @example
 * dinamicDestination(req, file) // 'uploads/audios/artworks/guia/br/'
 */
const dynamicDestination = (req, file) => {
  return `${basePath[process.env.STORAGE_TYPE]}${getAdvancedPath(
    file.fieldname,
    req.baseUrl,
    file.originalname
  )}/`;
};

/**
 * Default destination function for multer storage.
 * @param {Object} req - Express request object.
 * @param {Object} file - File object.
 * @param {function} cb - Callback function.
 */
const defaultDestination = (req, file, cb) => {
  cb(
    null,
    `${basePath[process.env.STORAGE_TYPE]}${getAdvancedPath(
      file.fieldname,
      req.baseUrl,
      file.originalname
    )}/`
  );
};

// Destination directory for file uploads.
const dest = path.resolve(__dirname, "..", "..", "..", "tmp", "uploads");

module.exports = {
  dynamicDestination,
  defaultDestination,
  dest,
  basePath,
};
