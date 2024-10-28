const Artist = require("../models/Artist");
const mongoose = require("mongoose");
const { getAllWithPaginate } = require("../utils/paginate");
const { verifyAudios } = require("../utils/handleFileValidations");
const { getFileObject } = require("../utils/multerFunctions");

/**
 * Registers a new artist.
 *
 * @async
 * @function registerArtist
 * @param {Object} req - Express request object.
 * @param {Object} req.body - Request body containing artist details.
 * @param {string} req.body.name - Name of the artist.
 * @param {string} req.body.birthDate - Birth date of the artist.
 * @param {string} req.body.biography - Biography of the artist.
 * @param {Object} req.files - Uploaded files.
 * @param {Object} req.files.image - Image file of the artist.
 * @param {Object} req.files.audioGuia - Audio file of the artist.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
const registerArtist = async (req, res, next) => {
  try {
    const { name, birthDate, biography, artWorks } = req.body;
    const { image: a, audioGuia: c } = req.files;
    const image = a ? getFileObject(a)[0] : null;
    const audioGuia = c ? getFileObject(c) : null;

    const newArtist = await Artist.create({
      name,
      biography,
      birthDate,
      image,
      audioGuia,
      artWorks,
    });

    if (!newArtist) {
      const error = new Error("Houve um erro, por favor tente mais tarde");
      error.statusCode = 500;
      throw error;
    }

    res.status(201).json({
      _id: newArtist._id,
      message: "Artista cadastrado com sucesso.",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Updates an existing artist.
 *
 * @async
 * @function updateArtist
 * @param {Object} req - Express request object.
 * @param {Object} req.body - Request body containing artist details.
 * @param {string} [req.body.name] - Name of the artist.
 * @param {string} [req.body.birthDate] - Birth date of the artist.
 * @param {string} [req.body.biography] - Biography of the artist.
 * @param {Object} [req.files] - Uploaded files.
 * @param {Object} [req.files.image] - Image file of the artist.
 * @param {Object} [req.files.audioGuia] - Audio file of the artist.
 * @param {Object} req.params - Request parameters.
 * @param {string} req.params.id - ID of the artist to update.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
const updateArtist = async (req, res, next) => {
  try {
    const { name, birthDate, biography, artWorks } = req.body;
    const { id } = req.params;
    const artist = await Artist.findById(new mongoose.Types.ObjectId(id));

    const { image: a, audioGuia: c } = req.files ? req.files : {};
    const image = a ? getFileObject(a)[0] : null;
    const audioGuia = c ? getFileObject(c) : null;

    if (!artist) {
      const error = new Error("Artista não encontrado.");
      error.statusCode = 404;
      throw error;
    }

    if (name) {
      artist.name = name;
    }
    if (birthDate) {
      artist.birthDate = birthDate;
    }
    if (artWorks) {
      artist.artWorks = artWorks;
    }
    if (biography) {
      artist.biography = biography;
    }
    if (audioGuia) {
      artist.audioGuia = verifyAudios(audioGuia, artist.audioGuia);
    }
    if (image) {
      artist.image = image;
    }

    await artist.updateOne({
      name: artist.name,
      birthDate: artist.birthDate,
      biography: artist.biography,
      audioGuia: artist.audioGuia,
      image: artist.image,
      artWorks: artist.artWorks,
    });

    res.status(200).json({
      _id: artist._id,
      data: artist,
      message: "Artista atualizado com sucesso.",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Deletes an existing artist.
 *
 * @async
 * @function deleteArtist
 * @param {Object} req - Express request object.
 * @param {Object} req.params - Request parameters.
 * @param {string} req.params.id - ID of the artist to delete.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
const deleteArtist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const artist = await Artist.findById(new mongoose.Types.ObjectId(id));

    if (!artist) {
      const error = new Error("Artista não encontrado.");
      error.statusCode = 404;
      throw error;
    }

    await artist.deleteOne();

    res.status(200).json({
      _id: artist._id,
      message: "Artista excluído com sucesso.",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Searches for artists by name.
 *
 * @async
 * @function searchArtist
 * @param {Object} req - Express request object.
 * @param {Object} req.query - Request query parameters.
 * @param {string} req.query.q - Search query for artist name.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
const searchArtist = async (req, res) => {
  const { q } = req.query;
  const artist = await Artist.find({ name: new RegExp(q, "i") }).exec();
  res.status(200).json(artist);
};

/**
 * Gets an artist by ID.
 *
 * @async
 * @function getArtistById
 * @param {Object} req - Express request object.
 * @param {Object} req.params - Request parameters.
 * @param {string} req.params.id - ID of the artist to retrieve.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
const getArtistById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const artist = await Artist.findById(new mongoose.Types.ObjectId(id))
      .populate("artWorks")
      .exec();

    // Check if artWork exists
    if (!artist) {
      const error = new Error("Artista não encontrado.");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json(artist);
  } catch (error) {
    next(error);
  }
};

/**
 * Gets all artists.
 *
 * @async
 * @function getAllArtists
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
const getAllArtists = async (req, res) => {
  const data = await getAllWithPaginate(Artist, req, [["date", -1]]);
  return res.status(200).json(data);
};

module.exports = {
  registerArtist,
  updateArtist,
  deleteArtist,
  searchArtist,
  getArtistById,
  getAllArtists,
};
