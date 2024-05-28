const mongoose = require("mongoose");
const { Schema } = mongoose;

const artWorkSchema = new Schema({
        image: String,
        title: String,
        partial_desc: String,
        complete_desc: String,
        audio_desc: Audio,
        author: String,
        colection: String,
        suport: String,
        data: Date,
        dimentions: String
    },
    {
        timestamps: true
    }
);

const ArtWork = mongoose.model("ArtWork", artWorkSchema);

module.exports = ArtWork;