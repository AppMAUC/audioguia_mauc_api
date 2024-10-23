const Exposition = require("../models/Exposition");
const mongoose = require("mongoose");
const { getAllWithPaginate } = require("../utils/paginate");
const { getFileObject } = require("../utils/multerFunctions");

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
const registerExposition = async (req, res, next) => {
  try {
    const { title, description, type, artWorks, place, dateStarts, dateEnds } =
      req.body;
    const { image: a } = req.files;
    const image = a
      ? getFileObject(a)[0]
      : req.file
      ? getFileObject([req.file])[0]
      : null;
    const archived = false;

    // Create exposition
    const newExposition = await Exposition.create({
      title,
      type: parseInt(type),
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
      const error = new Error("Houve um erro, por favor tente mais tarde");
      error.statusCode = 500;
      throw error;
    }

    res.status(201).json({
      _id: newExposition._id,
      message: "Exposição criada com sucesso.",
    });
  } catch (error) {
    next(error);
  }
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
const updateExposition = async (req, res, next) => {
  try {
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
    const exposition = await Exposition.findById(
      new mongoose.Types.ObjectId(id)
    );

    // Check if exposition exists
    if (!exposition) {
      const error = new Error("Exposição não encontrada.");
      error.statusCode = 404;
      throw error;
    }

    const { image: a } = req.files;
    const image = a
      ? getFileObject(a)[0]
      : req.file
      ? getFileObject([req.file])[0]
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
      exposition.type = parseInt(type);
    }
    if (image) {
      exposition.image = image;
    }
    if (archived) {
      exposition.archived = archived;
    }

    await exposition.updateOne({
      title: exposition.title,
      description: exposition.description,
      artWorks: exposition.artWorks,
      place: exposition.place,
      dateEnds: exposition.dateEnds,
      dateStarts: exposition.dateStarts,
      type: exposition.type,
      image: exposition.image,
      archived: exposition.archived,
    });

    res.status(200).json({
      _id: exposition._id,
      data: exposition,
      message: "Exposição atualizada com sucesso.",
    });
  } catch (error) {
    next(error);
  }
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
const deleteExposition = async (req, res, next) => {
  try {
    const { id } = req.params;
    const exposition = await Exposition.findById(
      new mongoose.Types.ObjectId(id)
    );

    // Check if expostion exists
    if (!exposition) {
      const error = new Error("Exposição não encontrada.");
      error.statusCode = 404;
      throw error;
    }

    await exposition.deleteOne();

    res.status(200).json({
      _id: exposition._id,
      message: "Exposição excluída com sucesso.",
    });
  } catch (error) {
    next(error);
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
const getExpositionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const exposition = await Exposition.findById(
      new mongoose.Types.ObjectId(id)
    )
      .populate("artWorks")
      .exec();

    // Check if exposition exists
    if (!exposition) {
      const error = new Error("Exposição não encontrada.");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json(exposition);
  } catch (error) {
    next(error);
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
  const expositions = await getAllWithPaginate(Exposition, req, [
    ["dateEnds", -1],
  ]);
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
