/**
 * @fileoverview Configuration for multer storage and file handling.
 * @module config/multer
 */

const path = require("path");
const multer = require("multer");
const regex = require("../utils/regex");
const { mimeTypeValidation } = require("../utils/mimeTypeValidation");
const {
  getBasePath,
  getAdvancedPath,
  nameWithoutExt,
  getAudioType,
  getURLPath,
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
    `tmp/uploads/${getAdvancedPath(
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
 * @example
 * 'artworks-originalname-1234567890.mp3'
 */
const defaultFilename = (req, file, cb) => {
  cb(
    null,
    getURLPath(req.baseUrl) +
      "-" +
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
 * @example
 * dinamicDestination(req, file) // 'uploads/audios/artworks/guia/br/'
 */
const dynamicDestination = (req, file) => {
  return `tmp/uploads/${getAdvancedPath(
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
 * @example
 * audioFilename(req, file) // 'artworks-guia-br-1234567890.mp3'
 */
const audioFilename = (req, file) => {
  const lang = file.originalname.match(regex.audioLangRegex);
  return (
    getURLPath(req.baseUrl) +
    "-" +
    getAudioType(file.fieldname) +
    lang[0] +
    `-${Math.floor(100000 + Math.random() * 900000)}` +
    Date.now() +
    path.extname(file.originalname)
  );
};

/**
 * Filename function for image files.
 * @param {Object} req - Express request object.
 * @param {Object} file - File object.
 * @returns {string} Generated filename.
 * @example
 * imageFilename(req, file) // 'artworks-originalname-1234567890.jpg'
 */
const imageFilename = (req, file) => {
  return (
    getURLPath(req.baseUrl) +
    "-" +
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
