import { Router } from "express";
const router = Router();
import {
	viewTheaterOwners,
	registerTheaterOwner,
	loginTheaterOwner,
	viewTheaterOwnerProfile,
	updateTheaterOwnerProfile,
	resetTheaterOwnerPassword,
	deleteTheaterOwner,
} from "../controllers/theaterOwnerController.js";
import { authenticateToken } from "../middleware/authentication.js";
import { viewTheaters } from "../controllers/theaterController.js";
import { authorization } from "../middleware/authorization.js";
import { checkAuth } from "../controllers/commonControllers.js";
import { viewPersonalBookings } from "../controllers/bookingController.js";
import {
	validateUserPatch,
	validateUserReg,
} from "../middleware/userRegistrationValidation.js";
import { validateUserLogin } from "../middleware/userLoginValidation.js";
import { multerSingleFileHandler } from "../middleware/multer.js";

router.get("/", authenticateToken, authorization("Admin"), viewTheaterOwners);
router.post("/register", validateUserReg("TheaterOwner"), registerTheaterOwner);
router.post("/login", validateUserLogin, loginTheaterOwner);
router.get(
	"/:ownerid/theaters",
	authenticateToken,
	authorization("TheaterOwner", "Admin"),
	viewTheaters
);
router.get(
	"/:ownerid/profile",
	authenticateToken,
	authorization("TheaterOwner", "Admin"),
	viewTheaterOwnerProfile
);
router.patch(
	"/:ownerid/resetPassword",
	authenticateToken,
	authorization("TheaterOwner", "Admin"),
	validateUserPatch("TheaterOwner"),
	resetTheaterOwnerPassword
);
router.patch(
	"/:ownerid/profile",
	authenticateToken,
	authorization("TheaterOwner", "Admin"),
	multerSingleFileHandler("displayimage"),
	validateUserPatch("TheaterOwner"),
	updateTheaterOwnerProfile
); //Edit profile

router.get(
	"/:ownerid/bookings",
	authenticateToken,
	authorization("Admin", "TheaterOwner"),
	viewPersonalBookings
),
	router.delete(
		"/:ownerid",
		authenticateToken,
		authorization("Admin", "TheaterOwner"),
		deleteTheaterOwner
	);

router.get(
	"/check-theater-owner",
	authenticateToken,
	authorization("TheaterOwner"),
	checkAuth
);
export default router;
