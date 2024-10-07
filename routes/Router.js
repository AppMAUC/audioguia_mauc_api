/**
 * @file Router.js
 * @description This file sets up the main routes for the application using Express.
 *
 * @requires express
 * @requires ./AdminRoutes
 * @requires ./ExpositionRoutes
 * @requires ./ArtWorkRoutes
 * @requires ./ArtistRoutes
 * @requires ./EventRoutes
 * @requires ./TimeLineRoutes
 */

/**
 * Express router to mount API routes.
 * @type {object}
 * @const
 * @namespace router
 */

/**
 * Route serving API status.
 * @name get/
 * @function
 * @memberof module:router
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 */

const express = require("express");
const router = express();
const { searchGeneral } = require("../controllers/SearchController");

router.use("/api/admin", require("./AdminRoutes"));
router.use("/api/expositions", require("./ExpositionRoutes"));
router.use("/api/artworks", require("./ArtWorkRoutes"));
router.use("/api/artists", require("./ArtistRoutes"));
router.use("/api/events", require("./EventRoutes"));
router.use("/api/timelines", require("./TimeLineRoutes"));

router.get("/api/search", searchGeneral);
router.get("/", (req, res) => {
  res.json({ message: "API Working!" });
});

module.exports = router;
