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

const TimeLine = mongoose.model("TimeLine", timeLineSchema);

module.exports = TimeLine;