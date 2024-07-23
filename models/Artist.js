const mongoose = require("mongoose");
const { Schema } = mongoose;

const artistSchema = new Schema({
        image: String,
        name: String,
        description: String,
        biography: String,
        audioDesc: Array,
        birthDate: Date,
    },
    {
        timestamps: true
    }
);

const Artist = mongoose.model("Artist", artistSchema);

module.exports = Artist;