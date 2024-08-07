const express = require("express");

const router = express.Router();

// Controller
const { register, login, deleteAdmin, getCurrentAdmin, update, getAdminById, getAllAdmins, tokenIsValid } = require("../controllers/AdminController");

// Middlewares
const validate = require("../validations/handleValidation");
const { adminCreateValidation, loginValidation, adminUpdateValidation } = require("../validations/adminValidations");
const { authGuard, verifyToken } = require("../middlewares/authGuard")
const { imageUpload } = require("../middlewares/multerConfig")

// Routes
router.post("/register", imageUpload.single("image"), adminCreateValidation(), validate, register); // adicionar os midlewares
router.post("/login", loginValidation(), validate, login);
router.delete("/:id", authGuard, validate, deleteAdmin);
router.get("/", authGuard, getAllAdmins);
router.get("/profile", authGuard, getCurrentAdmin);
router.get("/token", verifyToken, tokenIsValid);
router.get("/:id", authGuard, getAdminById);
router.put("/", authGuard, imageUpload.single("image"), adminUpdateValidation(), validate, update);

module.exports = router;