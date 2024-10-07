/**
 * @file Artist.js
 * @description Mongoose model for the Artist collection.
 */

const mongoose = require("mongoose");
const { Schema } = mongoose;

/**
 * @typedef {Object} Artist
 * @property {string} image - URL or path to the artist's image.
 * @property {string} name - Name of the artist.
 * @property {string} description - Short description of the artist.
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
    image: String,
    name: String,
    artWorks: Array,
    description: String,
    biography: String,
    audioGuia: Array,
    birthDate: Date,
  },
  {
    timestamps: true,
  }
);

/**
 * Create a text index on the name, description, and biography fields.
 * This allows for efficient text search queries on these fields.
 */
artistSchema.index({ name: "text", description: "text", biography: "text" });

/**
 * Mongoose model for the Artist schema.
 * @type {Model<Artist>}
 */
const Artist = mongoose.model("Artist", artistSchema);

module.exports = Artist;
