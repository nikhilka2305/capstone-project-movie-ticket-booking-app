import { Router } from "express";
const router = Router();
import {
	viewTheaterOwners,
	registerTheaterOwner,
	loginTheaterOwner,
} from "../controllers/theaterOwnerController.js";
import { authenticateToken } from "../middleware/authentication.js";

router.get("/", authenticateToken, viewTheaterOwners); /*Admin Only*/
router.post("/register", registerTheaterOwner);
router.post("/login", loginTheaterOwner);

export default router;
