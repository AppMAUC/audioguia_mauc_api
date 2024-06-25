const Artist = require("../models/Artist");
const mongoose = require("mongoose");

const registerArtist = async (req, res) => {

    const { name, description, birth_date, biography } = req.body;

    const image = req.files && req.files['image'] ? req.files['image'][0].filename : req.file ? req.file : null;
    const audio_desc = req.files && req.files['audio_desc'] ? req.files['audio_desc'][0].filename : req.file ? req.file : null;


    const newArtist = await Artist.create({
        image,
        name,
        description,
        birth_date,
        biography,
        audio_desc
    });


    if (!newArtist) {
        res.status(422).json({ errors: ["Houve um erro, por favor tente mais tarde"] });
        return;
    };

    res.status(201).json(newArtist);

};

const deleteArtist = async (req, res) => {
    const { id } = req.params;

    try {
        const artist = await Artist.findById(new mongoose.Types.ObjectId(id));

        if (!artist) {
            res.status(404).json({ errors: ["Artista não encontrada."] });
            return;
        };

        await Artist.findByIdAndDelete(artist._id);

        res.status(200).json({
            id: artist._id,
            message: "Artista excluído com sucesso."
        });
    } catch (error) {
        res.status(404).json({ errors: ["Artista não encontrada"] });
        return;
    };
};

const searchArtist = async (req, res) => {
    const { q } = req.query;
    const artist = await Artist.find({ name: new RegExp(q, "i") }).exec();
    res.status(200).json(artist);
};


const getAllArtists = async (req, res) => {
    const artists = await Artist.find({}).sort([["date", -1]]).exec();

    return res.status(200).json(artists);
};


const updateArtist = async (req, res) => {
    const { name, description, birth_date, biography } = req.body;
    const { id } = req.params;
    const artist = await Artist.findById(new mongoose.Types.ObjectId(id));

    const image = req.files && req.files['image'] ? req.files['image'][0].filename : req.file ? req.file : null;
    const audio_desc = req.files && req.files['audio_desc'] ? req.files['audio_desc'][0].filename : req.file ? req.file : null;


    if (!artist) {
        res.status(404).json({ errors: ["Atista não encontrado."] });
        return;
    };

    if (name) {
        artist.name = name;
    };
    if (description) {
        artist.description = description;
    };
    if (birth_date) {
        artist.birth_date = birth_date;
    };
    if (biography) {
        artist.biography = biography;
    };
    if (audio_desc) {
        artist.audio_desc = audio_desc;
    };
    if (image) {
        artist.image = image;
    };

    await artist.save();

    res.status(200).json(artist);

};

// Get artWork by id
const getArtistById = async (req, res) => {
    const { id } = req.params;

    try {
        const artist = await Artist.findById(new mongoose.Types.ObjectId(id));

        // Check if artWork exists
        if (!artist) {
            res.status(404).json({ errors: ["Artista não encontrado"] });
            return;
        };

        res.status(200).json(artist);
    } catch (error) {
        res.status(404).json({ errors: ["Artista não encontrado"] });
        return;
    }
}

module.exports = {
    registerArtist,
    deleteArtist,
    updateArtist,
    searchArtist,
    getAllArtists,
    getArtistById
};