/**
 * @file Admin.js
 * @description Mongoose model for the Admin collection.
 */
const mongoose = require("mongoose");
const { Schema } = mongoose;
const { deleteEngine, getPathbyUrl } = require("../utils/deleteFiles");

/**
 * @typedef {Object} Admin
 * @property {string} name - The name of the admin.
 * @property {string} email - The email of the admin.
 * @property {string} password - The password of the admin.
 * @property {string} image - The image URL of the admin.
 * @property {string} accessLevel - The access level of the admin.
 * @property {string} refreshToken - The refresh token of the admin.
 * @property {Date} createdAt - The date when the admin was created.
 * @property {Date} updatedAt - The date when the admin was last updated.
 */

/**
 * Mongoose schema for the Admin collection.
 * @type {Schema}
 */
const adminSchema = new Schema(
  {
    name: String,
    email: String,
    password: String,
    image: {
      name: String,
      size: Number,
      key: String,
      url: String,
    },
    accessLevel: {
      type: Number,
      enum: [1, 2], // 1: Gerenciar administradores e conteúdo, 2: Somente conteúdo
      required: true,
    },
    refreshToken: String,
  },
  {
    timestamps: true,
  }
);

adminSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    const imageFilePath = getPathbyUrl(this.image.url);

    const filesToDelete = [];

    if (imageFilePath) {
      filesToDelete.push(imageFilePath);
    }

    await deleteEngine[process.env.STORAGE_TYPE](filesToDelete);
  }
);

adminSchema.pre(
  "updateOne",
  { document: true, query: false },
  async function (next) {
    const oldAdmin = await Admin.findById(this._id);
    const filesToDelete = [];

    if (this.image.url !== oldAdmin.image.url) {
      // if the image has changed, delete the old image
      filesToDelete.push(getPathbyUrl(oldAdmin.image.url));
    }

    if (filesToDelete.length > 0) {
      await deleteEngine[process.env.STORAGE_TYPE](filesToDelete);
    }
  }
);

/**
 * Create a text index on the name, email fields.
 * This allows for efficient text search queries on these fields.
 */
adminSchema.index({ name: "text", email: "text" });

/**
 * Mongoose model for the Admin schema.
 * @type {Model<Admin>}
 */
const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
