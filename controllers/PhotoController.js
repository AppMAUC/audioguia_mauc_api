const Admin = require("../models/Admin");
const Photo = require("../models/Photo");

const mongoose = require("mongoose");

// Insert a photo, with an admin reladet to it

const insertPhoto = async (req, res) => {
    const { title } = req.body;
    const image = req.file.filename;


    const reqAdmin = req.admin;
    const admin = await Admin.findById(reqAdmin._id);

    // Create a photo
    const newPhoto = await Photo.create({
        image,
        title,
        adminId: admin._id,
        adminName: admin.name
    });

    // If photo was created successfully, return data
    if (!newPhoto) {
        res.status(422).json({ errors: ["Houve um problema, por favor tente mais tarde."] })
    };

    res.status(201).json(newPhoto);
};

// Remove photo from DB
const deletePhoto = async (req, res) => {
    const { id } = req.params;
    const reqAdmin = req.admin;

    try {
        const photo = await Photo.findById(new mongoose.Types.ObjectId(id));

        // Check if photo exists
        if (!photo) {
            res.status(404).json({ errors: ["Foto não encontrada."] });
            return;
        };

        // Check if photo belongs to admin
        if (!photo.adminId.equals(reqAdmin._id)) {
            res.status(404).json({ errors: ["Foto não encontrada. 2 "] });
            return;
        };

        await Photo.findByIdAndDelete(photo._id);

        res.status(200).json({
            id: photo._id,
            message: "Foto excluída com sucesso."
        });
    } catch (error) {
        res.status(404).json({ errors: ["Foto não encontrada"] });
        return;
    };
};

// Get all photos
const getAllPhotos = async (req, res) => {
    const photos = await Photo.find({}).sort([["createdAt", -1]]).exec();

    return res.status(200).json(photos);
};

// Get admin photos
const getAdminPhotos = async (req, res) => {
    const { id } = req.params;

    const photos = await Photo.find({ adminId: id }).sort([["createdAt", -1]]).exec();

    return res.status(200).json(photos);
}

// Get photo by id
const getPhotoById = async (req, res) => {
    const { id } = req.params;

    try {
        const photo = await Photo.findById(new mongoose.Types.ObjectId(id));

        if (!photo) {
            res.status(404).json({ errors: ["Foto não encontrada"] });
            return;
        };

        res.status(200).json(photo);
    } catch (error) {
        res.status(404).json({ errors: ["Foto não encontrada"] });
        return;
    };
    // Check if photo exists
};

// Update a photo
const updatePhoto = async (req, res) => {
    const { title } = req.body;
    const { id } = req.params;
    const reqAdmin = req.admin;
    const photo = await Photo.findById(id);

    // Check if photo exists
    if (!photo) {
        res.status(404).json({ errors: ["Foto não encontrada."] });
        return;
    }

    // Check if photo belongs to admin
    if (!photo.adminId.equals(reqAdmin._id)) {
        res.status(422).json({ errors: ["Ocorreu um erro, por favor tente novamente mais tarde."] });
        return;
    }

    if (title) {
        photo.title = title;
    };

    await photo.save();

    res.status(200).json({ photo, message: "Foto atualizada com sucesso" });
};

// Search photos by title
const searchPhotos = async (req, res) => {
    const { q } = req.query;
    const photos = await Photo.find({ title: new RegExp(q, "i") }).exec();
    res.status(200).json(photos);
};

module.exports = {
    insertPhoto,
    deletePhoto,
    getAllPhotos,
    getAdminPhotos,
    getPhotoById,
    updatePhoto,
    searchPhotos
};