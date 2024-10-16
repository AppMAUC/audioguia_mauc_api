/**
 * @file index.js
 * @description Entry point for the audioguia_mauc_api application. Configures and starts the Express server.
 * @requires dotenv
 * @requires express
 * @requires cookie-parser
 * @requires cors
 * @requires path
 * @requires ./routes/Router.js
 * @requires morgan
 * @requires ./config/db.js
 */

//initial config
require("dotenv").config();
// DB connection
require("./config/db.js");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const port = process.env.PORT;
const router = require("./routes/Router.js");
const morgan = require("morgan");
const handleError = require("./middlewares/handleError.js");
const app = express();
//Config JSON and form data responses
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Solve Cors
if (process.env.NODE_ENV === "production") {
  app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));
} else {
  app.use(cors());
}

// Upload directory
app.use("/files", express.static(path.join(__dirname, "..", "tmp", "uploads")));

//routes
app.use(router);

// Error handling
app.use(handleError);

// port config
app.listen(port, () => {
  console.log(`App rodando na porta ${port}`);
});
