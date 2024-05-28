const mongoose = require("mongoose");

const {Schema} = mongoose;

const photoSchema = new Schema(
    {
        image: String,
        title: String,
        comments: Array,
        adminId: mongoose.ObjectId,
        adminName: String
    },
    {
        timestamps: true
    }
);

const Photo = mongoose.model("Photo", photoSchema);

module.exports = Photo;