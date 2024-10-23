/**
 * @file Event.js
 * @description Mongoose model for the Event collection.
 */

const mongoose = require("mongoose");
const { Schema } = mongoose;
const { getPathbyUrl, deleteEngine } = require("../utils/deleteFiles");

/**
 * @typedef {Object} Event
 * @property {string} image - URL or path to the event image.
 * @property {string} title - Title of the event.
 * @property {string} description - Description of the event.
 * @property {Date} date - Date of the event.
 * @property {boolean} archived - Indicates if the event is archived.
 * @property {Date} createdAt - Timestamp when the event was created.
 * @property {Date} updatedAt - Timestamp when the event was last updated.
 */

/**
 * Mongoose schema for the Event collection.
 * @type {Schema}
 */
const eventSchema = new Schema(
  {
    title: String,
    image: {
      name: String,
      size: Number,
      key: String,
      url: String,
    },
    description: String,
    date: Date,
    archived: Boolean,
  },
  {
    timestamps: true,
  }
);

eventSchema.pre(
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

eventSchema.pre(
  "updateOne",
  { document: true, query: false },
  async function (next) {
    const oldEvent = await Event.findById(this._id);
    const filesToDelete = [];

    if (this.image.url !== oldEvent.image.url) {
      // if the image has changed, delete the old image
      filesToDelete.push(getPathbyUrl(oldEvent.image.url));
    }

    if (filesToDelete.length > 0) {
      await deleteEngine[process.env.STORAGE_TYPE](filesToDelete);
    }
  }
);
/**
 * Create a text index on the title and description fields.
 * This allows for efficient text search queries on these fields.
 */
eventSchema.index({ title: "text", description: "text" });

/**
 * Mongoose model for the Event schema.
 * @type {Model<Event>}
 */
const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
