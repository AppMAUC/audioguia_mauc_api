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
console.log('🔥 TESTE DE VARIAVEIS:');
console.log('FIREBASE_CLIENT_EMAIL:', process.env.FIREBASE_CLIENT_EMAIL);
console.log('FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID);
console.log('FIREBASE_PRIVATE_KEY existe?', !!process.env.FIREBASE_PRIVATE_KEY);
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
const devOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];
const prodOrigins = process.env.CLIENT_URLS
  ? process.env.CLIENT_URLS.split(",").map(s => s.trim())
  : [process.env.CLIENT_URL].filter(Boolean);

const allowedOrigins = process.env.NODE_ENV === "production" ? prodOrigins : devOrigins;

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); // curl/Postman
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error("CORS bloqueado para esta origem"), false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept", "X-Requested-With"],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
}));


// Upload directory
app.use(
  "/uploads",
  express.static(path.join(__dirname, "..", "tmp", "uploads"))
);

//routes
app.use(router);

// Error handling
app.use(handleError);

// port config
app.listen(port, () => {
  console.log(`App rodando na porta ${port}`);
  console.log(`Ambiente: ${process.env.NODE_ENV}`);
  console.log(`Storage: ${process.env.STORAGE_TYPE}`);
});
