/**
 * @file Exposition.js
 * @description Mongoose model for the Exposition collection.
 */

const mongoose = require("mongoose");
const { Schema } = mongoose;
const { deleteEngine, getPathbyUrl } = require("../utils/deleteFiles");

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
    image: {
      name: String,
      size: Number,
      key: String,
      url: String,
    },
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

expositionSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    const imageFilePath = getPathbyUrl(this.image.url);

    const filesToDelete = [];

    if (imageFilePath) {
      filesToDelete.push(imageFilePath);
    }

    await deleteEngine[process.env.STORAGE_TYPE](filesToDelete);
  }
);

expositionSchema.pre(
  "updateOne",
  { document: true, query: false },
  async function (next) {
    const oldExposition = await Exposition.findById(this._id);
    const filesToDelete = [];

    if (this.image.url !== oldExposition.image.url) {
      // if the image has changed, delete the old image
      filesToDelete.push(getPathbyUrl(oldExposition.image.url));
    }

    if (filesToDelete.length > 0) {
      await deleteEngine[process.env.STORAGE_TYPE](filesToDelete);
    }
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
