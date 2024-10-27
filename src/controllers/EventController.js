const Event = require("../models/Event");
const mongoose = require("mongoose");
const { getFileObject } = require("../utils/multerFunctions");

/**
 * Registers a new event.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.description - The description of the event.
 * @param {string} req.body.date - The date of the event.
 * @param {string} req.body.title - The title of the event.
 * @param {Object} req.file - The file object.
 * @param {string} req.file.filename - The filename of the uploaded image.
 * @param {Object} res - The response object.
 * @returns {Promise<void>}
 */
const registerEvent = async (req, res, next) => {
  try {
    const { description, date, title } = req.body;
    const image = req.file ? getFileObject([req.file])[0] : null;

    const archived = false;
    const newEvent = await Event.create({
      description,
      date,
      title,
      image,
      archived,
    });

    if (!newEvent) {
      const error = new Error("Houve um erro, por favor tente mais tarde");
      error.statusCode = 500;
      throw error;
    }

    res.status(201).json({
      _id: newEvent._id,
      message: "Evento criado com sucesso.",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Updates an event by ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.body - The request body.
 * @param {string} [req.body.description] - The description of the event.
 * @param {string} [req.body.date] - The date of the event.
 * @param {string} [req.body.title] - The title of the event.
 * @param {boolean} [req.body.archived] - The archived status of the event.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.id - The ID of the event to update.
 * @param {Object} [req.file] - The file object.
 * @param {string} req.file.filename - The filename of the uploaded image.
 * @param {Object} res - The response object.
 * @returns {Promise<void>}
 */
const updateEvent = async (req, res, next) => {
  try {
    const { description, date, title, archived } = req.body;
    const { id } = req.params;
    const event = await Event.findById(new mongoose.Types.ObjectId(id));
    const image = req.file ? getFileObject([req.file])[0] : null;

    if (!event) {
      const error = new Error("Evento não encontrado");
      error.statusCode = 404;
      throw error;
    }

    if (title) {
      event.title = title;
    }
    if (description) {
      event.description = description;
    }
    if (date) {
      event.date = date;
    }
    if (image) {
      event.image = image;
    }
    if (archived) {
      event.archived = archived;
    }

    await event.updateOne({
      title: event.title,
      description: event.description,
      date: event.date,
      image: event.image,
      archived: event.archived,
    });

    res.status(200).json({
      _id: event._id,
      data: event,
      message: "Evento atualizado com sucesso.",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Deletes an event by ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.id - The ID of the event to delete.
 * @param {Object} res - The response object.
 * @returns {Promise<void>}
 */
const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(new mongoose.Types.ObjectId(id));

    if (!event) {
      const error = new Error("Evento não encontrado.");
      error.statusCode = 404;
      throw error;
    }

    await event.deleteOne();

    res.status(200).json({
      _id: event._id,
      message: "Evento excluído com sucesso.",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Searches for events by name.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.query - The request query parameters.
 * @param {string} req.query.q - The search query.
 * @param {Object} res - The response object.
 * @returns {Promise<void>}
 */
const searchEvent = async (req, res) => {
  const { q } = req.query;
  const event = await Event.find({ name: new RegExp(q, "i") }).exec();
  res.status(200).json(event);
};

/**
 * Retrieves content for a list of events by their IDs.
 *
 * @param {Array<string>} events - The list of event IDs.
 * @returns {Promise<Array<Object>>} - The list of events with content.
 * @throws {Error} - If an event is not found.
 */
const getEventById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(new mongoose.Types.ObjectId(id));

    if (!event) {
      const error = new Error("Evento não encontrado.");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json(event);
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves all events, sorted by date in descending order.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>}
 */
const getAllEvents = async (req, res) => {
  const event = await Event.find({})
    .sort([["date", -1]])
    .exec();
  return res.status(200).json(event);
};

module.exports = {
  registerEvent,
  updateEvent,
  deleteEvent,
  searchEvent,
  getEventById,
  getAllEvents,
};
