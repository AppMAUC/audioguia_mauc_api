const express = require('express');
const router  = express();

router.use("/api/admin", require("./AdminRoutes"));
router.use("/api/photos", require("./PhotoRoutes")); 
router.use("/api/expositions", require("./ExpositionRoutes")); 


router.get("/", (req, res) => {
    res.json({message: "API Working!"})
})

module.exports = router

