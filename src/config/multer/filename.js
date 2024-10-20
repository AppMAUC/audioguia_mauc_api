const path = require("path");
const {
  getURLPath,
  nameWithoutExt,
  getAudioType,
} = require("../../utils/multerFunctions");
const regex = require("../../utils/regex");

/**
 * Default filename function for multer storage.
 * @param {Object} req - Express request object.
 * @param {Object} file - File object.
 * @param {function} cb - Callback function.
 * @example
 * 'artworks-originalname-1234567890.mp3'
 */
const defaultFilename = (req, file, cb) => {
  file.key = `${getURLPath(req.baseUrl)}-${nameWithoutExt(
    file.originalname
  )}-${Math.floor(100000 + Math.random() * 900000)}${Date.now()}${path.extname(
    file.originalname
  )}`;

  cb(null, file.key);
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
  file.key = `${getURLPath(req.baseUrl)}-${getAudioType(file.fieldname)}${
    lang[0]
  }-${Math.floor(100000 + Math.random() * 900000)}${Date.now()}${path.extname(
    file.originalname
  )}`;
  
  file.lang = lang[1];
  return file.key;
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
  file.key = `${getURLPath(req.baseUrl)}-${nameWithoutExt(
    file.originalname
  )}-${Date.now()}${path.extname(file.originalname)}`;
  return file.key;
};

module.exports = {
  defaultFilename,
  audioFilename,
  imageFilename,
};
