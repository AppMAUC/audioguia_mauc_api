const { rollBackFiles } = require("../utils/deleteFiles");

const handleError = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  rollBackFiles(req);
  res.status(statusCode).json({
    statusCode: statusCode,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = handleError;
