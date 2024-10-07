const Admin = require("../models/Admin");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const {
  deleteFiles,
  getFilesPaths,
  getFilePath,
} = require("../utils/deleteFiles");
const jwt = require("jsonwebtoken");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");

/**
 * Registers a new admin.
 * @async
 * @function registerAdmin
 * @param {Object} req - Express request object.
 * @param {Object} req.body - Request body.
 * @param {string} req.body.name - Admin's name.
 * @param {string} req.body.email - Admin's email.
 * @param {string} req.body.password - Admin's password.
 * @param {string} req.body.accessLevel - Admin's access level.
 * @param {Object} req.files - Uploaded files.
 * @param {Object} req.file - Uploaded file.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
const registerAdmin = async (req, res) => {
  const { name, email, password, accessLevel } = req.body;
  const image =
    req.files && req.files["image"]
      ? req.files["image"][0].filename
      : req.file
      ? req.file.filename
      : null;

  // Check if admin exists
  const admin = await Admin.findOne({ email });
  if (admin) {
    res.status(422).json({ errors: ["Por favor utilize outro email"] });
    return;
  }

  // Generate password hash
  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(password, salt);

  // Create admin
  const newAdmin = await Admin.create({
    name,
    email,
    password: passwordHash,
    accessLevel,
    image,
  });

  // if admin was created successfully, return the token
  if (!newAdmin) {
    res
      .status(422)
      .json({ errors: ["Houve um erro, por favor tente mais tarde"] });
    return;
  }

  res.status(201).json({
    _id: newAdmin._id,
    message: "Administrador criado com sucesso, realize login para acessar.",
  });
};

/**
 * Updates an existing admin.
 * @async
 * @function updateAdmin
 * @param {Object} req - Express request object.
 * @param {Object} req.body - Request body.
 * @param {string} [req.body.name] - Admin's name.
 * @param {string} [req.body.password] - Admin's password.
 * @param {Object} [req.files] - Uploaded files.
 * @param {Object} [req.file] - Uploaded file.
 * @param {Object} req.admin - Admin object from request.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
const updateAdmin = async (req, res) => {
  const { name, password } = req.body;

  const image =
    req.files && req.files["image"]
      ? req.files["image"][0].filename
      : req.file
      ? req.file.filename
      : null;

  const reqAdmin = req.admin;

  const admin = await Admin.findById(
    new mongoose.Types.ObjectId(reqAdmin._id)
  ).select("-password");

  if (name) {
    admin.name = name;
  }

  if (password) {
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    admin.password = passwordHash;
  }

  if (image) {
    deleteFiles([getFilePath("images", admin.image)]);
    admin.image = image;
  }

  await admin.save();

  const adminResponse = { ...admin._doc };
  delete adminResponse.password;

  res.status(200).json(adminResponse);
};

/**
 * Deletes an admin by ID.
 * @async
 * @function deleteAdmin
 * @param {Object} req - Express request object.
 * @param {Object} req.params - Request parameters.
 * @param {string} req.params.id - Admin's ID.
 * @param {Object} req.admin - Admin object from request.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
const deleteAdmin = async (req, res) => {
  const { id } = req.params;
  const adminRequest = req.admin;
  try {
    if (adminRequest.accessLevel != "1") {
      res.status(403).json({
        errors: ["Operação não autorizada para esse nível de acesso."],
      });
      return;
    }
    const admin = await Admin.findById(new mongoose.Types.ObjectId(id));

    if (!admin) {
      res.status(404).json({ errors: ["Administrador não encontrada."] });
      return;
    }

    deleteFiles(getFilesPaths({ images: [admin.image] }));
    await Admin.findByIdAndDelete(admin._id);

    res.status(200).json({
      id: admin._id,
      message: "Administrador excluído com sucesso.",
    });
  } catch (error) {
    res.status(404).json({ errors: ["Administrador não encontrado"] });
    return;
  }
};

/**
 * Searches for admins by name or email.
 *
 * @async
 * @function searchAdmins
 * @param {Object} req - The request object.
 * @param {Object} req.query - The request query parameters.
 * @param {string} req.query.q - The search query.
 * @param {Object} res - The response object.
 * @returns {Promise<void>}
 */
