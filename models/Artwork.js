const mongoose = require("mongoose");
const { Schema } = mongoose;

const artWorkSchema = new Schema({
    title: String,
    image: String,
    partialDesc: String,
    completeDesc: String,
    audioDesc: Array,
    audioGuia: Array,
    author: String,
    suport: String,
    year: String,
    dimension: String,
    archived: Boolean
},
    {
        timestamps: true
    }
);

const ArtWork = mongoose.model("ArtWork", artWorkSchema);

module.exports = ArtWork;