const multer = require("multer");
const path = require("path");

// Destination storage

const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder = "";

        if (req.baseUrl.includes("admin")) {
            folder = "admin";
        } else if (req.baseUrl.includes("photos")) {
            folder = "photos";
        };

        cb(null, `uploads/${folder}/`);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const imageUpload = multer({
    storage: imageStorage,
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg)$/)) {
            return cb(new Error("Por favor, envie apenas jpg ou png!"));
        };
        cb(undefined, true);
    }
});


module.exports = { imageUpload };