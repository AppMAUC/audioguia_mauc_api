const ArtWork = require("../models/ArtWork");
const mongoose = require("mongoose");
const { getFileNames } = require("../utils/multerFunctions");
const {
  deleteFiles,
  getFilesPaths,
  getFilePath,
  parseFileName,
  createElements,
  rollBackFiles,
} = require("../utils/deleteFiles");

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
 * @param {Array} req.files.audioDesc - The audio description files for the artwork.
 * @param {Array} req.files.audioGuia - The audio guide files for the artwork.
 * @param {Array} req.files.image - The image file for the artwork.
 * @param {Object} res - The response object.
 * @returns {Promise<void>}
 */
const registerArtWork = async (req, res) => {
  const { title, description, author, suport, year, dimension } = req.body;

  const image =
    req.files && req.files["image"]
      ? req.files["image"][0].filename
      : req.file
      ? req.file.filename
      : null;
  const audioDesc =
    req.files && req.files["audioDesc"]
      ? getFileNames(req.files["audioDesc"])
      : req.file
      ? req.file.filename
      : null;
  const audioGuia =
    req.files && req.files["audioGuia"]
      ? getFileNames(req.files["audioGuia"])
      : req.file
      ? req.file.filename
      : null;
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
    rollBackFiles(req);
    res
      .status(422)
      .json({ errors: ["Houve um erro, por favor tente mais tarde"] });
    return;
  }

  res.status(201).json(newArtWork);
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
const updateArtWork = async (req, res) => {
  const { title, description, author, suport, year, dimension, archived } =
    req.body;
  const { id } = req.params;
  const artWork = await ArtWork.findById(new mongoose.Types.ObjectId(id));

  const image =
    req.files && req.files["image"]
      ? req.files["image"][0].filename
      : req.file
      ? req.file
      : null;
  const audioDesc =
    req.files && req.files["audioDesc"]
      ? getFileNames(req.files["audioDesc"])
      : req.file
      ? req.file
      : null;
  const audioGuia =
    req.files && req.files["audioGuia"]
      ? getFileNames(req.files["audioGuia"])
      : req.file
      ? req.file
      : null;

  // Check if artwork exists
  if (!artWork) {
    rollBackFiles(req);
    res.status(404).json({ errors: ["Obra de Arte não encontrada."] });
    return;
  }

  if (title) {
    artWork.title = title;
  }
  if (description) {
    artWork.description = description;
  }
  if (audioDesc) {
    let data = artWork.audioDesc;

    if (audioDesc.length > 1) {
      data = audioDesc;
      deleteFiles(getFilesPaths({ audios: artWork.audioDesc }, "artworks"));
    }

    // Veio um arquivo de áudio e nenhum existente
    if (audioDesc.length === 1 && !req.body.audioDesc) {
      deleteFiles(getFilesPaths({ audios: artWork.audioDesc }));
      data = audioDesc;
    }

    if (audioDesc && req.body.audioDesc) {
      const { audioDesc: previousAudioDesc } = req.body;
      const paths = getFilesPaths({ audios: artWork.audioDesc }, "artworks");
      const { language } = parseFileName(previousAudioDesc);

      const oldAudio = paths.filter((path) => !path.includes(language));

      deleteFiles(oldAudio);

      data = [...audioDesc, previousAudioDesc];
    }

    artWork.audioDesc = data;
  }
  if (audioGuia) {
    let data = artWork.audioGuia;

    if (audioGuia.length > 1) {
      data = audioGuia;
      deleteFiles(getFilesPaths({ audios: artWork.audioGuia }));
    }

    // Veio um arquivo de áudio e nenhum existente
    if (audioGuia.length === 1 && !req.body.audioGuia) {
      deleteFiles(getFilesPaths({ audios: artWork.audioGuia }));
      data = audioGuia;
    }

    if (audioGuia && req.body.audioGuia) {
      const { audioGuia: previousAudioGuia } = req.body;
      const paths = getFilesPaths({ audios: artWork.audioGuia });
      const { language } = parseFileName(previousAudioGuia);

      const oldAudio = paths.filter((path) => !path.includes(language));

      deleteFiles(oldAudio);

      data = [...audioGuia, previousAudioGuia];
    }

    artWork.audioGuia = data;
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
    deleteFiles([getFilePath("images", artWork.image)]);
    artWork.image = image;
  }
  if (archived) {
    artWork.archived = archived;
  }

  await artWork.save();

  res.status(200).json(artWork);
};

/**
 * Deletes an artwork by its ID.
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.id - The ID of the artwork to delete.
 * @param {Object} res - The response object.
 * @returns {Promise<void>}
 */
const deleteArtWork = async (req, res) => {
  const { id } = req.params;

  try {
    const artWork = await ArtWork.findById(new mongoose.Types.ObjectId(id));

    // Check if artWork exists
    if (!artWork) {
      res.status(404).json({ errors: ["Obra não encontrada."] });
      return;
    }
    deleteFiles(
      getFilesPaths(
        createElements(
          [...artWork.audioDesc, ...artWork.audioGuia],
          [artWork.image]
        )
      )
    );

    await ArtWork.findByIdAndDelete(artWork._id);

    res.status(200).json({
      id: artWork._id,
      message: "Obra excluída com sucesso.",
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ errors: ["Obra não encontrada"] });
    return;
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
const getArtWorkById = async (req, res) => {
  const { id } = req.params;

  try {
    const artWork = await ArtWork.findById(new mongoose.Types.ObjectId(id));

    // Check if artWork exists
    if (!artWork) {
      res.status(404).json({ errors: ["Obra não encontrada"] });
      return;
    }

    res.status(200).json(artWork);
  } catch (error) {
    res.status(404).json({ errors: ["Obra não encontrada"] });
    return;
  }
};

/**
 * Retrieves all artworks.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>}
 */
const getAllArtWorks = async (req, res) => {
  const artWorks = await ArtWork.find({})
    .sort([["year", -1]])
    .exec();
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
