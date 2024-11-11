import { Router } from "express";
const router = Router();
import {
	viewShows,
	addShow,
	individualShow,
} from "../controllers/showController.js";
import { authenticateToken } from "../middleware/authentication.js";
import { authorization } from "../middleware/authorization.js";

router.get("/", viewShows);
router.post(
	"/newShow",
	authenticateToken,
	authorization("Admin", "TheaterOwner"),
	addShow
);
router.get("/:showId", individualShow);

export default router;
