import { Router } from "express";
const router = Router();
import {
	viewTheaterOwners,
	registerTheaterOwner,
	loginTheaterOwner,
	viewTheaterOwnerProfile,
	updateTheaterOwnerProfile,
} from "../controllers/theaterOwnerController.js";
import { authenticateToken } from "../middleware/authentication.js";
import { viewTheaters } from "../controllers/theaterController.js";
import { authorization } from "../middleware/authorization.js";

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
	"/:ownerid",
	authenticateToken,
	authorization("TheaterOwner", "Admin"),
	viewTheaterOwnerProfile
);
router.patch(
	"/:ownerid",
	authenticateToken,
	authorization("TheaterOwner", "Admin"),
	updateTheaterOwnerProfile
); //Edit profile

export default router;
