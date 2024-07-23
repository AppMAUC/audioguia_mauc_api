const express = require("express");

const router = express.Router();

//Controller
const { registerExposition, deleteExposition, updateExposition, getExpositionById, getAllExpostitions, searchExpositions } = require("../controllers/ExpositionController");

//Middlewares
const { authGuard } = require("../middlewares/authGuard");
const validate = require("../validations/handleValidation");
const { expositionCreateValidation, expositionUpdateValidation } = require("../validations/expositionValidations");
const { imageUpload } = require('../middlewares/multerConfig');

//Routes
router.post("/", authGuard, imageUpload.single("image"), expositionCreateValidation(), validate, registerExposition);
router.delete("/:id", authGuard, validate, deleteExposition);

router.get("/", getAllExpostitions);
router.get("/search", searchExpositions);
router.get("/:id", getExpositionById);

router.put("/:id", authGuard, imageUpload.single("image"), expositionUpdateValidation(), validate, updateExposition);



module.exports = router;