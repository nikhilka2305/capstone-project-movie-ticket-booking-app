import express from "express";
const router = express.Router();
import {
	viewAdmins,
	registerAdmin,
	loginAdmin,
	viewAdminProfile,
	updateAdminProfile,
	resetAdminPassword,
	deleteAdmin,
} from "../controllers/adminController.js";
import { authenticateToken } from "../middleware/authentication.js";
import { authorization } from "../middleware/authorization.js";
import { viewMovies } from "../controllers/movieController.js";
import { checkAuth } from "../controllers/commonControllers.js";
import { viewTheaters } from "../controllers/theaterController.js";
import { viewPersonalBookings } from "../controllers/bookingController.js";
import {
	validateUserPatch,
	validateUserReg,
} from "../middleware/userRegistrationValidation.js";
import { validateUserLogin } from "../middleware/userLoginValidation.js";
import { multerSingleFileHandler } from "../middleware/multer.js";

router.get("/", authenticateToken, authorization("Admin"), viewAdmins);
router.post("/register", validateUserReg("Admin"), registerAdmin);
router.post("/login", validateUserLogin, loginAdmin);
router.get(
	"/:adminid/profile",
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
router.get(
	"/:adminid/theaters",
	authenticateToken,
	authorization("Admin"),
	viewTheaters
);
router.patch(
	"/:adminid/resetPassword",
	authenticateToken,
	authorization("Admin"),
	validateUserPatch("Admin"),
	resetAdminPassword
);
router.patch(
	"/:adminid/profile",
	authenticateToken,
	authorization("Admin"),
	multerSingleFileHandler("displayimage"),
	validateUserPatch("Admin"),
	updateAdminProfile
);
router.get(
	"/:adminid/bookings",
	authenticateToken,
	authorization("Admin"),
	viewPersonalBookings
),
	router.delete(
		"/:adminid",
		authenticateToken,
		authorization("Admin"),
		deleteAdmin
	);
router.get(
	"/check-admin",
	authenticateToken,
	authorization("Admin"),
	checkAuth
);
export default router;
