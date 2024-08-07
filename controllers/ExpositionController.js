const Exposition = require('../models/Exposition');
const mongoose = require('mongoose');
const { deleteFiles, getFilesPaths, getFilePath } = require('../utils/removeFile');

// Register Exposition
const registerExposition = async (req, res) => {

    const { title, description, type, artWorks, place, dateStarts, dateEnds } = req.body;

    const image = req.files && req.files['image'] ? req.files['image'][0].filename : req.file ? req.file.filename : null;
    const archived = false;

    // Create exposition
    const newExposition = await Exposition.create({
        title,
        type,
        image,
        description,
        artWorks,
        place,
        dateStarts,
        dateEnds,
        archived
    });

    // if exposition was created successfully, return the token
    if (!newExposition) {
        res.status(422).json({ errors: ["Houve um erro, por favor tente mais tarde"] })
        return;
    };

    res.status(201).json(newExposition);

};

// Get all expositions
const getAllExpostitions = async (req, res) => {
    const expositions = await Exposition.find({}).sort([["createdAt", -1]]).exec();

    return res.status(200).json(expositions);
};

// Update an exposition
const updateExposition = async (req, res) => {
    const { title, description, artWorks, type, place, dateStarts, dateEnds, archived } = req.body;
    const { id } = req.params;
    const exposition = await Exposition.findById(new mongoose.Types.ObjectId(id));

    // Check if exposition exists
    if (!exposition) {
        res.status(404).json({ errors: ["Exposição não encontrada."] });
        return;
    };

    const image = req.files && req.files['image'] ? req.files['image'][0].filename : req.file ? req.file.filename : null;

    if (title) {
        exposition.title = title;
    };
    if (description) {
        exposition.description = description;
    };
    if (artWorks) {
        exposition.artWorks = artWorks;
    };
    if (place) {
        exposition.place = place;
    };
    if (dateEnds) {
        exposition.dateEnds = dateEnds;
    };
    if (dateStarts) {
        exposition.dateStarts = dateStarts;
    };
    if (type) {
        exposition.type = type;
    };
    if (image) {
        deleteFiles([getFilePath('image', 'expositions', exposition.image)]);
        exposition.image = image;
    };
    if (archived) {
        exposition.archived = archived;
    };

    await exposition.save();

    res.status(200).json(exposition);

};

// Get Exposition by id
const getExpositionById = async (req, res) => {
    const { id } = req.params;

    try {
        const exposition = await Exposition.findById(new mongoose.Types.ObjectId(id));

        // Check if exposition exists
        if (!exposition) {
            res.status(404).json({ errors: ["Exposição não encontrada"] });
            return;
        };

        res.status(200).json(exposition);
    } catch (error) {
        res.status(404).json({ errors: ["Exposição não encontrada"] });
        return;
    }
}

// Remove exposition from DB
const deleteExposition = async (req, res) => {
    const { id } = req.params;

    try {
        const exposition = await Exposition.findById(new mongoose.Types.ObjectId(id));

        // Check if expostion exists
        if (!exposition) {
            res.status(404).json({ errors: ["Exposição não encontrada."] });
            return;
        };

        deleteFiles(getFilesPaths({ images: [exposition.image] }, 'exposition'));

        await Exposition.findByIdAndDelete(exposition._id);

        res.status(200).json({
            id: exposition._id,
            message: "Exposição excluída com sucesso."
        });
    } catch (error) {
        res.status(404).json({ errors: ["Exposição não encontrada"] });
        return;
    };
};

const searchExpositions = async (req, res) => {
    const { q } = req.query;
    const expositions = await Exposition.find({ title: new RegExp(q, "i") }).exec();
    res.status(200).json(expositions);
};

module.exports = {
    registerExposition,
    deleteExposition,
    updateExposition,
    getExpositionById,
    getAllExpostitions,
    searchExpositions
};