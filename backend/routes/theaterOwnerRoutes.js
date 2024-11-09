import { Router } from "express";
const router = Router();
import {
	viewTheaterOwners,
	registerTheaterOwner,
	loginTheaterOwner,
	viewTheaterOwnerProfile,
	updateTheaterOwnerProfile,
	resetTheaterOwnerPassword,
} from "../controllers/theaterOwnerController.js";
import { authenticateToken } from "../middleware/authentication.js";
import { viewTheaters } from "../controllers/theaterController.js";
import { authorization } from "../middleware/authorization.js";
import { checkAuth } from "../controllers/commonControllers.js";

router.get(
	"/",
	authenticateToken,
	authorization("Admin"),
	viewTheaterOwners
); /*Admin Only*/
router.post("/register", registerTheaterOwner);
router.post("/login", loginTheaterOwner);
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
	resetTheaterOwnerPassword
);
router.patch(
	"/:ownerid/profile",
	authenticateToken,
	authorization("TheaterOwner", "Admin"),
	updateTheaterOwnerProfile
); //Edit profile

router.get(
	"/check-theater-owner",
	authenticateToken,
	authorization("TheaterOwner"),
	checkAuth
);
export default router;
