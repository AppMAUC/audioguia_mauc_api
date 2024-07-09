const express = require('express');
const router = express.Router();

// Controller
const { registerTimeLine, updateTimeLine, deleteTimeLine, searchTimeLine, getTimeLineById, getAllTimeLines, getTimeLineWithContent } = require('../controllers/TimeLineController');

// Middlewares
const { authGuard } = require("../middlewares/authGuard");
const validate = require("../middlewares/handleValidation");
const { timeLineCreateValidation, timeLineUpdateValidation } = require("../middlewares/timeLineValidations");

// Routes
router.post("/", authGuard, timeLineCreateValidation(), validate, registerTimeLine);
router.delete("/:id", authGuard, validate, deleteTimeLine);

router.get("/", getAllTimeLines);
router.get("/search", searchTimeLine);
router.get("/content/:id", getTimeLineWithContent);
router.get("/:id", getTimeLineById);

router.put("/:id", authGuard, timeLineUpdateValidation(), validate, updateTimeLine);


module.exports = router;