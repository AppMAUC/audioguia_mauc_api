const multer = require("multer");
const path = require("path");
const { fileValidation } = require("../config/files");
const { getPath, getFolder, getAdvancedFolder } = require('../utils/multer');

// Destination storage config
const mediaStorage = multer.diskStorage({
    destination: (req, file, cb) => { // config destination
        cb(null, `uploads/${getFolder(file.fieldname)}s/${getPath(req.baseUrl)}/`);
    },
    filename: (req, file, cb) => { // config filename
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const imageUpload = multer({
    storage: mediaStorage,
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg)$/)) {
            return cb(null, false);
        };
        cb(undefined, true);
    }
});


const audioUpload = multer({
    storage: mediaStorage,
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(mp3|mp4)$/)) {
            return cb(null, false);
        };
        cb(undefined, true);
    }
});

const combinedUpload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, `uploads/${getAdvancedFolder(file, req.baseUrl)}/`);
        },
        filename: function (req, file, cb) {
            let folder = getFolder(file.fieldname)
            if (folder == 'audio') {
                cb(null, Date.now() + file.originalname.match(/\-(br|en)/)[0] + path.extname(file.originalname));
            } else {
                cb(null, Date.now() + path.extname(file.originalname));
            }
        }
    }),
    fileFilter(req, file, cb) {
        const folder = getFolder(file.fieldname);
        cb(null, fileValidation(folder, [file]));
    }
}).fields([
    { name: 'image', maxCount: 1 },
    { name: 'audioDesc', maxCount: 3 }
]);


module.exports = { imageUpload, audioUpload, combinedUpload };