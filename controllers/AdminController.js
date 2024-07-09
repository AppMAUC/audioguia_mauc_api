const Admin = require('../models/Admin');
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_PASS;

// Generate admin token
const generateToken = (id) => {
    return jwt.sign({ id }, jwtSecret, {
        expiresIn: "7d"
    });
};

// Register Admin
const register = async (req, res) => {

    const { name, email, password, accessLevel } = req.body;

    // Check if admin exists
    const admin = await Admin.findOne({ email });
    if (admin) {
        res.status(422).json({ errors: ["Por favor utilize outro email"] })
        return;
    };

    // Generate password hash
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    // Create admin
    const newAdmin = await Admin.create({
        name,
        email,
        password: passwordHash,
        accessLevel
    });

    // if admin was created successfully, return the token
    if (!newAdmin) {
        res.status(422).json({ errors: ["Houve um erro, por favor tente mais tarde"] })
        return;
    };

    res.status(201).json({
        _id: newAdmin._id,
        token: generateToken(newAdmin._id)
    });

};

// Sign admin in
const login = async (req, res) => {

    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });


    // check if admin exists
    if (!admin) {
        res.status(404).json({ errors: ["Administrador não encontrado."] })
        return;
    };

    // check if password matches
    if (!(await bcrypt.compare(password, admin.password))) {
        res.status(422).json({ errors: ["Senha inválida."] })
        return;
    };

    // return admin with token
    res.status(201).json({
        _id: admin._id,
        profileImage: admin.profileImage,
        token: generateToken(admin._id)
    });


};

// Get current logged admin
const getCurrentAdmin = async (req, res) => {
    const admin = req.admin;
    res.status(200).json(admin);
};

// Update an admin
const update = async (req, res) => {
    const { name, password } = req.body;

    let profileImage = null;

    if (req.file) {
        profileImage = req.file.filename;
    };

    const reqAdmin = req.admin;

    const admin = await Admin.findById(new mongoose.Types.ObjectId(reqAdmin._id)).select("-password");

    if (name) {
        admin.name = name;
    };

    if (password) {
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);
        admin.password = passwordHash;
    };

    if (profileImage) {
        admin.profileImage = profileImage;
    };

    await admin.save();

    const adminResponse = { ...admin._doc };
    delete adminResponse.password;

    res.status(200).json(adminResponse);
}

// Get admin by id
const getAdminById = async (req, res) => {
    const { id } = req.params;

    try {
        const admin = await Admin.findById(new mongoose.Types.ObjectId(id)).select("-password");

        // Check if admin exists
        if (!admin) {
            res.status(404).json({ errors: ["Administrador não encontrado"] });
            return;
        };

        res.status(200).json(admin);
    } catch (error) {
        res.status(404).json({ errors: ["Administrador não encontrado"] });
        return;
    }
}

const getAllAdmins = async (req, res) => {
    const admin = await Admin.find({}).sort([["date", -1]]).exec();

    return res.status(200).json(admin);
};

const tokenIsValid = async (req, res) => {
    return res.status(200).json({ token: true });
};

module.exports = {
    register,
    login,
    getCurrentAdmin,
    update,
    getAdminById,
    getAllAdmins,
    tokenIsValid
};