const path = require("path");
const { getAdvancedPath } = require("../../utils/multerFunctions");

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

const dest = path.resolve(__dirname, "..", "..", "..", "tmp", "uploads");

module.exports = {
  dynamicDestination,
  defaultDestination,
  dest,
  basePath,
};
