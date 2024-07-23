const mongoose = require("mongoose");
const { Schema } = mongoose;

const eventSchema = new Schema({
        image: String,
        title: String,
        description: String,
        date: Date,
        archived: Boolean
    },
    {
        timestamps: true
    }
);

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;