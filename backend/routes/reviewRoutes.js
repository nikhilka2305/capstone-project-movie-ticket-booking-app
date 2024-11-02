const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");

router.get("/", (req, res) => {
	res.send("Review Routes Working");
});

module.exports = router;
