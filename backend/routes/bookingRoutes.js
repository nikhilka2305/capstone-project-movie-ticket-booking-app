import { Router } from "express";
const router = Router();
import { addBooking, viewBookings } from "../controllers/bookingController.js";
import { authenticateToken } from "../middleware/authentication.js";
import { authorization } from "../middleware/authorization.js";
router.get("/", authenticateToken, viewBookings);
router.post("/newBooking", authenticateToken, addBooking);

export default router;
