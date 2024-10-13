const express = require("express");
const router = express.Router();

// Controllers
const {
  registerArtist,
  deleteArtist,
  updateArtist,
  searchArtist,
  getAllArtists,
  getArtistById,
} = require("../controllers/ArtistsController");

// Middlewares
const validate = require("../validations/handleValidation");
const {
  artistCreateValidation,
  artistUpdateValidation,
} = require("../validations/artistValidations");
const { authGuard } = require("../middlewares/authGuard");
const { genericUpload } = require("../middlewares/multer");
const fields = [
  { name: "image", maxCount: 1 },
  { name: "audioGuia", maxCount: 2 },
];
// Routes
router.post(
  "/",
  authGuard,
  genericUpload(fields),
  artistCreateValidation(),
  validate,
  registerArtist
);

router.delete("/:id", authGuard, validate, deleteArtist);

router.get("/", getAllArtists);
router.get("/search", searchArtist);
router.get("/:id", getArtistById);

router.put(
  "/:id",
  authGuard,
  genericUpload(fields),
  artistUpdateValidation(),
  validate,
  updateArtist
);

module.exports = router;
