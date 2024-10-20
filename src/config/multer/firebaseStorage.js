const { bucket } = require("../firebase");

function getDestination(req, file, cb) {
  cb(null, "uploads");
}

function getFilename(req, file, cb) {
  cb(null, `${Date.now()}-${file.originalname}`);
}

/**
 * Função construtora do Firebase Storage Engine
 */
function FirebaseStorage(opts) {
  this.getDestination = opts.destination || getDestination;
  this.getFilename = opts.filename || getFilename;
}

FirebaseStorage.prototype._handleFile = function _handleFile(req, file, cb) {
  // Chamar as funções `destination` e `filename` para personalizar a lógica
  this.getDestination(req, file, (err, destination) => {
    if (err) return cb(err);

    this.getFilename(req, file, (err, fileName) => {
      if (err) return cb(err);

      const filePath = `${destination}${fileName}`;
      const blob = bucket.file(filePath);
      const blobStream = blob.createWriteStream({
        metadata: {
          contentType: file.mimetype,
        },
      });

      blobStream.on("error", function (err) {
        cb(err);
      });

      blobStream.on("finish", async function () {
        try {
          // Gerar URL pública do arquivo no Firebase Storage

          await blob.makePublic();
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
          file.url = publicUrl;
          cb(null, {
            path: publicUrl,
            filename: fileName,
          });
        } catch (err) {
          cb(err);
        }
      });

      // Enviar o buffer do arquivo para o Firebase Storage
      file.stream.pipe(blobStream);
    });
  });
};

FirebaseStorage.prototype._removeFile = function _removeFile(req, file, cb) {
  const blob = bucket.file(file.filename);
  blob
    .delete()
    .then(() => cb(null))
    .catch((err) => cb(err));
};

module.exports = function (opts) {
  return new FirebaseStorage(opts);
};
