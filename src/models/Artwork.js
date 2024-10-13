/**
 * @file Artwork.js
 * @description Mongoose model for the Artwork collection in the database.
 */

const mongoose = require("mongoose");
const { Schema } = mongoose;

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
    image: String,
    description: String,
    audioDesc: Array,
    audioGuia: Array,
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
