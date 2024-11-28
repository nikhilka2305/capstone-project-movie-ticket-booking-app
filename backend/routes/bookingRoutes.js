import { Router } from "express";
const router = Router();
import {
	addBooking,
	cancelBooking,
	getPersonalBookingStats,
	viewBookings,
	viewIndividualBooking,
} from "../controllers/bookingController.js";
import { authenticateToken } from "../middleware/authentication.js";
import { authorization } from "../middleware/authorization.js";
import { validateBooking } from "../middleware/bookingValidation.js";
router.get(
	"/",
	authenticateToken,
	authorization("Admin", "TheaterOwner"),
	viewBookings
);

router.get("/:bookingid", authenticateToken, viewIndividualBooking);
router.delete("/:bookingid", authenticateToken, cancelBooking);
router.post("/newBooking", authenticateToken, validateBooking, addBooking);

export default router;
