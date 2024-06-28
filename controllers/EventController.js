const Event = require('../models/Event');
const mongoose = require('mongoose');

const registerEvent = async (req, res) => {

    const { description, date, title } = req.body;

    const image = req.file ? req.file.filename : null;

    const newEvent = await Event.create({
        description,
        date,
        title,
        image
    });

    if (!newEvent) {
        res.status(422).json({ errors: ["Houve um erro, por favor tente mais tarde"] });
        return;
    };

    res.status(201).json(newEvent);

};

const deleteEvent = async (req, res) => {
    const { id } = req.params;

    try {
        const event = await Event.findById(new mongoose.Types.ObjectId(id));

        if (!event) {
            res.status(404).json({ errors: ["Evento não encontrada."] });
            return;
        };

        await Event.findByIdAndDelete(event._id);

        res.status(200).json({
            id: event._id,
            message: "Evento excluído com sucesso."
        });
    } catch (error) {
        res.status(404).json({ errors: ["Evento não encontrada"] });
        return;
    };
};

const updateEvent = async (req, res) => {
    const { description, date, title } = req.body;
    const { id } = req.params;
    const event = await Event.findById(new mongoose.Types.ObjectId(id));

    const image = req.file ? req.file.filename : null;

    if (!event) {
        res.status(404).json({ errors: ["Evento não encontrado."] });
        return;
    };

    if (title) {
        event.title = title;
    };
    if (description) {
        event.description = description;
    };
    if (date) {
        event.date = date;
    };
    if (image) {
        event.image = image;
    };

    await event.save();

    res.status(200).json(event);
};

const getEventById = async (req, res) => {
    const { id } = req.params;

    try {
        const event = await Event.findById(new mongoose.Types.ObjectId(id));

        if (!event) {
            res.status(404).json({ errors: ["Evento não encontrado"] });
            return;
        };

        res.status(200).json(event);
    } catch (error) {
        res.status(404).json({ errors: ["Evento não encontrado"] });
        return;
    }
};

const getEventContent = async (events) => {

    const eventsWithContent = [];

    for (const id of events) {
        const event = await Event.findById(new mongoose.Types.ObjectId(id));

        if (!event) {
            throw new Error("Evento não encontrado");
        }

        eventsWithContent.push(event);
    }

    return eventsWithContent;
}


const getAllEvents = async (req, res) => {
    const event = await Event.find({}).sort([["date", -1]]).exec();
    return res.status(200).json(event);
};

const searchEvent = async (req, res) => {
    const { q } = req.query;
    const event = await Event.find({ name: new RegExp(q, "i") }).exec();
    res.status(200).json(event);
};

module.exports = {
    registerEvent,
    deleteEvent,
    updateEvent,
    getEventById,
    getAllEvents,
    searchEvent,
    getEventContent
};