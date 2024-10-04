/**
 * @fileoverview Configuration for multer storage and file handling.
 * @module config/multer
 */

const path = require("path");
const multer = require("multer");
const regex = require("../utils/regex");
const { mimeTypeValidation } = require("../utils/mimetypeValidation");
const {
  getBasePath,
  getAdvancedPath,
  nameWithoutExt,
} = require("../utils/multerFunctions");

/**
 * Creates a multer storage configuration with specified destination and filename functions.
 * @param {function} destinationFn - Function to determine the destination directory.
 * @param {function} filenameFn - Function to determine the filename.
 * @returns {multer.StorageEngine} Multer storage engine.
 */
const createStorage = (destinationFn, filenameFn) =>
  multer.diskStorage({
    destination: destinationFn,
    filename: filenameFn,
  });

/**
 * Default destination function for multer storage.
 * @param {Object} req - Express request object.
 * @param {Object} file - File object.
 * @param {function} cb - Callback function.
 */
const defaultDestination = (req, file, cb) => {
  cb(
    null,
    `uploads/${getAdvancedPath(
      file.fieldname,
      req.baseUrl,
      file.originalname
    )}/`
  );
};

/**
 * Default filename function for multer storage.
 * @param {Object} req - Express request object.
 * @param {Object} file - File object.
 * @param {function} cb - Callback function.
 */
const defaultFilename = (req, file, cb) => {
  cb(
    null,
    nameWithoutExt(file.originalname) +
      Date.now() +
      path.extname(file.originalname)
  );
};

/**
 * Default file filter function for multer.
 * @param {Object} req - Express request object.
 * @param {Object} file - File object.
 * @param {function} cb - Callback function.
 */
const defaultFilter = (req, file, cb) => {
  cb(null, mimeTypeValidation(getBasePath(file.fieldname), [file]));
};

/**
 * Creates a dynamic multer storage configuration with specified destination and filename functions.
 * @param {Object} destinations - Object containing destination functions for different file types.
 * @param {Object} filenames - Object containing filename functions for different file types.
 * @returns {multer.StorageEngine} Multer storage engine.
 */
const createDynamicStorage = (destinations, filenames) =>
  multer.diskStorage({
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

/**
 * Dynamic destination function for multer storage.
 * @param {Object} req - Express request object.
 * @param {Object} file - File object.
 * @returns {string} Destination directory path.
 */
const dynamicDestination = (req, file) => {
  return `uploads/${getAdvancedPath(
    file.fieldname,
    req.baseUrl,
    file.originalname
  )}/`;
};

/**
 * Filename function for audio files.
 * @param {Object} req - Express request object.
 * @param {Object} file - File object.
 * @returns {string} Generated filename.
 */
const audioFilename = (req, file) => {
  const lang = file.originalname.match(regex.audioLangRegex);
  return (
    `${Math.floor(100000 + Math.random() * 900000)}` +
    Date.now() +
    lang[0] +
    path.extname(file.originalname)
  );
};

/**
 * Filename function for image files.
 * @param {Object} req - Express request object.
 * @param {Object} file - File object.
 * @returns {string} Generated filename.
 */
const imageFilename = (req, file) => {
  return (
    nameWithoutExt(file.originalname) +
    Date.now() +
    path.extname(file.originalname)
  );
};

/**
 * Default multer storage configuration.
 * @type {multer.StorageEngine}
 */
const destinations = {
  image: dynamicDestination,
  audio: dynamicDestination,
};

/**
 * Combined multer storage configuration with dynamic destinations and filenames.
 * @type {multer.StorageEngine}
 */
const filenames = {
  image: imageFilename,
  audio: audioFilename,
};

const defaultStorage = createStorage(defaultDestination, defaultFilename);
const combinedStorage = createDynamicStorage(destinations, filenames);

module.exports = {
  defaultStorage,
  defaultFilter,
  combinedStorage,
};
