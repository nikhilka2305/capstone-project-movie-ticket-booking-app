const express = require("express");
const router = express.Router();
const theaterOwnerController = require("../controllers/theaterOwnerController");

router.get("/", (req, res) => {
	res.send("Theater Owner Routes Working");
});

module.exports = router;
