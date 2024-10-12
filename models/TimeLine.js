/**
 * @file TimeLine.js
 * @description Mongoose model for the TimeLine collection.
 */

const mongoose = require("mongoose");
const { Schema } = mongoose;

/**
 * @typedef {Object} TimeLine
 * @property {string} title - The title of the timeline.
 * @property {string} description - The description of the timeline.
 * @property {Array} events - An array of events associated with the timeline.
 * @property {Date} createdAt - The date when the timeline was created.
 * @property {Date} updatedAt - The date when the timeline was last updated.
 */

/**
 * Mongoose schema for the TimeLine model.
 * @type {Schema}
 */
const timeLineSchema = new Schema(
  {
    title: String,
    description: String,
    events: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
  },
  {
    timestamps: true,
  }
);

/**
 * Create a text index on the title and description fields.
 * This allows for efficient text search queries on these fields.
 */
timeLineSchema.index({ title: "text", description: "text" });

/**
 * Mongoose model for the TimeLine schema.
 * @type {Model<TimeLine>}
 */
const TimeLine = mongoose.model("TimeLine", timeLineSchema);

module.exports = TimeLine;
