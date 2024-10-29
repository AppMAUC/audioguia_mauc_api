const TimeLine = require("../models/TimeLine");
const mongoose = require("mongoose");

/**
 * Registers a new timeline.
 *
 * @async
 * @function registerTimeLine
 * @param {Object} req - The request object.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.title - The title of the timeline.
 * @param {string} req.body.description - The description of the timeline.
 * @param {Array} req.body.events - The events of the timeline.
 * @param {Object} res - The response object.
 * @returns {Promise<void>}
 */
const registerTimeLine = async (req, res, next) => {
  try {
    const { title, description, events } = req.body;

    const newTimeLine = await TimeLine.create({
      title,
      description,
      events,
    });

    if (!newTimeLine) {
      const error = new Error("Houve um erro, por favor tente mais tarde");
      error.statusCode = 500;
      throw error;
    }

    res.status(201).json({
      _id: newTimeLine._id,
      message: "Linha do tempo criada com sucesso.",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Updates an existing timeline.
 *
 * @async
 * @function updateTimeLine
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.id - The ID of the timeline to update.
 * @param {Object} req.body - The request body.
 * @param {string} [req.body.title] - The new title of the timeline.
 * @param {string} [req.body.description] - The new description of the timeline.
 * @param {Array} [req.body.events] - The new events of the timeline.
 * @param {Object} res - The response object.
 * @returns {Promise<void>}
 */
const updateTimeLine = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, events } = req.body;
    const timeLine = await TimeLine.findById(new mongoose.Types.ObjectId(id));

    if (!timeLine) {
      const error = new Error("Linha do tempo não encontrada.");
      error.statusCode = 404;
      throw error;
    }

    if (title) {
      timeLine.title = title;
    }
    if (description) {
      timeLine.description = description;
    }
    if (events) {
      timeLine.events = events;
    }

    await timeLine.updateOne({
      title: timeLine.title,
      description: timeLine.description,
      events: timeLine.events,
    });

    res.status(202).json({
      _id: timeLine._id,
      data: timeLine,
      message: "Linha do tempo atualizada com sucesso.",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Deletes an existing timeline.
 *
 * @async
 * @function deleteTimeLine
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.id - The ID of the timeline to delete.
 * @param {Object} res - The response object.
 * @returns {Promise<void>}
 */
const deleteTimeLine = async (req, res, next) => {
  const { id } = req.params;

  try {
    const timeLine = await TimeLine.findById(new mongoose.Types.ObjectId(id));

    if (!timeLine) {
      const error = new Error("Linha do tempo não encontrada.");
      error.statusCode = 404;
      throw error;
    }

    await TimeLine.findByIdAndDelete(timeLine._id);

    res.status(200).json({
      _id: timeLine._id,
      message: "Linha do tempo excluída com sucesso.",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Searches for timelines by name.
 *
 * @async
 * @function searchTimeLine
 * @param {Object} req - The request object.
 * @param {Object} req.query - The request query parameters.
 * @param {string} req.query.q - The search query.
 * @param {Object} res - The response object.
 * @returns {Promise<void>}
 */
const searchTimeLine = async (req, res) => {
  const { q } = req.query;
  const timeLine = await TimeLine.find({ name: new RegExp(q, "i") }).exec();
  res.status(200).json(timeLine);
};

/**
 * Retrieves a timeline by its ID.
 *
 * @async
 * @function getTimeLineById
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.id - The ID of the timeline to retrieve.
 * @param {Object} res - The response object.
 * @returns {Promise<void>}
 */
const getTimeLineById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const timeLine = await TimeLine.findById(new mongoose.Types.ObjectId(id))
      .populate("events")
      .exec();

    if (!timeLine) {
      const error = new Error("Linha do tempo não encontrada.");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json(timeLine);
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves all timelines.
 *
 * @async
 * @function getAllTimeLines
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>}
 */
const getAllTimeLines = async (req, res) => {
  const timeLine = await TimeLine.find({})
    .sort([["date", -1]])
    .exec();
  return res.status(200).json(timeLine);
};

module.exports = {
  registerTimeLine,
  updateTimeLine,
  deleteTimeLine,
  searchTimeLine,
  getTimeLineById,
  getAllTimeLines,
};
