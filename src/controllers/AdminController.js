const Admin = require("../models/Admin");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");
const { getFileObject } = require("../utils/multerFunctions");

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
const registerAdmin = async (req, res, next) => {
  try {
    const { name, email, password, accessLevel } = req.body;
    const image = req.file ? getFileObject([req.file])[0] : null;

    // Check if admin exists
    const admin = await Admin.findOne({ email });

    if (admin) {
      const error = new Error("Por favor utilize outro email");
      error.statusCode = 409;
      throw error;
    }

    // Generate password hash
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    // Create admin
    const newAdmin = await Admin.create({
      name,
      email,
      password: passwordHash,
      accessLevel: parseInt(accessLevel),
      image,
    });

    // if admin was created successfully, return the token
    if (!newAdmin) {
      const error = new Error("Houve um erro, por favor tente mais tarde");
      error.statusCode = 500;
      throw error;
    }

    res.status(201).json({
      _id: newAdmin._id,
      message: "Administrador criado com sucesso, realize login para acessar.",
    });
  } catch (error) {
    next(error);
  }
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
const updateAdmin = async (req, res, next) => {
  try {
    const { name, password } = req.body;
    const image = req.file ? getFileObject([req.file])[0] : null;

    const reqAdmin = req.admin;

    const admin = await Admin.findById(
      new mongoose.Types.ObjectId(reqAdmin._id)
    ).select("-password");

    if (!admin) {
      const error = new Error("Administrador não encontrado");
      error.statusCode = 404;
      throw error;
    }

    if (name) {
      admin.name = name;
    }

    if (password) {
      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(password, salt);
      admin.password = passwordHash;
    }

    if (image) {
      admin.image = image;
    }

    await admin.updateOne({
      name: admin.name,
      password: admin.password,
      image: admin.image,
    });

    const adminResponse = { ...admin._doc };
    delete adminResponse.password;
    delete adminResponse.refreshToken;

    res.status(200).json({
      _id: admin._id,
      data: adminResponse,
      message: "Administrador atualizado com sucesso.",
    });
  } catch (error) {
    next(error);
  }
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
const deleteAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    const admin = await Admin.findById(new mongoose.Types.ObjectId(id));
    if (!admin) {
      const error = new Error("Administrador não encontrado");
      error.statusCode = 404;
      throw error;
    }

    await admin.deleteOne();

    res.status(200).json({
      _id: admin._id,
      message: "Administrador excluído com sucesso.",
    });
  } catch (error) {
    next(error);
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
const getAdminById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findById(new mongoose.Types.ObjectId(id)).select(
      "-password"
    );

    // Check if admin exists
    if (!admin) {
      const error = new Error("Administrador não encontrado");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json(admin);
  } catch (error) {
    next(error);
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
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    // check if admin exists
    if (!admin) {
      const error = new Error("Administrador não encontrado");
      error.statusCode = 404;
      throw error;
    }

    // check if password matches
    if (!(await bcrypt.compare(password, admin.password))) {
      const error = new Error("Login ou senha inválidos.");
      error.statusCode = 422;
      throw error;
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
  } catch (error) {
    next(error);
  }
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
const logout = async (req, res, next) => {
  try {
    const admin = await Admin.findOne(
      new mongoose.Types.ObjectId(req.admin._id)
    );
    if (!admin) {
      const error = new Error("Administrador não encontrado");
      error.statusCode = 404;
      throw error;
    }

    admin.refreshToken = null;
    await admin.save();
    res.clearCookie("refreshToken");
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
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
const refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      const error = new Error("Operação não autorizada");
      error.statusCode = 401;
      throw error;
    }

    const admin = await Admin.findOne({ refreshToken });
    if (!admin) {
      const error = new Error("Sessão expirada");
      error.statusCode = 403;
      throw error;
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err || decoded.email !== admin.email) {
          const error = new Error("Sessão inválida ou expirada");
          error.statusCode = 403;
          throw error;
        }
        const newAccessToken = generateAccessToken(admin._id);
        res.status(200).json({ _id: decoded._id, token: newAccessToken });
      }
    );
  } catch (error) {
    next(error);
  }
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
