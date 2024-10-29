const express = require("express");

const router = express.Router();

//Controller
const {
  registerExposition,
  deleteExposition,
  updateExposition,
  getExpositionById,
  getAllExpostitions,
  searchExpositions,
} = require("../controllers/ExpositionController");

//Middlewares
const { authGuard } = require("../middlewares/authGuard");
const validate = require("../validations/handleValidation");
const {
  expositionCreateValidation,
  expositionUpdateValidation,
} = require("../validations/expositionValidations");
const { upload } = require("../middlewares/multer");
const queryIdValidation = require("../middlewares/queryIdValidation");

//Routes
router.post(
  "/",
  authGuard,
  upload.single("image"),
  expositionCreateValidation(),
  validate,
  registerExposition
);
router.delete("/:id", authGuard, queryIdValidation, validate, deleteExposition);

router.get("/", getAllExpostitions);
router.get("/search", searchExpositions);
router.get("/:id", queryIdValidation, getExpositionById);

router.put(
  "/:id",
  authGuard,
  queryIdValidation,
  upload.single("image"),
  expositionUpdateValidation(),
  validate,
  updateExposition
);

module.exports = router;
