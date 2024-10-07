const Exposition = require("../models/Exposition");
const mongoose = require("mongoose");
const {
  deleteFiles,
  getFilesPaths,
  getFilePath,
} = require("../utils/deleteFiles");

/**
 * Registers a new exposition.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.body - The body of the request.
 * @param {string} req.body.title - The title of the exposition.
 * @param {string} req.body.description - The description of the exposition.
 * @param {string} req.body.type - The type of the exposition.
 * @param {Array} req.body.artWorks - The artworks in the exposition.
 * @param {string} req.body.place - The place of the exposition.
 * @param {Date} req.body.dateStarts - The start date of the exposition.
 * @param {Date} req.body.dateEnds - The end date of the exposition.
 * @param {Object} req.files - The files in the request.
 * @param {Object} req.file - The file in the request.
 * @param {Object} res - The response object.
 * @returns {Promise<void>}
 */
const registerExposition = async (req, res) => {
  const { title, description, type, artWorks, place, dateStarts, dateEnds } =
    req.body;

  const image =
    req.files && req.files["image"]
      ? req.files["image"][0].filename
      : req.file
      ? req.file.filename
      : null;
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
    archived,
  });

  // if exposition was created successfully, return the token
  if (!newExposition) {
    res
      .status(422)
      .json({ errors: ["Houve um erro, por favor tente mais tarde"] });
    return;
  }

  res.status(201).json(newExposition);
};

/**
 * Updates an existing exposition.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.body - The body of the request.
 * @param {string} [req.body.title] - The title of the exposition.
 * @param {string} [req.body.description] - The description of the exposition.
 * @param {Array} [req.body.artWorks] - The artworks in the exposition.
 * @param {string} [req.body.type] - The type of the exposition.
 * @param {string} [req.body.place] - The place of the exposition.
 * @param {Date} [req.body.dateStarts] - The start date of the exposition.
 * @param {Date} [req.body.dateEnds] - The end date of the exposition.
 * @param {boolean} [req.body.archived] - The archived status of the exposition.
 * @param {Object} [req.files] - The files in the request.
 * @param {Object} [req.file] - The file in the request.
 * @param {Object} req.params - The parameters of the request.
 * @param {string} req.params.id - The ID of the exposition.
 * @param {Object} res - The response object.
 * @returns {Promise<void>}
 */
const updateExposition = async (req, res) => {
  const {
    title,
    description,
    artWorks,
    type,
    place,
    dateStarts,
    dateEnds,
    archived,
  } = req.body;
  const { id } = req.params;
  const exposition = await Exposition.findById(new mongoose.Types.ObjectId(id));

  // Check if exposition exists
  if (!exposition) {
    res.status(404).json({ errors: ["Exposição não encontrada."] });
    return;
  }

  const image =
    req.files && req.files["image"]
      ? req.files["image"][0].filename
      : req.file
      ? req.file.filename
      : null;

  if (title) {
    exposition.title = title;
  }
  if (description) {
    exposition.description = description;
  }
  if (artWorks) {
    exposition.artWorks = artWorks;
  }
  if (place) {
    exposition.place = place;
  }
  if (dateEnds) {
    exposition.dateEnds = dateEnds;
  }
  if (dateStarts) {
    exposition.dateStarts = dateStarts;
  }
  if (type) {
    exposition.type = type;
  }
  if (image) {
    deleteFiles([getFilePath("images", exposition.image)]);
    exposition.image = image;
  }
  if (archived) {
    exposition.archived = archived;
  }

  await exposition.save();

  res.status(200).json(exposition);
};

/**
 * Deletes an exposition by its ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.params - The parameters of the request.
 * @param {string} req.params.id - The ID of the exposition.
 * @param {Object} res - The response object.
 * @returns {Promise<void>}
 */
const deleteExposition = async (req, res) => {
  const { id } = req.params;

  try {
    const exposition = await Exposition.findById(
      new mongoose.Types.ObjectId(id)
    );

    // Check if expostion exists
    if (!exposition) {
      res.status(404).json({ errors: ["Exposição não encontrada."] });
      return;
    }

    deleteFiles(getFilesPaths({ images: [exposition.image] }));

    await Exposition.findByIdAndDelete(exposition._id);

    res.status(200).json({
      id: exposition._id,
      message: "Exposição excluída com sucesso.",
    });
  } catch (error) {
    res.status(404).json({ errors: ["Exposição não encontrada"] });
    return;
  }
};

/**
 * Searches for expositions by title.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.query - The query parameters of the request.
 * @param {string} req.query.q - The search query.
 * @param {Object} res - The response object.
 * @returns {Promise<void>}
 */
const searchExpositions = async (req, res) => {
  const { q } = req.query;
  const expositions = await Exposition.find({
    title: new RegExp(q, "i"),
  }).exec();
  res.status(200).json(expositions);
};

/**
 * Retrieves an exposition by its ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.params - The parameters of the request.
 * @param {string} req.params.id - The ID of the exposition.
 * @param {Object} res - The response object.
 * @returns {Promise<void>}
 */
const getExpositionById = async (req, res) => {
  const { id } = req.params;

  try {
    const exposition = await Exposition.findById(
      new mongoose.Types.ObjectId(id)
    );

    // Check if exposition exists
    if (!exposition) {
      res.status(404).json({ errors: ["Exposição não encontrada"] });
      return;
    }

    res.status(200).json(exposition);
  } catch (error) {
    res.status(404).json({ errors: ["Exposição não encontrada"] });
    return;
  }
};

/**
 * Retrieves all expositions.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>}
 */
const getAllExpostitions = async (req, res) => {
  const expositions = await Exposition.find({})
    .sort([["createdAt", -1]])
    .exec();

  return res.status(200).json(expositions);
};

module.exports = {
  registerExposition,
  updateExposition,
  deleteExposition,
  searchExpositions,
  getExpositionById,
  getAllExpostitions,
};