const searchAdmins = async (req, res) => {
  const { q } = req.query;

  const admins = await Admin.find({
    $or: [
      { name: { $regex: q, $options: "i" } },
      { email: { $regex: q, $options: "i" } },
    ],
  })
    .sort([["date", -1]])
    .select("-password")
    .exec();

  return res.status(200).json(admins);
};

/**
 * Gets an admin by ID.
 * @async
 * @function getAdminById
 * @param {Object} req - Express request object.
 * @param {Object} req.params - Request parameters.
 * @param {string} req.params.id - Admin's ID.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
const getAdminById = async (req, res) => {
  const { id } = req.params;

  try {
    const admin = await Admin.findById(new mongoose.Types.ObjectId(id)).select(
      "-password"
    );

    // Check if admin exists
    if (!admin) {
      res.status(404).json({ errors: ["Administrador não encontrado"] });
      return;
    }

    res.status(200).json(admin);
  } catch (error) {
    res.status(404).json({ errors: ["Administrador não encontrado"] });
    return;
  }
};

/**
 * Gets all admins.
 * @async
 * @function getAllAdmins
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
const getAllAdmins = async (req, res) => {
  const admin = await Admin.find({})
    .sort([["date", -1]])
    .select("-password")
    .exec();

  return res.status(200).json(admin);
};

/**
 * Gets the currently logged-in admin.
 * @async
 * @function getCurrentAdmin
 * @param {Object} req - Express request object.
 * @param {Object} req.admin - Admin object from request.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
const getCurrentAdmin = async (req, res) => {
  const admin = req.admin;
  res.status(200).json(admin);
};

/**
 * Logs an admin in.
 * @async
 * @function login
 * @param {Object} req - Express request object.
 * @param {Object} req.body - Request body.
 * @param {string} req.body.email - Admin's email.
 * @param {string} req.body.password - Admin's password.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
const login = async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });

  // check if admin exists
  if (!admin) {
    res.status(404).json({ errors: ["Administrador não encontrado."] });
    return;
  }

  // check if password matches
  if (!(await bcrypt.compare(password, admin.password))) {
    res.status(422).json({ errors: ["Administrador ou senha inválidos."] });
    return;
  }

  const refreshToken = generateRefreshToken(admin._id, admin.email);
  const accessToken = generateAccessToken(admin._id, admin.email);

  admin.refreshToken = refreshToken;
  await admin.save();

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  // return admin with token
  res.status(201).json({
    _id: admin._id,
    token: accessToken,
  });
};

/**
 * Logs an admin out.
 * @async
 * @function logout
 * @param {Object} req - Express request object.
 * @param {Object} req.admin - Admin object from request.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
const logout = async (req, res) => {
  const admin = await Admin.findOne(new mongoose.Types.ObjectId(req.admin._id));
  if (!admin) return res.sendStatus(403);

  admin.refreshToken = null;
  await admin.save();
  res.clearCookie("refreshToken");
  res.sendStatus(204);
};

/**
 * Refreshes the access token using the refresh token.
 * @async
 * @function refreshToken
 * @param {Object} req - Express request object.
 * @param {Object} req.cookies - Request cookies.
 * @param {string} req.cookies.refreshToken - Refresh token.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken)
    return res.status(401).json({ errors: "Token inexistente" });

  const admin = await Admin.findOne({ refreshToken });
  if (!admin)
    return res
      .status(403)
      .json({ errors: "Token inválido ou sessão expirada" });

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || decoded.email !== admin.email)
      return res.status(403).json({ errors: "Token inválido" });
    const newAccessToken = generateAccessToken(admin._id);
    res.status(200).json({ _id: decoded._id, token: newAccessToken });
  });
};

module.exports = {
  registerAdmin,
  updateAdmin,
  deleteAdmin,
  searchAdmins,
  getAdminById,
  getAllAdmins,
  getCurrentAdmin,
  login,
  logout,
  refreshToken,
};
