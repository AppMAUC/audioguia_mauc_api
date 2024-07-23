const mongoose = require("mongoose");
const { Schema } = mongoose;

const expositionSchema = new Schema({
    title: String,
    type: Number,
    image: String,
    description: String,
    artWorks: Array,
    place: String, 
    dateStarts: Date,
    dateEnds: Date,
    archived: Boolean
},
    {
        timestamps: true
    }
);

const Exposition = mongoose.model("Exposition", expositionSchema);

module.exports = Exposition;