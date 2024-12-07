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
import {
	getBookingRevenueShare,
	getBookingsByTheaters,
	getMonthlyData,
	getPersonalBookingStats,
	totalBookingStats,
	viewBookings,
	viewPersonalBookings,
} from "../controllers/bookingController.js";
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
	router.get(
		"/:ownerid/getbookingsbytheaters",
		authenticateToken,
		authorization("Admin", "TheaterOwner"),
		getBookingsByTheaters
	),
	router.get(
		"/:ownerid/getmonthlydata",
		authenticateToken,
		authorization("Admin", "TheaterOwner"),
		getMonthlyData
	);
router.get(
	"/:ownerid/getbookingrevenueshare",
	authenticateToken,
	authorization("Admin", "TheaterOwner"),
	getBookingRevenueShare
);
router.get(
	"/:ownerid/theaterbookings",
	authenticateToken,
	authorization("Admin", "TheaterOwner"),
	viewBookings
);
router.get(
	"/:ownerid/getbookingstats",
	authenticateToken,
	getPersonalBookingStats
);
router.get(
	"/:ownerid/totalbookingstats",
	authenticateToken,
	authorization("Admin", "TheaterOwner"),
	totalBookingStats
);
router.delete(
	"/:ownerid",
	authenticateToken,
	authorization("Admin", "TheaterOwner"),
	deleteTheaterOwner
);

export default router;
