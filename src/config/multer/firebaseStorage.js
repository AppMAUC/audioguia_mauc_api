const { bucket } = require("../firebase");

/**
 * Determines the destination directory for uploaded files.
 *
 * @param {Object} req - The request object.
 * @param {Object} file - The file object that is being uploaded.
 * @param {Function} cb - The callback function to specify the destination directory.
 */
function getDestination(req, file, cb) {
  cb(null, "uploads");
}

/**
 * Generates a unique filename for the uploaded file by appending the current timestamp to the original filename.
 *
 * @param {Object} req - The request object.
 * @param {Object} file - The file object containing details of the uploaded file.
 * @param {Function} cb - The callback function to pass the generated filename.
 */
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
/**
 * Método para manipular o arquivo enviado para o Firebase Storage.
 *
 * @param {Object} req - O objeto de requisição.
 * @param {Object} file - O arquivo enviado.
 * @param {Function} cb - Função de retorno de chamada.
 * @returns {void}
 * @throws {Error} - Se ocorrer um erro ao manipular o arquivo.
 * @example
 * const storage = new FirebaseStorage({ destination: getDestination, filename: getFilename });
 *
 */
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
          file.size = blob.metadata.size;
          cb(null, {
            path: filePath,
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

/**
 * Método para remover um arquivo do Firebase Storage.
 * @param {Object} req - O objeto de requisição.
 * @param {Object} file - O arquivo a ser removido.
 * @param {Function} cb - Função de retorno de chamada.
 * @returns {void}
 * @throws {Error} - Se ocorrer um erro ao remover o arquivo.
 * @example
 * const storage = new FirebaseStorage({ destination: getDestination, filename: getFilename });
 */
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
