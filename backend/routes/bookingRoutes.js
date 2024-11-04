import { Router } from "express";
const router = Router();
import { addBooking, viewBookings } from "../controllers/bookingController.js";

router.get("/", viewBookings);
router.post("/newBooking", addBooking);

export default router;
