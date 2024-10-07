const TimeLine = require("../models/TimeLine");
const mongoose = require("mongoose");
const { getEventContent } = require("./EventController");

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
const registerTimeLine = async (req, res) => {
  const { title, description, events } = req.body;

  const newTimeLine = await TimeLine.create({
    title,
    description,
    events,
  });

  if (!newTimeLine) {
    res
      .status(422)
      .json({ errors: ["Houve um erro, por favor tente mais tarde"] });
    return;
  }

  res.status(201).json(newTimeLine);
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
const updateTimeLine = async (req, res) => {
  const { id } = req.params;

  try {
    const { title, description, events } = req.body;
    const timeLine = await TimeLine.findById(new mongoose.Types.ObjectId(id));

    if (!timeLine) {
      res.status(404).json({ errors: ["Linha do tempo não encontrada."] });
      return;
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

    await timeLine.save();

    res.status(202).json(timeLine);
  } catch (error) {
    res.status(404).json({ errors: ["Linha do tempo não encontrada."] });
    return;
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
const deleteTimeLine = async (req, res) => {
  const { id } = req.params;

  try {
    const timeLine = await TimeLine.findById(new mongoose.Types.ObjectId(id));

    if (!timeLine) {
      res.status(404).json({ errors: ["Linha do tempo não encontrada."] });
      return;
    }

    await TimeLine.findByIdAndDelete(timeLine._id);

    res.status(200).json({
      id: timeLine._id,
      message: "Linha do tempo excluída com sucesso.",
    });
  } catch (error) {
    res.status(404).json({ errors: ["Linha do Tempo não encontrada"] });
    return;
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
const getTimeLineById = async (req, res) => {
  const { id } = req.params;

  try {
    const timeLine = await TimeLine.findById(new mongoose.Types.ObjectId(id));

    if (!timeLine) {
      res.status(404).json({ errors: ["Linha do tempo não encontrada"] });
      return;
    }

    res.status(200).json(timeLine);
  } catch (error) {
    res.status(404).json({ errors: ["Linha do tempo não encontrada"] });
    return;
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

/**
 * Retrieves a timeline with its content by its ID.
 * 
 * @async
 * @function getTimeLineWithContent
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.id - The ID of the timeline to retrieve.
 * @param {Object} res - The response object.
 * @returns {Promise<void>}
 */
const getTimeLineWithContent = async (req, res) => {
  const { id } = req.params;

  try {
    const timeLine = await TimeLine.findById(new mongoose.Types.ObjectId(id));

    if (!timeLine) {
      res.status(404).json({ errors: ["Linha do tempo não encontrada"] });
      return;
    }

    const events = await getEventContent(timeLine.events);

    const timeLineWithContent = {
      title: timeLine.title,
      description: timeLine.description,
      events: events,
    };

    if (!timeLineWithContent) {
      res
        .status(404)
        .json({
          errors: ["Houve um erro no servidor, tente novamente mais tarde."],
        });
      return;
    }

    res.status(200).json(timeLineWithContent);
  } catch (error) {
    res.status(404).json({ errors: ["Linha do tempo não encontrada"] });
    return;
  }
};

module.exports = {
  registerTimeLine,
  updateTimeLine,
  deleteTimeLine,
  searchTimeLine,
  getTimeLineById,
  getAllTimeLines,
  getTimeLineWithContent,
};
