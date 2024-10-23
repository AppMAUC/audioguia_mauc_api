const { mimeTypeValidation, sizeValidation } = require("./fileValidations");
const { limits } = require("../config/multer");

/**
 * Validates files based on their existence and MIME type.
 *
 * @param {string|string[]} value - The audio file(s) to validate. Can be a string representing an existing file or an array of new files.
 * @param {Array} arr - An array containing MIME type information for validation.
 * @param {'image' | 'audio'} fileType - The type of file to validate, ''.
 * @param {string} types - An object containing valid MIME types for audio files.
 * @returns {boolean} - Returns true if all audio files exist and have valid MIME types, otherwise false.
 * @throws {Error} - Throws an error if the audio file does not exist or has an invalid MIME type.
 * @example
 * // Usage in an express-validator file
 * const { fileUpdateValidation } = require('../utils/handleFileValidations');
 *
 * const artWorkUpdateValidation = () => {
 *  return [
 *    body("image").custom((value, { req }) => {
 *      return fileUpdateValidation(value, req.files["image"], "image", "png, jpg ou tif");
 *    }
 *  ];
 * };
 *
 *
 */
const fileUpdateValidation = (value, arr, fileType, types) => {
  if (value && !arr) {
    // if value exists and arr does not exist it means that the file is already in the database
    // since it is not necessary to validate the MIME type because no new file is being uploaded
    return true;
  }

  if (!value && !arr) {
    // if the file does not exist, an error is returned
    throw Error(`Envie apenas arquivos ${types}.`);
  }

  if (!sizeValidation(arr, limits.fileSize)) {
    // if the file size exceeds the limit, an error is returned
    throw Error("O tamanho do arquivo ultrapassou o limite permitido.");
  }

  if (!mimeTypeValidation(fileType, arr)) {
    // if the file is not an audio file, an error is returned
    throw Error(`Envie apenas arquivos ${types}.`);
  }

  return true;
};

/**
 * Validates the file creation process by checking the file size and MIME type.
 *
 * @param {Array} arr - The array containing file data.
 * @param {'image' | 'audio'} fileType - The MIME type of the file.
 * @param {string} types - The allowed file types.
 * @returns {boolean} - Returns true if the file is valid, otherwise returns an Error.
 * @throws {Error} - Throws an error if the file is not valid.
 * @example
 * // Usage in an express-validator file
 * const { fileCreateValidation } = require('../utils/handleFileValidations');
 *
 * const artWorkCreateValidation = () => {
 *  return [
 *    body("image").custom((value, { req }) => {
 *      return fileCreateValidation(req.files["image"], "image", "png, jpg ou tif");
 *    }
 *  ];
 * };
 */
const fileCreateValidation = (arr, fileType, types) => {
  if (!sizeValidation(arr, limits.fileSize)) {
    // if the file size exceeds the limit, an error is returned
    throw Error("O tamanho do arquivo ultrapassou o limite permitido.");
  }

  if (!mimeTypeValidation(fileType, arr)) {
    // if the file is not an audio file, an error is returned
    throw Error(`Envie apenas arquivos ${types}.`);
  }
  return true;
};

/**
 * Verifies and updates the list of old audio objects with new audio objects.
 *
 * This function iterates over the new audio objects and updates the old audio objects
 * if there is a match based on the `lang` property. If no match is found, the new audio
 * object is added to the old audio objects list.
 *
 * @param {Array<Object>} newAudios - The array of new audio objects to be verified and added.
 * @param {Array<Object>} oldAudios - The array of old audio objects to be updated.
 * @returns {Array<Object>} The updated array of old audio objects.
 *
 * @example
 * // Usage in an update controller
 * const { verifyAudios } = require('../utils/audioValidation');
 *
 * const updateArtWork = async (req, res, next) => {
 *  const { audioDesc, audioGuia } = req.body;
 *  const artWork = await ArtWork.findById(req.params.id);
 *
 * if (audioDesc) {
 *  artWork.audioDesc = verifyAudios(audioDesc, artWork.audioDesc);
 * }
 *
 * if (audioGuia) {
 * artWork.audioGuia = verifyAudios(audioGuia, artWork.audioGuia);
 * }
 *
 * await artWork.updateOne({
 *  audioDesc: artWork.audioDesc,
 *  audioGuia: artWork.audioGuia,
 * });
 *
 * res.status(200).json({ message: 'Artwork updated successfully.' });
 * }
 *
 */
const verifyAudios = (newAudios, oldAudios) => {
  newAudios.forEach((audio) => {
    for (let i = 0; i < oldAudios.length; i++) {
      if (audio.lang === oldAudios[i].lang) {
        oldAudios[i] = audio;
      }
    }
    if (!oldAudios.some((item) => item.lang === audio.lang)) {
      oldAudios.push(audio);
    }
  });
  return oldAudios;
};

module.exports = {
  fileUpdateValidation,
  fileCreateValidation,
  verifyAudios,
};
