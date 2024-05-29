const mongoose = require("mongoose");
const { Schema } = mongoose;

const ExpositionSchema = new Schema({
    title: String,
    description: String,
    artWork: Array,
    livingRoom: String,
    dateStarts: Date,
    dateEnds: Date,
},
    {
        timestamps: true
    }
);

const ArtWork = mongoose.model("Exposition", ExpositionSchema);

module.exports = ArtWork;