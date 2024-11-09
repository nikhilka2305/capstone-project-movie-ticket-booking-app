import express from "express";
const router = express.Router();
import {
	viewUsers,
	registerUser,
	loginUser,
	viewUserProfile,
	updateUserProfile,
} from "../controllers/userController.js";
import { authenticateToken } from "../middleware/authentication.js";
import { authorization } from "../middleware/authorization.js";

router.get(
	"/",
	authenticateToken,
	authorization("Admin"),
	viewUsers
); /* Admin Only*/
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get(
	"/:userid",
	authenticateToken,
	authorization("User", "Admin"),
	viewUserProfile
);
router.patch(
	"/:userid",
	authenticateToken,
	authorization("User", "Admin"),
	updateUserProfile
); //Edit profile

// check User route for user validation..
export default router;
