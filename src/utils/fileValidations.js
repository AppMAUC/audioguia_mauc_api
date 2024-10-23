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
 * @example
 * const files = [
 * { mimetype: 'audio/mp3' },
 * { mimetype: 'image/jpeg' },
 * { mimetype: 'image/tiff' }
 * ];
 * 
 * const isValid = mimeTypeValidation('image', files);
 * console.log(isValid); // Output: false
 * @example
 * const files = [
 * { mimetype: 'audio/mp3' },
 * { mimetype: 'image/jpeg' },
 * { mimetype: 'image/tiff' }
 * ];
 * 
 * const customTypes = {
 * audio: ['mp3'],
 * image: ['jpeg', 'png']
 * };
 *  
 * const isValid = mimeTypeValidation('image', files, customTypes);
 * console.log(isValid); // Output: true

 */
const mimeTypeValidation = (type, arr = [], customTypes = types) => {
  const newArr = arr.filter((file) =>
    customTypes[type].includes(file.mimetype.split("/")[1])
  );
  return arr.length === newArr.length;
};

/**
 * Validates that all files in the array do not exceed the specified maximum size.
 *
 * @param {Array} arr - Array of file objects to be validated.
 * @param {number} maxSize - Maximum allowed size for each file in bytes.
 * @returns {boolean} - Returns true if all files are within the size limit, otherwise false.
 */
const sizeValidation = (arr = [], maxSize) => {
  const newArr = arr.filter((file) => {
    return file.size <= maxSize;
  });
  return arr.length === newArr.length;
};

module.exports = {
  types,
  mimeTypeValidation,
  sizeValidation,
};
