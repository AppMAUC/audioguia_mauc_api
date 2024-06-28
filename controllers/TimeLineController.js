const TimeLine = require("../models/TimeLine");
const mongoose = require("mongoose");
const { getEventContent } = require("./EventController");

const registerTimeLine = async (req, res) => {

    const { title, description, events } = req.body;

    const newTimeLine = await TimeLine.create({
        title,
        description,
        events
    });

    if (!newTimeLine) {
        res.status(422).json({ errors: ["Houve um erro, por favor tente mais tarde"] });
        return;
    };

    res.status(201).json(newTimeLine);

};

const updateTimeLine = async (req, res) => {

    const { id } = req.params;

    try {
        const { title, description, events } = req.body;
        const timeLine = await TimeLine.findById(new mongoose.Types.ObjectId(id));

        if (!timeLine) {
            res.status(404).json({ errors: ["Linha do tempo não encontrada."] });
            return;
        };

        if (title) {
            timeLine.title = title;
        };
        if (description) {
            timeLine.description = description;
        };
        if (events) {
            timeLine.events = events;
        };

        await timeLine.save();

        res.status(200).json(timeLine);

    } catch (error) {
        res.status(404).json({ errors: ["Linha do tempo não encontrada."] });
        return;
    }

};

const deleteTimeLine = async (req, res) => {
    const { id } = req.params;

    try {
        const timeLine = await TimeLine.findById(new mongoose.Types.ObjectId(id));

        if (!timeLine) {
            res.status(404).json({ errors: ["Linha do tempo não encontrada."] });
            return;
        };

        await TimeLine.findByIdAndDelete(timeLine._id);

        res.status(200).json({
            id: timeLine._id,
            message: "Linha do tempo excluída com sucesso."
        });
    } catch (error) {
        res.status(404).json({ errors: ["Linha do Tempo não encontrada"] });
        return;
    };
};

const searchTimeLine = async (req, res) => {
    const { q } = req.query;
    const timeLine = await TimeLine.find({ name: new RegExp(q, "i") }).exec();
    res.status(200).json(timeLine);
};

const getTimeLineById = async (req, res) => {
    const { id } = req.params;

    try {
        const timeLine = await TimeLine.findById(new mongoose.Types.ObjectId(id));

        if (!timeLine) {
            res.status(404).json({ errors: ["Linha do tempo não encontrada"] });
            return;
        };

        res.status(200).json(timeLine);
    } catch (error) {
        res.status(404).json({ errors: ["Linha do tempo não encontrada"] });
        return;
    }
};

const getAllTimeLines = async (req, res) => {
    const timeLine = await TimeLine.find({}).sort([["date", -1]]).exec();
    return res.status(200).json(timeLine);
};

const getTimeLineWithContent = async (req, res) => {
    const { id } = req.params;

    try {
        const timeLine = await TimeLine.findById(new mongoose.Types.ObjectId(id));

        if (!timeLine) {
            res.status(404).json({ errors: ["Linha do tempo não encontrada"] });
            return;
        };

        const events = await getEventContent(timeLine.events);

        const timeLineWithContent = {
            title: timeLine.title,
            description: timeLine.description,
            events: events
        };

        if (!timeLineWithContent) {
            res.status(404).json({ errors: ["Houve um erro no servidor, tente novamente mais tarde."] });
            return;
        };

        res.status(200).json(timeLineWithContent);
    } catch (error) {
        res.status(404).json({ errors: ["Linha do tempo não encontrada"] });
        return;
    }
}

module.exports = {
    registerTimeLine,
    updateTimeLine,
    deleteTimeLine,
    searchTimeLine,
    getTimeLineById,
    getAllTimeLines,
    getTimeLineWithContent
}

