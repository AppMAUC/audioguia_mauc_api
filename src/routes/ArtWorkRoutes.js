const express = require("express");
const router = express.Router();

//Controller
const {
  registerArtWork,
  deleteArtWork,
  updateArtWork,
  getArtWorkById,
  getAllArtWorks,
  searchArtWork,
} = require("../controllers/ArtworkController");

//Middlewares
const { authGuard } = require("../middlewares/authGuard");
const validate = require("../validations/handleValidation");
const queryIdValidation = require("../middlewares/queryIdValidation");
const {
  artWorkCreateValidation,
  artWorkUpdateValidation,
} = require("../validations/artWorkValidations");
const { genericUpload } = require("../middlewares/multer");

//Routes
router.post(
  "/",
  authGuard,
  genericUpload([
    { name: "image", maxCount: 1 },
    { name: "audioDesc", maxCount: 2 },
    { name: "audioGuia", maxCount: 2 },
  ]),
  artWorkCreateValidation(),
  validate,
  registerArtWork
);

router.delete("/:id", authGuard, queryIdValidation, validate, deleteArtWork);

router.get("/", getAllArtWorks);
router.get("/search", searchArtWork);
router.get("/:id", queryIdValidation, getArtWorkById);

router.put(
  "/:id",
  authGuard,
  queryIdValidation,
  genericUpload([
    { name: "image", maxCount: 1 },
    { name: "audioDesc", maxCount: 2 },
    { name: "audioGuia", maxCount: 2 },
  ]),
  artWorkUpdateValidation(),
  validate,
  updateArtWork
);

module.exports = router;
