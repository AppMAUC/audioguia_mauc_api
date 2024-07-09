const express = require("express");

const router = express.Router();

//Controller
const { registerExposition, deleteExposition, updateExposition, getExpositionById, getAllExpostitions, searchExpositions } = require("../controllers/ExpositionController");

//Middlewares
const { authGuard } = require("../middlewares/authGuard");
const validate = require("../middlewares/handleValidation");
const { expositionCreateValidation, expositionUpdateValidation } = require("../middlewares/expositionValidations");

//Routes
router.post("/", authGuard, expositionCreateValidation(), validate, registerExposition);
router.delete("/:id", authGuard, validate, deleteExposition);

router.get("/", getAllExpostitions);
router.get("/search", searchExpositions);
router.get("/:id", getExpositionById);

router.put("/:id", authGuard, expositionUpdateValidation(), validate, updateExposition);



module.exports = router;