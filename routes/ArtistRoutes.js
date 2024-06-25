const express = require('express');

const router = express.Router()


// Controllers
const { registerArtist, deleteArtist, updateArtist, searchArtist, getAllArtists, getArtistById } = require('../controllers/ArtistsController');

// Middlewares
const validate = require("../middlewares/handleValidation");
const { artistCreateValidation, artistUpdateValidation } = require("../middlewares/artistValidations");
const authGuard = require("../middlewares/authGuard")
const { combinedUpload } = require("../middlewares/multerConfig")

// Routes
router.post("/", authGuard, combinedUpload, artistCreateValidation(), validate, registerArtist);
router.delete("/:id", authGuard, validate, deleteArtist);
router.get("/", getAllArtists);
router.get("/search", searchArtist);
router.get("/:id", getArtistById);
router.put("/:id", authGuard, combinedUpload, artistUpdateValidation(), validate, updateArtist);


module.exports = router