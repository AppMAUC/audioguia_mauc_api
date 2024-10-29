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
const queryIdValidation = require("../middlewares/queryIdValidation");
// Routes
router.post(
  "/",
  authGuard,
  timeLineCreateValidation(),
  validate,
  registerTimeLine
);

router.delete("/:id", authGuard, queryIdValidation, validate, deleteTimeLine);

router.get("/", getAllTimeLines);
router.get("/search", searchTimeLine);
router.get("/:id", queryIdValidation, getTimeLineById);

router.put(
  "/:id",
  authGuard,
  queryIdValidation,
  timeLineUpdateValidation(),
  validate,
  updateTimeLine
);

module.exports = router;
