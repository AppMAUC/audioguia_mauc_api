/**
 * @file Event.js
 * @description Mongoose model for the Event collection.
 */

const mongoose = require("mongoose");
const { Schema } = mongoose;

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
    image: String, 
    description: String,
    date: Date,
    archived: Boolean,
  },
  {
    timestamps: true,
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
