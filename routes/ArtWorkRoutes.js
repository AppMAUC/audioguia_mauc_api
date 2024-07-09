const express = require("express");

const router = express.Router();

//Controller
const { registerArtWork, deleteArtWork, updateArtWork, getArtWorkById, getAllArtWorks, searchArtWork } = require('../controllers/ArtworkController');

//Middlewares
const { authGuard } = require("../middlewares/authGuard");
const validate = require("../middlewares/handleValidation");
const { artWorkCreateValidation, artWorkUpdateValidation } = require("../middlewares/artWorkValidations");
const { combinedUpload } = require("../middlewares/multerConfig")

//Routes
router.post("/", authGuard, combinedUpload, artWorkCreateValidation(), validate, registerArtWork);
router.delete("/:id", authGuard, validate, deleteArtWork);

router.get("/", getAllArtWorks);
router.get("/search", searchArtWork);
router.get("/:id", getArtWorkById);

router.put("/:id", authGuard, combinedUpload, artWorkUpdateValidation(), validate, updateArtWork);



module.exports = router;