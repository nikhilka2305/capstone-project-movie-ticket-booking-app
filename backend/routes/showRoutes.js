import { Router } from "express";
const router = Router();
import {
	viewShows,
	addShow,
	individualShow,
	editShow,
	deleteShow,
} from "../controllers/showController.js";
import { authenticateToken } from "../middleware/authentication.js";
import { authorization } from "../middleware/authorization.js";
import { validateShow } from "../middleware/showValidation.js";

router.get("/", viewShows);
router.patch(
	"/:showid",
	authenticateToken,
	authorization("Admin", "TheaterOwner"),
	validateShow("Patch"),
	editShow
);
router.delete(
	"/:showid",
	authenticateToken,
	authorization("Admin", "TheaterOwner"),
	deleteShow
);
router.get("/:showId", individualShow);

export default router;
