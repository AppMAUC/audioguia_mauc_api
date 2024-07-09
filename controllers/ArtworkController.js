const ArtWork = require('../models/ArtWork');
const mongoose = require('mongoose');

// Register Artwork
const registerArtWork = async (req, res) => {

    const { title, partial_desc, complete_desc, author, colection, suport, date, dimension } = req.body;


    const image = req.files && req.files['image'] ? req.files['image'][0].filename : req.file ? req.file : null;
    const audio_desc = req.files && req.files['audio_desc'] ? req.files['audio_desc'][0].filename : req.file ? req.file : null;

    const newArtWork = await ArtWork.create({
        title,
        partial_desc,
        complete_desc,
        audio_desc,
        author,
        colection,
        suport,
        date,
        dimension,
        image
    });

    // if artwork was created successfully, return the token
    if (!newArtWork) {
        res.status(422).json({ errors: ["Houve um erro, por favor tente mais tarde"] })
        return;
    };

    res.status(201).json(newArtWork);

};

// Get all artWorks
const getAllArtWorks = async (req, res) => {
    const artWorks = await ArtWork.find({}).sort([["date", -1]]).exec();
    return res.status(200).json(artWorks);
};

// Update an artWork
const updateArtWork = async (req, res) => {
    const { title, partial_desc, complete_desc, author, colection, suport, date, dimension } = req.body;
    const { id } = req.params;
    const artWork = await ArtWork.findById(new mongoose.Types.ObjectId(id));

    const image = req.files && req.files['image'] ? req.files['image'][0].filename : req.file ? req.file : null;
    const audio_desc = req.files && req.files['audio_desc'] ? req.files['audio_desc'][0].filename : req.file ? req.file : null;

    // Check if artwork exists
    if (!artWork) {
        res.status(404).json({ errors: ["Obra de Arte não encontrada."] });
        return;
    };

    if (title) {
        artWork.title = title;
    };
    if (partial_desc) {
        artWork.partial_desc = partial_desc;
    };
    if (complete_desc) {
        artWork.complete_desc = complete_desc;
    };
    if (audio_desc) {
        artWork.audio_desc = audio_desc;
    };
    if (author) {
        artWork.author = author;
    };
    if (colection) {
        artWork.colection = colection;
    };
    if (suport) {
        artWork.suport = suport;
    };
    if (date) {
        artWork.date = date;
    };
    if (dimension) {
        artWork.dimension = dimension;
    };

    if (image) {
        artWork.image = image;
    };

    await artWork.save();

    res.status(200).json(artWork);

};

// Get artWork by id
const getArtWorkById = async (req, res) => {
    const { id } = req.params;

    try {
        const artWork = await ArtWork.findById(new mongoose.Types.ObjectId(id));

        // Check if artWork exists
        if (!artWork) {
            res.status(404).json({ errors: ["Obra não encontrada"] });
            return;
        };

        res.status(200).json(artWork);
    } catch (error) {
        res.status(404).json({ errors: ["Obra não encontrada"] });
        return;
    }
}

// Remove artWork from DB
const deleteArtWork = async (req, res) => {
    const { id } = req.params;

    try {
        const artWork = await ArtWork.findById(new mongoose.Types.ObjectId(id));

        // Check if artWork exists
        if (!artWork) {
            res.status(404).json({ errors: ["Obra não encontrada."] });
            return;
        };

        await ArtWork.findByIdAndDelete(artWork._id);

        res.status(200).json({
            id: artWork._id,
            message: "Obra excluída com sucesso."
        });
    } catch (error) {
        res.status(404).json({ errors: ["Obra não encontrada"] });
        return;
    };
};
const searchArtWork = async (req, res) => {
    const { q } = req.query;
    const artWork = await ArtWork.find({
        $or: [
            { title: new RegExp(q, "i") }, // Busca por título com case-insensitive
            { author: new RegExp(q, "i") } // Busca por autor
        ]
    }).exec();
    res.status(200).json(artWork);
};

module.exports = {
    registerArtWork,
    deleteArtWork,
    updateArtWork,
    getArtWorkById,
    getAllArtWorks,
    searchArtWork
};