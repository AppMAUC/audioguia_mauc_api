const mongoose = require("mongoose");
const { Schema } = mongoose;

const artistSchema = new Schema({
        image: String,
        name: String,
        description: String,
        birth_date: Date,
        audio_desc: String,
        biography: String,
    },
    {
        timestamps: true
    }
);

const Artist = mongoose.model("Artist", artistSchema);

module.exports = Artist;