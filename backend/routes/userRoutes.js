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

router.get(
	"/",
	authenticateToken,
	authorization("Admin"),
	viewUsers
); /* Admin Only*/
router.post("/register", registerUser);
router.post("/login", loginUser);
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
	resetUserPassword
);
router.patch(
	"/:userid/profile",
	authenticateToken,
	authorization("User", "Admin"),
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
),
	router.get(
		"/check-user",
		authenticateToken,
		authorization("User"),
		checkAuth
	);
// check User route for user validation..
export default router;
