const express = require("express");
const router = express.Router();

// Controller
const {
  registerAdmin,
  login,
  deleteAdmin,
  getCurrentAdmin,
  searchAdmins,
  updateAdmin,
  getAdminById,
  getAllAdmins,
  logout,
  refreshToken,
} = require("../controllers/AdminController");

// Middlewares
const validate = require("../validations/handleValidation");
const {
  adminCreateValidation,
  loginValidation,
  adminUpdateValidation,
} = require("../validations/adminValidations");
const { authGuard } = require("../middlewares/authGuard");
const { upload } = require("../middlewares/multer");
const { checkAccessLevel } = require("../middlewares/checkAccessLevel");

// Routes
router.post(
  "/register",
  authGuard,
  checkAccessLevel(1),
  upload.single("image"),
  adminCreateValidation(),
  validate,
  registerAdmin
);
router.post("/login", loginValidation(), validate, login);
router.post("/logout", authGuard, validate, logout);
router.post("/refresh-token", refreshToken);

router.delete("/:id", authGuard, checkAccessLevel(1), validate, deleteAdmin);

router.get("/", authGuard, validate, getAllAdmins);
router.get("/search", authGuard, validate, searchAdmins);
router.get("/profile", authGuard, validate, getCurrentAdmin);
router.get("/:id", authGuard, validate, getAdminById);
router.put(
  "/",
  authGuard,
  upload.single("image"),
  adminUpdateValidation(),
  validate,
  updateAdmin
);

module.exports = router;
