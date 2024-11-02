const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.get("/", (req, res) => {
	res.send("Admin Routes Working");
});

module.exports = router;
