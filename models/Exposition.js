/**
 * @file Exposition.js
 * @description Mongoose model for the Exposition collection.
 */

const mongoose = require("mongoose");
const { Schema } = mongoose;

/**
 * @typedef {Object} Exposition
 * @property {string} title - The title of the exposition.
 * @property {number} type - The type of the exposition.
 * @property {string} image - The image URL of the exposition.
 * @property {string} description - The description of the exposition.
 * @property {Array} artWorks - The list of artworks in the exposition.
 * @property {string} place - The place where the exposition is held.
 * @property {Date} dateStarts - The start date of the exposition.
 * @property {Date} dateEnds - The end date of the exposition.
 * @property {boolean} archived - Indicates if the exposition is archived.
 * @property {Date} createdAt - The date when the exposition was created.
 * @property {Date} updatedAt - The date when the exposition was last updated.
 */

/**
 * Mongoose schema for the Exposition collection.
 * @type {Schema}
 */
const expositionSchema = new Schema(
  {
    title: String,
    type: {
      type: Number,
      enum: [1, 2], // 1: Expo de longa duração , 2: Expo temporária ( ou curta duração)
      required: true,
    },
    image: String,
    description: String,
    artWorks: [{ type: mongoose.Schema.Types.ObjectId, ref: "ArtWork" }],
    place: String,
    dateStarts: Date,
    dateEnds: Date,
    archived: Boolean,
  },
  {
    timestamps: true,
  }
);

/**
 * Create a text index on the title, description, place, and type fields.
 * This allows for efficient text search queries on these fields.
 */
expositionSchema.index({
  title: "text",
  description: "text",
  place: "text",
  type: "text",
});

/**
 * Mongoose model for the Exposition collection.
 * @type {mongoose.Model<Exposition>}
 */
const Exposition = mongoose.model("Exposition", expositionSchema);

module.exports = Exposition;
