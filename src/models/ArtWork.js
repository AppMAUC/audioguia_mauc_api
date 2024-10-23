/**
 * @file Artwork.js
 * @description Mongoose model for the Artwork collection in the database.
 */

const mongoose = require("mongoose");
const { Schema } = mongoose;
const {
  deleteEngine,
  getPathbyUrl,
  getOldFilePaths,
} = require("../utils/deleteFiles");
const { bucket } = require("../config/firebase");

/**
 * Schema for an artwork.
 * @typedef {Object} ArtWork
 * @property {string} title - The title of the artwork.
 * @property {string} image - The URL or path to the image of the artwork.
 * @property {string} description - Description of the artwork.
 * @property {Array} audioDesc - An array of audio descriptions for the artwork.
 * @property {Array} audioGuia - An array of audio guides for the artwork.
 * @property {string} author - The author of the artwork.
 * @property {string} suport - The support or medium of the artwork.
 * @property {string} year - The year the artwork was created.
 * @property {string} dimension - The dimensions of the artwork.
 * @property {boolean} archived - Whether the artwork is archived.
 * @property {Date} createdAt - The date the artwork was created in the database.
 * @property {Date} updatedAt - The date the artwork was last updated in the database.
 */
/**
 * Mongoose schema for the Artwork collection.
 * @type {Schema}
 */
const artWorkSchema = new Schema(
  {
    title: String,
    image: {
      name: String,
      size: Number,
      key: String,
      url: String,
    },
    description: String,
    audioDesc: [
      {
        lang: String,
        name: String,
        size: Number,
        key: String,
        url: String,
      },
    ],
    audioGuia: [
      {
        lang: String,
        name: String,
        size: Number,
        key: String,
        url: String,
      },
    ],
    author: String,
    suport: String,
    year: String,
    dimension: String,
    archived: Boolean,
  },
  {
    timestamps: true,
  }
);

artWorkSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    const imageFilePath = getPathbyUrl(this.image.url);

    const audioDescFiles = this.audioDesc?.map((audio) =>
      getPathbyUrl(audio.url)
    );
    const audioGuiaFiles = this.audioGuia?.map((audio) =>
      getPathbyUrl(audio.url)
    );

    const filesToDelete = [];

    if (audioDescFiles && audioDescFiles.length) {
      filesToDelete.push(...audioDescFiles);
    }

    if (audioGuiaFiles && audioGuiaFiles.length) {
      filesToDelete.push(...audioGuiaFiles);
    }

    if (imageFilePath) {
      filesToDelete.push(imageFilePath);
    }

    await deleteEngine[process.env.STORAGE_TYPE](filesToDelete);
  }
);

artWorkSchema.pre(
  "updateOne",
  { document: true, query: false },
  async function (next) {
    const oldArtwork = await ArtWork.findById(this._id);
    const filesToDelete = [];

    if (this.image.url !== oldArtwork.image.url) {
      // if the image has changed, delete the old image
      filesToDelete.push(getPathbyUrl(oldArtwork.image.url));
    }

    // Check if the audio files have changed
    if (
      JSON.stringify(oldArtwork.audioGuia) !== JSON.stringify(this.audioGuia)
    ) {
      // if the audio files have changed, delete the old audio files
      const urls = getOldFilePaths(oldArtwork.audioGuia, this.audioGuia);
      const pathsToDelete = urls.map((url) => getPathbyUrl(url));
      filesToDelete.push(...pathsToDelete);
    }

    if (
      JSON.stringify(oldArtwork.audioDesc) !== JSON.stringify(this.audioDesc)
    ) {
      const urls = getOldFilePaths(oldArtwork.audioDesc, this.audioDesc);
      const pathsToDelete = urls.map((url) => getPathbyUrl(url));
      filesToDelete.push(...pathsToDelete);
    }

    if (filesToDelete.length > 0) {
      await deleteEngine[process.env.STORAGE_TYPE](filesToDelete);
    }
  }
);

/**
 * Create a text index on the title, description, author, and year fields.
 * This allows for efficient text search queries on these fields.
 */
artWorkSchema.index({
  title: "text",
  description: "text",
  author: "text",
  year: "text",
});

/**
 * Mongoose model for the Artwork schema.
 * @type {Model<ArtWork>}
 */
const ArtWork = mongoose.model("ArtWork", artWorkSchema);

module.exports = ArtWork;
