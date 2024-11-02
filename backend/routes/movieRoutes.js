const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movieController");

router.get("/", (req, res) => {
	res.send("Movie Routes Working");
});

module.exports = router;
