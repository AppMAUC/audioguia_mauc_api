const fs = require("fs");
const path = require("path");

/**
 * Creates an object containing arrays of audio and image file names.
 *
 * @param {string[]} [audios=[]] - Array of audio file names.
 * @param {string[]} [images=[]] - Array of image file names.
 * @returns {{ audios: string[], images: string[] }} Object containing arrays of audio and image file names.
 * @example
 * createElements(["audio1.mp3", "audio2.mp3"], ["image1.jpg", "image2.jpg"]);
 */
const createElements = (audios = [], images = []) => {
  return {
    audios,
    images,
  };
};

/**
 * Parses a file name to extract its category, type, and language.
 *
 * @param {string} fileName - The name of the file to parse.
 * @returns {{ category: string, type: string, language: string }} Object containing the category, type, and language of the file.
 * @example
 * parseFileName("artworks-desc-en-7234151728093518855.MP3") // { category: "artworks", type: "desc", language: "en" };
 */
const parseFileName = (fileName) => {
  const [category, type, language] = fileName.split("-");
  return { category, type, language };
};

/**
 * Checks if a file exists at the given path.
 *
 * @param {string} filePath - The path of the file to check.
 * @param {Object} [fileSystem=fs] - The file system module to use for checking file existence.
 * @returns {boolean} True if the file exists, false otherwise.
 * @example
 * fileExists("uploads/audios/artworks/desc/en/audio1.mp3") // true
 */
const fileExists = (filePath, fileSystem = fs) => {
  try {
    return fileSystem.existsSync(filePath);
  } catch (err) {
    console.error("Erro ao verificar se o arquivo existe:", err);
    return false;
  }
};


/**
 * Checks if all files in the provided file paths exist.
 *
 * @param {string[]} filePaths - An array of file paths to check.
 * @param {Object} [fileSystem=fs] - The file system module to use for checking file existence.
 * @returns {boolean} - Returns true if all files exist, otherwise false.
 */
const filesExists = (filePaths, fileSystem = fs) => {
  return filePaths.every((filePath) => fileExists(filePath, fileSystem));
};

/**
 * Gets the full path of a specific file.
 *
 * @param {string} fileType - The type of the file (e.g., "audios" or "images").
 * @param {string} fileName - The name of the file.
 * @returns {string} The full path of the file.
 * @example
 * getFilePath("audios", "artworks-desc-en-7234151728093518855.MP3") // "uploads/audios/artworks/desc/en/artworks-desc-en-7234151728093518855.MP3"
 */
const getFilePath = (fileType, fileName) => {
  const { category, type, language } = parseFileName(fileName);

  if (fileType === "audios") {
    return path.join("uploads", fileType, category, type, language, fileName);
  }

  return path.join("uploads", fileType, category, fileName);
};

/**
 * Gets the paths of all files to be deleted.
 *
 * @param {Object} elements - Object containing arrays of audio and image file names.
 * @returns {string[]} Array of file paths to be deleted.
 * @example
 * getFilesPaths({ audios: ["artworks-desc-en-7234151728093518855.MP3"], images: ["artworks-image-7234151728093518855.jpg"] });
 */
const getFilesPaths = (elements) => {
  const getPaths = Object.keys(elements).flatMap((fileType) => {
    return elements[fileType].map((item) => getFilePath(fileType, item));
  });

  return getPaths;
};

/**
 * @typedef {Object} File
 * @property {string} fieldname - The field name specified in the form.
 * @property {string} originalname - The name of the file on the user's computer.
 * @property {string} encoding - The encoding type of the file.
 * @property {string} mimetype - The MIME type of the file.
 * @property {string} destination - The folder to which the file has been saved.
 * @property {string} filename - The name of the file within the destination.
 * @property {string} path - The full path to the uploaded file.
 * @property {number} size - The size of the file in bytes.
 */

/**
 * @typedef {Object} FileType
 * @property {Array<File>} image - Array of image files.
 * @property {Array<File>} audio - Array of audio description files.
 */

/**
 * @typedef {Object} RequestFiles
 * @property {FileType} files - Object containing arrays of image and audio files.
 */

/**
 * Gets the paths of all files from a request object.
 *
 * @param {RequestFiles} reqFiles - The files object from the request.
 * @returns {string[]} Array of file paths to be deleted.
 * @example
 * getPathsFromFilesRequest(req.files);
 */
const getPathsFromFilesRequest = (reqFiles) => {
  const paths = [];
  Object.keys(reqFiles).forEach((fileType) => {
    reqFiles[fileType].forEach((file) => {
      paths.push(file.path);
    });
  });

  return paths;
};

/**
 * Deletes the files at the given paths.
 *
 * @param {string[]} filePaths - Array of file paths to delete.
 * @param {Object} [fileSystem=fs] - The file system module to use for deleting files.
 * @example
 * deleteFiles(["uploads/audios/artworks/desc/en/artworks-desc-en-7234151728093518855.MP3"]);
 */
const deleteFiles = (filePaths, fileSystem = fs) => {
  filePaths.forEach((filePath) => {
    if (fileExists(filePath, fileSystem)) {
      try {
        fileSystem.unlinkSync(filePath);
        console.log(`Arquivo deletado: ${filePath}`);
      } catch (err) {
        console.error(`Erro ao deletar o arquivo: ${filePath}`, err);
      }
    }
  });
};

/**
 * Roll back files uploaded to the server.
 *
 *
 * @param {Request} req - The request object.
 * @returns {void} Deletes the files uploaded to the server
 * @example
 * // Use this function together throws errors in the controllers that envolves file uploads.
 * / Controller.js /
 * const register = async (req, res) => {
 *   const newModel = new Model(req.body);
 *   if (!newModel) {
 *      rollBackFiles(req);
 *      return res.status(400).json({ errors: ["Erro ao criar o modelo."] });
 * };
 *
 */
const rollBackFiles = (req) => {
  if (req.files) {
    const paths = getPathsFromFilesRequest(req.files);
    deleteFiles(paths);
  } else if (req.file) {
    deleteFiles([req.file.path]);
  }
};

module.exports = {
  createElements,
  fileExists,
  getFilesPaths,
  getFilePath,
  deleteFiles,
  parseFileName,
  getPathsFromFilesRequest,
  rollBackFiles,
  filesExists,
};
