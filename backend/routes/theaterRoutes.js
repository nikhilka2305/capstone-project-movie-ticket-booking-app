const express = require("express");
const router = express.Router();
const theaterController = require("../controllers/theaterController");

router.get("/", (req, res) => {
	res.send("Theater Routes Working");
});

module.exports = router;
