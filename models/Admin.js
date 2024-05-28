const mongoose = require("mongoose");
const { Schema } = mongoose;

const adminSchema = new Schema({
        name: String,
        email: String,
        password: String,
        profileImage: String,
        accessLevel: Number,
    },
    {
        timestamps: true
    }
);

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;