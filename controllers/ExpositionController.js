const Exposition = require('../models/Exposition');
const mongoose = require('mongoose');

// Register Exposition
const registerExposition = async (req, res) => {

    const { title, description, artWork, livingRoom, dateStarts, dateEnds } = req.body;

    // Create exposition
    const newExposition = await Exposition.create({
        title,
        description,
        artWork,
        livingRoom,
        dateStarts,
        dateEnds
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
    const { title, description, artWork, livingRoom, dateStarts, dateEnds } = req.body;
    const { id } = req.params;
    const exposition = await Exposition.findById(new mongoose.Types.ObjectId(id));

    // Check if exposition exists
    if (!exposition) {
        res.status(404).json({ errors: ["Exposição não encontrada."] });
        return;
    };

    if (title) {
        exposition.title = title;
    };
    if (description) {
        exposition.description = description;
    };
    if (artWork) {
        exposition.artWork = artWork;
    };
    if (livingRoom) {
        exposition.livingRoom = livingRoom;
    };
    if (dateStarts) {
        exposition.dateEnds = dateEnds;
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