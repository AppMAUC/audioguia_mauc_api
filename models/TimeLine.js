const mongoose = require("mongoose");
const { Schema } = mongoose;

const timeLineSchema = new Schema({
        title: String,
        description: String,
        events: Array
    },
    {
        timestamps: true
    }
);

const Event = mongoose.model("TimeLine", timeLineSchema);

module.exports = Event;