/**
 * @file Artist.js
 * @description Mongoose model for the Artist collection.
 */

const mongoose = require("mongoose");
const { Schema } = mongoose;
const {
  deleteEngine,
  getPathbyUrl,
  getOldFilePaths,
} = require("../utils/deleteFiles");

/**
 * @typedef {Object} Artist
 * @property {string} image - URL or path to the artist's image.
 * @property {string} name - Name of the artist.
 * @property {string} biography - Detailed biography of the artist.
 * @property {Array} audioGuia - Array of audio descriptions related to the artist.
 * @property {Date} birthDate - Birth date of the artist.
 * @property {Date} createdAt - Timestamp when the artist document was created.
 * @property {Date} updatedAt - Timestamp when the artist document was last updated.
 */

/**
 * Mongoose schema for the Artist collection.
 * @type {Schema}
 */
const artistSchema = new Schema(
  {
    name: String,
    image: {
      name: String,
      size: Number,
      key: String,
      url: String,
    },
    artWorks: [{ type: mongoose.Schema.Types.ObjectId, ref: "ArtWork" }],
    biography: String,
    audioGuia: [
      {
        lang: String,
        name: String,
        size: Number,
        key: String,
        url: String,
      },
    ],
    birthDate: Date,
  },
  {
    timestamps: true,
  }
);

artistSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    const imageFilePath = getPathbyUrl(this.image.url);

    const audioGuiaFiles = this.audioGuia?.map((audio) =>
      getPathbyUrl(audio.url)
    );

    const filesToDelete = [];

    if (audioGuiaFiles && audioGuiaFiles.length) {
      filesToDelete.push(...audioGuiaFiles);
    }

    if (imageFilePath) {
      filesToDelete.push(imageFilePath);
    }

    await deleteEngine[process.env.STORAGE_TYPE](filesToDelete);
  }
);

artistSchema.pre(
  "updateOne",
  { document: true, query: false },
  async function (next) {
    const oldArtist = await Artist.findById(this._id);
    const filesToDelete = [];

    if (this.image.url !== oldArtist.image.url) {
      // if the image has changed, delete the old image
      filesToDelete.push(getPathbyUrl(oldArtist.image.url));
    }

    // Check if the audio files have changed
    if (
      JSON.stringify(oldArtist.audioGuia) !== JSON.stringify(this.audioGuia)
    ) {
      // if the audio files have changed, delete the old audio files
      const urls = getOldFilePaths(oldArtist.audioGuia, this.audioGuia);
      const pathsToDelete = urls.map((url) => getPathbyUrl(url));
      filesToDelete.push(...pathsToDelete);
    }

    if (filesToDelete.length > 0) {
      await deleteEngine[process.env.STORAGE_TYPE](filesToDelete);
    }
  }
);

/**
 * Create a text index on the name, description, and biography fields.
 * This allows for efficient text search queries on these fields.
 */
artistSchema.index({ name: "text", biography: "text" });

/**
 * Mongoose model for the Artist schema.
 * @type {Model<Artist>}
 */
const Artist = mongoose.model("Artist", artistSchema);

module.exports = Artist;
