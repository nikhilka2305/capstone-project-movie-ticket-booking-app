const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");

router.get("/", (req, res) => {
	res.send("Booking Routes Working");
});

module.exports = router;
