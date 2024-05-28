const express = require("express");

const router = express.Router();

// Controller
const { register, login, getCurrentAdmin, update, getUserById } = require("../controllers/AdminController");

// Middlewares
const validate = require("../middlewares/handleValidation");
const { adminCreateValidation, loginValidation, adminUpdateValidation } = require("../middlewares/adminValidations");
const authGuard = require("../middlewares/authGuard")
const { imageUpload } = require("../middlewares/imageUpload")

// Routes
router.post("/register", adminCreateValidation(), validate, register);
router.post("/login", loginValidation(), validate, login);
router.get("/profile", authGuard, getCurrentAdmin);
router.put("/", authGuard, adminUpdateValidation(), validate, imageUpload.single("profileImage"), update);
router.get("/:id", getUserById);
module.exports = router;