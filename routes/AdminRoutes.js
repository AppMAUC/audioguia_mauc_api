const express = require("express");

const router = express.Router();

// Controller
const { register, login, getCurrentAdmin, update, getAdminById, getAllAdmins, tokenIsValid } = require("../controllers/AdminController");

// Middlewares
const validate = require("../middlewares/handleValidation");
const { adminCreateValidation, loginValidation, adminUpdateValidation } = require("../middlewares/adminValidations");
const { authGuard, verifyToken } = require("../middlewares/authGuard")
const { imageUpload } = require("../middlewares/multerConfig")

// Routes
router.post("/register", adminCreateValidation(), validate, register); // adicionar os midlewares
router.post("/login", loginValidation(), validate, login);
router.get("/", authGuard, getAllAdmins);
router.get("/profile", authGuard, getCurrentAdmin);
router.put("/", authGuard, imageUpload.single("profileImage"), adminUpdateValidation(), validate, update);
router.get("/token", verifyToken, tokenIsValid);
router.get("/:id", authGuard, getAdminById);

module.exports = router;