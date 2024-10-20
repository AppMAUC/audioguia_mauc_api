const { mimeTypeValidation } = require("../../utils/fileValidations");
const { getBasePath } = require("../../utils/multerFunctions");

/**
 * Default file filter function for multer.
 * @param {Object} req - Express request object.
 * @param {Object} file - File object.
 * @param {function} cb - Callback function.
 */
const defaultFilter = (req, file, cb) => {
  cb(null, mimeTypeValidation(getBasePath(file.fieldname), [file]));
};

module.exports = {
  defaultFilter,
};
