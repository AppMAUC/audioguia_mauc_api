const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const { bucket } = require("../config/firebase");

/**
 * Creates an object containing arrays of audio and image file names.
 *
 * @param {audio[]} [audios=[]] - Array of audio file names.
 * @param {image[]} [images=[]] - Array of image file names.
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
    return path.join(
      "tmp",
      "uploads",
      fileType,
      category,
      type,
      language,
      fileName
    );
  }

  return path.join("tmp", "uploads", fileType, category, fileName);
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
 * getPathsFromFilesRequest(req.files); // ["uploads/audios/artworks/desc/en/artworks-desc-en-7234151728093518855.MP3"]
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
 * Deletes the specified files from the file system.
 *
 * @param {string[]} filePaths - An array of file paths to be deleted.
 * @param {Object} [fileSystem=fs] - The file system module to use for file operations. Defaults to the 'fs' module.
 * @returns {Promise<void>} A promise that resolves when all files have been deleted.
 */
const deleteFiles = (filePaths, fileSystem = fs) => {
  filePaths.forEach((filePath) => {
    const newFilePath = filePath.startsWith("tmp\\")
      ? filePath
      : `tmp/${filePath}`;

    if (fileExists(newFilePath, fileSystem)) {
      try {
        console.log(`Arquivo deletado: ${newFilePath}`);
        return promisify(fileSystem.unlink)(newFilePath);
      } catch (err) {
        console.error(`Erro ao deletar o arquivo: ${newFilePath}`, err);
      }
    }
  });
};

/**
 *
 * Deletes the files at the given paths from Firebase Storage.
 *
 * @param {string[]} filePaths - Array of file paths to delete.
 * @returns {Promise<void>} A promise that resolves when all files have been deleted.
 * @example
 * deleteFilesFirebase(["uploads/audios/artworks/desc/en/artworks-desc-en-7234151728093518855.MP3"]);
 * // Arquivo deletado: uploads/audios/artworks/desc/en/artworks-desc-en-7234151728093518855.MP3
 *
 */
const deleteFilesFirebase = async (filePaths) => {
  const promises = filePaths.map(async (filePath) => {
    const file = bucket.file(filePath);
    try {
      await file.delete();
      console.log(`Arquivo deletado: ${filePath}`);
    } catch (error) {
      console.error(`Erro ao deletar o arquivo: ${filePath}`, error);
    }
  });

  await Promise.all(promises);
};

/**
 * An object that maps storage engines to their respective delete functions.
 *
 * @property {Function} local - Function to delete files from local storage. Receives a PathByUrl.
 * @property {Function} firebase - Function to delete files from Firebase storage. Receives a PathByUrl.
 */
const deleteEngine = {
  local: deleteFiles, // recebe um PathByUrl
  firebase: deleteFilesFirebase, // recebe um PathByUrl
};

/**
 * Roll back files uploaded to the server.
 *
 *
 * @param {Request} req - The request object.
 * @returns {void} Deletes the files uploaded to the server
 * @example
 * // Use this function together throws errors in the controllers that envolves file uploads.
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
    deleteEngine[process.env.STORAGE_TYPE](paths);
  } else if (req.file) {
    deleteEngine[process.env.STORAGE_TYPE]([req.file.path]);
  }
};

/**
 * Extracts and returns the file path from a given URL.
 *
 * @param {string} url - The URL containing the file path.
 * @returns {string} The extracted file path starting with 'uploads'.
 *
 * @example
 * getPathbyUrl("http://localhost:3000/uploads/audios/artworks/desc/en/artworks-desc-en-7234151728093518855.MP3") // "uploads/audios/artworks/desc/en/artworks-desc-en-7234151728093518855.MP3"
 */
const getPathbyUrl = (url = "") => {
  const path = url.split("uploads")[1];
  return path ? `uploads${path}` : null;
};

/**
 * Sets the URLs for an array of files based on their type and key.
 *
 * @param {string} fileType - The type of the files (e.g., 'image', 'audio').
 * @param {Array<Object>} array - The array of file objects. Each object should have a 'key' property.
 * @returns {Array<Object>} The array with updated file objects, each having a 'url' property.
 * @example
 * setFilesUrls("audios", [{ key: "artworks-desc-en-7234151728093518855.MP3" }]) // [{ key: "artworks-desc-en-7234151728093518855.MP3", url: "http://localhost:3000/uploads/audios/artworks/desc/en/artworks-desc-en-723415172809
 */
const setFilesUrls = (fileType, array) => {
  array.forEach((item) => {
    item.url = getUrlByFileKey(fileType, item.key);
  });
  return array;
};

/**
 * Generates a URL for a given file based on its type and filename.
 *
 * @param {string} fileType - The type of the file (e.g., "audios").
 * @param {string} filename - The name of the file.
 * @returns {string} The generated URL for the file.
 * @example
 * getUrlByFileKey("audios", "artworks-desc-en-7234151728093518855.MP3") // "http://localhost:3000/uploads/audios/artworks/desc/en/artworks-desc-en-7234151728093518855.MP3"
 */
const getUrlByFileKey = (fileType, filename) => {
  const { category, type, language } = parseFileName(filename);

  if (fileType === "audios") {
    return `${process.env.SERVER_URL}/uploads/${fileType}/${category}/${type}/${language}/${filename}`;
  }

  return `${process.env.SERVER_URL}/uploads/${fileType}/${category}/${filename}`;
};

/**
 * Compares old audio files with new audio files and returns the paths of old files that need to be deleted.
 *
 * @param {Array<Object>} oldAudios - Array of old audio objects, each containing a `lang` and `url` property.
 * @param {Array<Object>} newAudios - Array of new audio objects, each containing a `lang` and `url` property.
 * @returns {Array<string>} - Array of URLs of old audio files that need to be deleted.
 */
const getOldFilePaths = (oldAudios, newAudios) => {
  const paths = [];
  oldAudios.forEach((oldAudio) => {
    const newAudio = newAudios.find((audio) => audio.lang === oldAudio.lang);
    if (newAudio && newAudio.url !== oldAudio.url) {
      paths.push(oldAudio.url);
      console.log(`Deleting old file: ${oldAudio.url}`);
    }
  });
  return paths;
};

module.exports = {
  createElements,
  deleteEngine,
  deleteFiles,
  fileExists,
  filesExists,
  getFilesPaths,
  getFilePath,
  getOldFilePaths,
  getPathsFromFilesRequest,
  getPathbyUrl,
  getUrlByFileKey,
  parseFileName,
  rollBackFiles,
  setFilesUrls,
};
