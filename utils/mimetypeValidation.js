/**
 * Object containing arrays of different file types.
 * @typedef {Object} Types
 * @property {string[]} audio - Array of audio file types.
 * @property {string[]} image - Array of image file types.
 */

const types = {
  audio: ["mp4", "mpeg", "mp3"],
  image: ["jpeg", "png", "jpg", "tiff"],
};

/**
 * Validates if the mimetypes of the files in the array match the specified type.
 *
 * @param {string} type - The type of files to validate (e.g., 'audio', 'image', 'document').
 * @param {Array<Object>} arr - The array of file objects to validate.
 * @param {Object} [customTypes=types] - An optional object specifying custom types and their valid mimetypes.
 * @returns {boolean} - Returns true if all files in the array have valid mimetypes for the specified type, otherwise false.
 */

const mimeTypeValidation = (type, arr, customTypes = types) => {
  const newArr = arr.filter((file) =>
    customTypes[type].includes(file.mimetype.split("/")[1])
  );
  return arr.length === newArr.length;
};

module.exports = {
  types,
  mimeTypeValidation,
};
