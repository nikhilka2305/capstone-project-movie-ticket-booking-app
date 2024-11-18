import express from "express";
const router = express.Router();

import {
	viewUsers,
	registerUser,
	loginUser,
	viewUserProfile,
	updateUserProfile,
	resetUserPassword,
	deleteUser,
} from "../controllers/userController.js";
import { authenticateToken } from "../middleware/authentication.js";
import { authorization } from "../middleware/authorization.js";
import { checkAuth } from "../controllers/commonControllers.js";
import { viewPersonalBookings } from "../controllers/bookingController.js";
import {
	validateUserPatch,
	validateUserReg,
} from "../middleware/userRegistrationValidation.js";
import { validateUserLogin } from "../middleware/userLoginValidation.js";
import { multerSingleFileHandler } from "../middleware/multer.js";
import { viewIndividualUserReview } from "../controllers/reviewController.js";

router.get(
	"/",
	authenticateToken,
	authorization("Admin"),
	viewUsers
); /* Admin Only*/
router.post("/register", validateUserReg("User"), registerUser);
router.post("/login", validateUserLogin, loginUser);
router.get(
	"/:userid/profile",
	authenticateToken,
	authorization("User", "Admin"),
	viewUserProfile
);
router.patch(
	"/:userid/resetPassword",
	authenticateToken,
	authorization("User", "Admin"),
	validateUserPatch("User"),
	resetUserPassword
);
router.patch(
	"/:userid/profile",
	authenticateToken,
	authorization("User", "Admin"),
	multerSingleFileHandler("displayimage"),
	validateUserPatch("User"),
	updateUserProfile
); //Edit profile

router.delete(
	"/:userid",
	authenticateToken,
	authorization("Admin", "User"),
	deleteUser
);

router.get(
	"/:userid/bookings",
	authenticateToken,
	authorization("Admin", "User"),
	viewPersonalBookings
);

router.get(
	"/:userid/reviews",
	authenticateToken,
	authorization("Admin", "User"),
	viewIndividualUserReview
);

export default router;
