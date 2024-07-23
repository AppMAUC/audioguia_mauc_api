const express = require("express");
const router = express.Router();

// Controller
const { registerEvent, deleteEvent, updateEvent, getEventById, getAllEvents, searchEvent } = require("../controllers/EventController");

// Middlewares
const validate = require("../validations/handleValidation");
const { eventCreateValidation, eventUpdateValidation } = require("../validations/eventValidations");
const { authGuard } = require("../middlewares/authGuard")
const { imageUpload } = require("../middlewares/multerConfig")

// Routes
router.post("/", authGuard, imageUpload.single("image"), eventCreateValidation(), validate, registerEvent);
router.delete("/:id", authGuard, validate, deleteEvent);
router.get("/", getAllEvents);
router.get("/search", searchEvent);
router.get("/:id", getEventById);
router.put("/:id", authGuard, imageUpload.single("image"), eventUpdateValidation(), validate, updateEvent);

module.exports = router;