const express = require("express");

const router = express.Router();

//Controller
const { insertPhoto, deletePhoto, getAllPhotos, getAdminPhotos, getPhotoById, updatePhoto, searchPhotos } = require("../controllers/PhotoController");

//Middlewares
const { photoInsertValidation, photoUpdateValidation } = require("../middlewares/photoValidation");
const authGuard = require("../middlewares/authGuard");
const validate = require("../middlewares/handleValidation");
const { imageUpload } = require("../middlewares/imageUpload");

//Routes
router.post("/", authGuard, imageUpload.single("image"), photoInsertValidation(), validate, insertPhoto);
router.delete("/:id", authGuard, deletePhoto);
router.get("/", authGuard, getAllPhotos);
router.get("/admin/:id", authGuard, getAdminPhotos);
router.get("/search", authGuard, searchPhotos);
router.get("/:id", authGuard, getPhotoById);
// This authguard don't persist in search rout, cause it´s a free rout for all users
router.put("/:id", authGuard, photoUpdateValidation(), validate, updatePhoto);

module.exports = router;