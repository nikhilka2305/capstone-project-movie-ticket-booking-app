import express from "express";
const router = express.Router();
import {
	viewAdmins,
	registerAdmin,
	loginAdmin,
	viewAdminProfile,
	updateAdminProfile,
} from "../controllers/adminController.js";
import { authenticateToken } from "../middleware/authentication.js";
import { authorization } from "../middleware/authorization.js";
import { viewMovies } from "../controllers/movieController.js";

router.get("/", authenticateToken, authorization("Admin"), viewAdmins);
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.get(
	"/:adminid",
	authenticateToken,
	authorization("Admin"),
	viewAdminProfile
);
router.get(
	"/:adminid/movies",
	authenticateToken,
	authorization("Admin"),
	viewMovies
);
router.patch(
	"/:adminid",
	authenticateToken,
	authorization("Admin"),
	updateAdminProfile
);

export default router;
