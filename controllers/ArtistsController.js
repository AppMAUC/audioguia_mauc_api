const Artist = require("../models/Artist");
const mongoose = require("mongoose");
const { getFileNames } = require("../utils/multerFunctions");
const {
  deleteFiles,
  getFilesPaths,
  getFilePath,
  createElements,
  parseFileName,
  rollBackFiles,
} = require("../utils/deleteFiles");

/**
 * Registers a new artist.
 *
 * @async
 * @function registerArtist
 * @param {Object} req - Express request object.
 * @param {Object} req.body - Request body containing artist details.
 * @param {string} req.body.name - Name of the artist.
 * @param {string} req.body.description - Description of the artist.
 * @param {string} req.body.birthDate - Birth date of the artist.
 * @param {string} req.body.biography - Biography of the artist.
 * @param {Object} req.files - Uploaded files.
 * @param {Object} req.files.image - Image file of the artist.
 * @param {Object} req.files.audioGuia - Audio file of the artist.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
const registerArtist = async (req, res) => {
  const { name, description, birthDate, biography, artWorks } = req.body;
  const image =
    req.files && req.files["image"]
      ? req.files["image"][0].filename
      : req.file
      ? req.file.filename
      : null;
  const audioGuia =
    req.files && req.files["audioGuia"]
      ? getFileNames(req.files["audioGuia"])
      : req.file
      ? req.file.filename
      : null;

  const newArtist = await Artist.create({
    name,
    description,
    biography,
    birthDate,
    image,
    audioGuia,
    artWorks,
  });

  if (!newArtist) {
    rollBackFiles(req);
    res
      .status(422)
      .json({ errors: ["Houve um erro, por favor tente mais tarde"] });
    return;
  }

  res.status(201).json(newArtist);
};

/**
 * Updates an existing artist.
 *
 * @async
 * @function updateArtist
 * @param {Object} req - Express request object.
 * @param {Object} req.body - Request body containing artist details.
 * @param {string} [req.body.name] - Name of the artist.
 * @param {string} [req.body.description] - Description of the artist.
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
const updateArtist = async (req, res) => {
  const { name, description, birthDate, biography, artWorks } = req.body;
  const { id } = req.params;
  const artist = await Artist.findById(new mongoose.Types.ObjectId(id));

  const image =
    req.files && req.files["image"]
      ? req.files["image"][0].filename
      : req.file
      ? req.file.filename
      : null;
  const audioGuia =
    req.files && req.files["audioGuia"]
      ? getFileNames(req.files["audioGuia"])
      : req.file
      ? req.file.filename
      : null;

  if (!artist) {
    rollBackFiles(req);
    res.status(404).json({ errors: ["Artista não encontrado."] });
    return;
  }

  if (name) {
    artist.name = name;
  }
  if (description) {
    artist.description = description;
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
    let data = artist.audioGuia;

    // Vieram mais de um arquivo de audio
    if (audioGuia.length > 1) {
      data = audioGuia;
      deleteFiles(getFilesPaths({ audios: artist.audioGuia }));
    }
    // Veio um arquivo de áudio e nenhum existente
    if (audioGuia.length === 1 && !req.body.audioGuia) {
      deleteFiles(getFilesPaths({ audios: artist.audioGuia }));
      data = audioGuia;
    }

    // Veio um arquivo de áudio e um existente
    if (audioGuia && req.body.audioGuia) {
      const { audioGuia: previousAudioGuia } = req.body;
      const paths = getFilesPaths({ audios: artist.audioGuia });
      const { language } = parseFileName(previousAudioGuia);

      const oldAudio = paths.filter((path) => !path.includes(language));

      deleteFiles(oldAudio);

      data = [...audioGuia, previousAudioGuia];
    }

    artist.audioGuia = data;
  }
  if (image) {
    deleteFiles([getFilePath("images", artist.image)]);
    artist.image = image;
  }

  await artist.save();

  res.status(200).json(artist);
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
const deleteArtist = async (req, res) => {
  const { id } = req.params;

  try {
    const artist = await Artist.findById(new mongoose.Types.ObjectId(id));

    if (!artist) {
      res.status(404).json({ errors: ["Artista não encontrado."] });
      return;
    }

    deleteFiles(
      getFilesPaths(createElements(artist.audioGuia, [artist.image]))
    );

    await Artist.findByIdAndDelete(artist._id);

    res.status(200).json({
      id: artist._id,
      message: "Artista excluído com sucesso.",
    });
  } catch (error) {
    res.status(404).json({ errors: ["Artista não encontrado"] });
    return;
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
const getArtistById = async (req, res) => {
  const { id } = req.params;

  try {
    const artist = await Artist.findById(new mongoose.Types.ObjectId(id));

    // Check if artWork exists
    if (!artist) {
      res.status(404).json({ errors: ["Artista não encontrado"] });
      return;
    }

    res.status(200).json(artist);
  } catch (error) {
    res.status(404).json({ errors: ["Artista não encontrado"] });
    return;
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
  const artists = await Artist.find({})
    .sort([["date", -1]])
    .exec();

  return res.status(200).json(artists);
};

module.exports = {
  registerArtist,
  updateArtist,
  deleteArtist,
  searchArtist,
  getArtistById,
  getAllArtists,
};
