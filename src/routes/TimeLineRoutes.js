const express = require("express");
const router = express.Router();

// Controller
const {
  registerTimeLine,
  updateTimeLine,
  deleteTimeLine,
  searchTimeLine,
  getTimeLineById,
  getAllTimeLines,
} = require("../controllers/TimeLineController");

// Middlewares
const { authGuard } = require("../middlewares/authGuard");
const validate = require("../validations/handleValidation");
const {
  timeLineCreateValidation,
  timeLineUpdateValidation,
} = require("../validations/timeLineValidations");

// Routes
router.post(
  "/",
  authGuard,
  timeLineCreateValidation(),
  validate,
  registerTimeLine
);

router.delete("/:id", authGuard, validate, deleteTimeLine);

router.get("/", getAllTimeLines);
router.get("/search", searchTimeLine);
router.get("/:id", getTimeLineById);

router.put(
  "/:id",
  authGuard,
  timeLineUpdateValidation(),
  validate,
  updateTimeLine
);

module.exports = router;
