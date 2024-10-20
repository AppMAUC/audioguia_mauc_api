const multer = require("multer");
const { getBasePath } = require("../../utils/multerFunctions");

/**
 * Creates a multer storage configuration with specified destination and filename functions.
 * @param {function} destinationFn - Function to determine the destination directory.
 * @param {function} filenameFn - Function to determine the filename.
 * @returns {multer.StorageEngine} Multer storage engine.
 */
const createStorage = (destinationFn, filenameFn, storageEngine) =>
  storageEngine({
    destination: destinationFn,
    filename: filenameFn,
  });

/**
 * Creates a dynamic multer storage configuration with specified destination and filename functions.
 * @param {Object} destinations - Object containing destination functions for different file types.
 * @param {Object} filenames - Object containing filename functions for different file types.
 * @returns {multer.StorageEngine} Multer storage engine.
 */
const createDynamicStorage = (destinations, filenames, storageEngine) =>
  storageEngine({
    destination: (req, file, cb) => {
      const type = getBasePath(file.fieldname); // pode ser 'image' ou 'audio'
      const destinationFn = destinations[type]; // função de destino para 'image' ou 'audio'
      cb(null, destinationFn(req, file));
    },
    filename: (req, file, cb) => {
      const type = getBasePath(file.fieldname); // 'image' ou 'audio'
      const filenameFn = filenames[type]; // função de nome para 'image' ou 'audio'
      cb(null, filenameFn(req, file));
    },
  });

const memoryStorage = multer.memoryStorage();

module.exports = {
  createStorage,
  createDynamicStorage,
  memoryStorage,
};
