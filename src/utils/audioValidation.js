const { getFilePath, fileExists } = require("./deleteFiles");
const { mimeTypeValidation } = require("./mimeTypeValidation");

/**
 * Validates audio files based on their existence and MIME type.
 *
 * @param {string|string[]} value - The audio file(s) to validate. Can be a string representing an existing file or an array of new files.
 * @param {Array} arr - An array containing MIME type information for validation.
 * @returns {boolean} - Returns true if all audio files exist and have valid MIME types, otherwise false.
 */
const audioValidation = (value, arr) => {
  // If the audioGuia is a string, it means that the audioGuia is an existing file
  if (value && arr) {
    return (
      fileExists(getFilePath("audios", value)) &&
      mimeTypeValidation("audio", arr)
    );
  }
  // If the audioGuia is an array, it means that the audioGuia is a new file
  if (typeof value == "object") {
    // Check if all files exist
    const audioExists = value.map((item) => {
      return fileExists(getFilePath("audios", item));
    });

    // Check if all files are valid
    return audioExists.includes(false) ? false : true;
  }

  return mimeTypeValidation("audio", arr);
};

module.exports = {
  audioValidation,
};
