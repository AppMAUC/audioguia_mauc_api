const multer = require("multer");
const path = require("path");

// Destination storage config

const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => { // config destination
        let folder = "";

        if (req.baseUrl.includes("admin")) {
            folder = "admin";
        } else if (req.baseUrl.includes("photos")) {
            folder = "photos";
        } else if (req.baseUrl.includes("artworks")) {
            folder = "artWork";
        } else if (req.baseUrl.includes("events")) {
            folder = "events";
        };

        cb(null, `uploads/images/${folder}/`);
    },
    filename: (req, file, cb) => { // config filename
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


// Configuração para áudios
const audioStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        let folder = "";

        if (req.baseUrl.includes("admin")) {
            folder = "admin";
        } else if (req.baseUrl.includes("expositions")) {
            folder = "expositions";
        } else if (req.baseUrl.includes("artworks")) {
            folder = "artWork";
        } else if (req.baseUrl.includes("artists")) {
            folder = "artists";
        };


        cb(null, `uploads/audios/${folder}/`);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const audioUpload = multer({
    storage: audioStorage,
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(mp3|mp4)$/)) {
            return cb(new Error("Por favor, envie apenas mp3 ou mp4!"));
        };
        cb(undefined, true);
    }
});


const combinedUpload  = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            if (file.fieldname === 'image') {
                let folder = "";

                if (req.baseUrl.includes("admin")) {
                    folder = "admin";
                } else if (req.baseUrl.includes("expositions")) {
                    folder = "expositions";
                } else if (req.baseUrl.includes("artworks")) {
                    folder = "artWork";
                } else if (req.baseUrl.includes("artists")) {
                    folder = "artists";
                };

                cb(null, `uploads/images/${folder}/`);
            } else if (file.fieldname === 'audio_desc') {
                let folder = "";

                if (req.baseUrl.includes("admin")) {
                    folder = "admin";
                } else if (req.baseUrl.includes("expositions")) {
                    folder = "expositions";
                } else if (req.baseUrl.includes("artworks")) {
                    folder = "artWork";
                } else if (req.baseUrl.includes("artists")) {
                    folder = "artists";
                };

                cb(null, `uploads/audios/${folder}/`);
            }
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + path.extname(file.originalname));
        }
    }),
    fileFilter(req, file, cb) {
        // Verifique o tipo MIME do arquivo
        if (file.mimetype.startsWith('image/')) {
            // Aceite apenas imagens JPEG e PNG
            if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
                cb(null, true);
            } else {
                cb(new Error('Tipo de arquivo não suportado para imagem. Apenas JPEG e PNG são permitidos.'), false);
            }
        } else if (file.mimetype.startsWith('audio/')) {
            // Aceite apenas áudio MP3 e MP4
            if (file.mimetype === 'audio/mpeg' || file.mimetype === 'audio/mp4') {
                cb(null, true);
            } else {
                cb(new Error('Tipo de arquivo não suportado para áudio. Apenas MP3 e MP4 são permitidos.'), false);
            }
        } else {
            cb(new Error('Tipo de arquivo não suportado. Apenas imagens e áudios são permitidos.'), false);
        }
    }
}).fields([
    { name: 'image', maxCount: 1 },
    { name: 'audio_desc', maxCount: 1 }
]);




module.exports = { imageUpload, audioUpload, combinedUpload };