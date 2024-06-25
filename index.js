//initial config
require("dotenv").config()

const express = require('express');
const cors = require('cors');
const path = require('path');
const port = process.env.PORT;

const app = express();

//Config JSON and form data responses
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Solve Cors
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));

// Upload directory
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

//routes
const router = require('./routes/Router.js');
app.use(router);

// DB connection
require("./config/db.js")

// port config
app.listen(port, () => {
    console.log(`App rodando na porta ${port}`);
});