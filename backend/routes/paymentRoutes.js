import { Router } from "express";
const router = Router();

import {
	getSessionData,
	makePayment,
} from "../controllers/paymentController.js";
import { authenticateToken } from "../middleware/authentication.js";

router.post("/create-checkout-session", authenticateToken, makePayment);
router.get("/get-session-data", authenticateToken, getSessionData);

export default router;
