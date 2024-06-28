const express = require('express');
const router  = express();

router.use("/api/admin", require("./AdminRoutes"));
router.use("/api/expositions", require("./ExpositionRoutes")); 
router.use("/api/artworks", require("./ArtWorkRoutes"));
router.use("/api/artists", require("./ArtistRoutes"));
router.use("/api/events", require("./EventRoutes"));
router.use("/api/timelines", require("./TimeLineRoutes"));

router.get("/", (req, res) => {
    res.json({message: "API Working!"})
})

module.exports = router

