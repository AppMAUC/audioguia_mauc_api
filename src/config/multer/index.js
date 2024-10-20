/**
 * @fileoverview Configuration for multer storage and file handling.
 * @module config/multer
 */
const {
  createStorage,
  createDynamicStorage,
  memoryStorage,
} = require("./storage");

const multer = require("multer");
const { defaultFilter } = require("./filter");
const { dynamicDestination, defaultDestination, dest } = require("./dest");
const { imageFilename, audioFilename, defaultFilename } = require("./filename");
const firebaseStorage = require("./firebaseStorage");

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

const storageEngine = {
  local: multer.diskStorage,
  firebase: firebaseStorage,
};

module.exports = {
  defaultStorage: createStorage(
    defaultDestination,
    defaultFilename,
    storageEngine[process.env.STORAGE_TYPE]
  ),
  defaultFilter,
  combinedStorage: createDynamicStorage(
    destinations,
    filenames,
    storageEngine[process.env.STORAGE_TYPE]
  ),
  dest: dest,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
};
