const ArtWork = require('../models/ArtWork');
const mongoose = require('mongoose');
const { getFileNames } = require('../utils/multer');
const { deleteFiles, getFilesPaths, getFilePath, createElements } = require('../utils/removeFile');
// Register Artwork
const registerArtWork = async (req, res) => {

    const { title, partialDesc, completeDesc, author, suport, year, dimension } = req.body;

    const image = req.files && req.files['image'] ? req.files['image'][0].filename : req.file ? req.file.filename : null;
    const audioDesc = req.files && req.files['audioDesc'] ? getFileNames(req.files['audioDesc']) : req.file ? req.file.filename : null;
    const archived = false;

    const newArtWork = await ArtWork.create({
        title,
        image,
        partialDesc,
        completeDesc,
        audioDesc,
        author,
        suport,
        year,
        dimension,
        archived
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
    const artWorks = await ArtWork.find({}).sort([["year", -1]]).exec();
    return res.status(200).json(artWorks);
};

// Update an artWork
const updateArtWork = async (req, res) => {
    const { title, partialDesc, completeDesc, author, suport, year, dimension, archived } = req.body;
    const { id } = req.params;
    const artWork = await ArtWork.findById(new mongoose.Types.ObjectId(id));

    const image = req.files && req.files['image'] ? req.files['image'][0].filename : req.file ? req.file : null;
    const audioDesc = req.files && req.files['audioDesc'] ? getFileNames(req.files['audioDesc']) : req.file ? req.file : null;

    // Check if artwork exists
    if (!artWork) {
        res.status(404).json({ errors: ["Obra de Arte não encontrada."] });
        return;
    };

    if (title) {
        artWork.title = title;
    };
    if (partialDesc) {
        artWork.partialDesc = partialDesc;
    };
    if (completeDesc) {
        artWork.completeDesc = completeDesc;
    };
    if (audioDesc) {

        let data = artWork.audioDesc;

        if (audioDesc.length > 1) {
            data = audioDesc;
            deleteFiles(getFilesPaths({ audios: artWork.audioDesc }, 'artworks'));
        }

        if (audioDesc && req.body.audioDesc) {
            const { audioDesc: previousAudioDesc } = req.body;
            const paths = getFilesPaths({ audios: artWork.audioDesc }, 'artworks');
            const audioType = previousAudioDesc.match(/\-(br|en)/)[1];

            const oldAudio = paths.filter((path) => !path.includes(audioType));

            deleteFiles(oldAudio);

            data = [...audioDesc, previousAudioDesc];
        }
        
        artWork.audioDesc = data;
    };
    if (author) {
        artWork.author = author;
    };
    if (suport) {
        artWork.suport = suport;
    };
    if (year) {
        artWork.year = year;
    };
    if (dimension) {
        artWork.dimension = dimension;
    };
    if (image) {
        deleteFiles([getFilePath('image', 'artworks', artWork.image)]);
        artWork.image = image;
    };
    if (archived) {
        artWork.archived = archived;
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


        deleteFiles(getFilesPaths(createElements(artWork.audioDesc, [artWork.image]), 'artworks'));

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