const ArtWork = require("../models/ArtWork");
const mongoose = require("mongoose");
const { getFileObject } = require("../utils/multerFunctions");
const { verifyAudios } = require("../utils/handleFileValidations");
const { getAllWithPaginate } = require("../utils/paginate");

/**
 * @typedef audio
 * @property {string} lang - The language of the audio file.
 * @property {string} name - The name of the audio file.
 * @property {number} size - The size of the audio file.
 * @property {string} key - The key of the audio file.
 * @property {string} url - The URL of the audio file.
 */

/**
 * @typedef image
 * @property {string} name - The name of the image file.
 * @property {number} size - The size of the image file.
 * @property {string} key - The key of the image file.
 * @property {string} url - The URL of the image file.
 */

/**
 * @typedef reqFiles
 * @property {audio[]} audioDesc - The audio description files for the artwork.
 * @property {audio[]} audioGuia - The audio guide files for the artwork.
 * @property {image[]} image - The image file for the artwork.
 */

/**
 * Registers a new artwork.
 * @param {Object} req - The request object.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.title - The title of the artwork.
 * @param {string} req.body.description - The description of the artwork.
 * @param {string} req.body.author - The author of the artwork.
 * @param {string} req.body.suport - The support of the artwork.
 * @param {string} req.body.year - The year of the artwork.
 * @param {string} req.body.dimension - The dimensions of the artwork.
 * @param {Object} req.files - The files uploaded with the request.
 * @param {audio[]} req.files.audioDesc - The audio description files for the artwork.
 * @param {audio[]} req.files.audioGuia - The audio guide files for the artwork.
 * @param {image[]} req.files.image - The image file for the artwork.
 * @param {Object} res - The response object.
 * @returns {Promise<void>}
 */
const registerArtWork = async (req, res, next) => {
  try {
    const { title, description, author, suport, year, dimension } = req.body;

    const { image: a, audioDesc: b, audioGuia: c } = req.files;
    const image = a ? getFileObject(a)[0] : null;
    const audioDesc = b ? getFileObject(b) : null;
    const audioGuia = c ? getFileObject(c) : null;
    const archived = false;

    const newArtWork = await ArtWork.create({
      title,
      image,
      description,
      audioDesc,
      audioGuia,
      author,
      suport,
      year,
      dimension,
      archived,
    });

    // if artwork was created successfully, return the token
    if (!newArtWork) {
      const error = new Error("Houve um erro, por favor tente mais tarde");
      error.statusCode = 500;
      throw error;
    }

    res.status(201).json({
      _id: newArtWork._id,
      message: "Obra de Arte cadastrada com sucesso.",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Updates an existing artwork.
 * @param {Object} req - The request object.
 * @param {Object} req.body - The request body.
 * @param {string} [req.body.title] - The title of the artwork.
 * @param {string} [req.body.description] - The description of the artwork.
 * @param {string} [req.body.author] - The author of the artwork.
 * @param {string} [req.body.suport] - The support of the artwork.
 * @param {number} [req.body.year] - The year of the artwork.
 * @param {string} [req.body.dimension] - The dimensions of the artwork.
 * @param {boolean} [req.body.archived] - The archived status of the artwork.
 * @param {Object} [req.files] - The files uploaded with the request.
 * @param {Array} [req.files.audioDesc] - The audio description files for the artwork.
 * @param {Array} [req.files.audioGuia] - The audio guide files for the artwork.
 * @param {Array} [req.files.image] - The image file for the artwork.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.id - The ID of the artwork to update.
 * @param {Object} res - The response object.
 * @returns {Promise<void>}
 */
const updateArtWork = async (req, res, next) => {
  try {
    const { title, description, author, suport, year, dimension, archived } =
      req.body;
    const { id } = req.params;
    const artWork = await ArtWork.findById(new mongoose.Types.ObjectId(id));

    const { image: a, audioDesc: b, audioGuia: c } = req.files;
    const image = a ? getFileObject(a)[0] : null;
    const audioDesc = b ? getFileObject(b) : null;
    const audioGuia = c ? getFileObject(c) : null;

    // Check if artwork exists
    if (!artWork) {
      const error = new Error("Obra de Arte não encontrada.");
      error.statusCode = 404;
      throw error;
    }

    if (title) {
      artWork.title = title;
    }
    if (description) {
      artWork.description = description;
    }

    if (audioDesc) {
      artWork.audioDesc = verifyAudios(audioDesc, artWork.audioDesc);
    }

    if (audioGuia) {
      artWork.audioGuia = verifyAudios(audioGuia, artWork.audioGuia);
    }

    if (author) {
      artWork.author = author;
    }
    if (suport) {
      artWork.suport = suport;
    }
    if (year) {
      artWork.year = year;
    }
    if (dimension) {
      artWork.dimension = dimension;
    }
    if (image) {
      artWork.image = image;
    }
    if (archived) {
      artWork.archived = archived;
    }

    await artWork.updateOne({
      title: artWork.title,
      description: artWork.description,
      audioDesc: artWork.audioDesc,
      audioGuia: artWork.audioGuia,
      author: artWork.author,
      suport: artWork.suport,
      dimension: artWork.dimension,
      image: artWork.image,
      archived: artWork.archived,
    });

    res.status(200).json({
      _id: artWork._id,
      data: artWork,
      message: "Obra de Arte atualizada com sucesso.",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Deletes an artwork by its ID.
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.id - The ID of the artwork to delete.
 * @param {Object} res - The response object.
 * @returns {Promise<void>}
 */
const deleteArtWork = async (req, res, next) => {
  try {
    const { id } = req.params;
    const artWork = await ArtWork.findById(new mongoose.Types.ObjectId(id));

    // Check if artWork exists
    if (!artWork) {
      const error = new Error("Obra não encontrada.");
      error.statusCode = 404;
      throw error;
    }

    await artWork.deleteOne();

    res.status(200).json({
      _id: artWork._id,
      message: "Obra excluída com sucesso.",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Searches for artworks by title or author.
 * @param {Object} req - The request object.
 * @param {Object} req.query - The request query parameters.
 * @param {string} req.query.q - The search query.
 * @param {Object} res - The response object.
 * @returns {Promise<void>}
 */
const searchArtWork = async (req, res) => {
  const { q } = req.query;
  const artWork = await ArtWork.find({
    $or: [
      { title: new RegExp(q, "i") }, // Busca por título com case-insensitive
      { author: new RegExp(q, "i") }, // Busca por autor
    ],
  }).exec();
  res.status(200).json(artWork);
};

/**
 * Retrieves an artwork by its ID.
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.id - The ID of the artwork to retrieve.
 * @param {Object} res - The response object.
 * @returns {Promise<void>}
 */
const getArtWorkById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const artWork = await ArtWork.findById(new mongoose.Types.ObjectId(id));

    // Check if artWork exists
    if (!artWork) {
      const error = new Error("Obra não encontrada.");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json(artWork);
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves all artworks.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>}
 */
const getAllArtWorks = async (req, res) => {
  const artWorks = await getAllWithPaginate(ArtWork, req, [["title", 1]]);
  return res.status(200).json(artWorks);
};

module.exports = {
  registerArtWork,
  updateArtWork,
  deleteArtWork,
  searchArtWork,
  getArtWorkById,
  getAllArtWorks,
};
