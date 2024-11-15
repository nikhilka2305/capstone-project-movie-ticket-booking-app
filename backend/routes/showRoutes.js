import { Router } from "express";
const router = Router();
import {
	viewShows,
	addShow,
	individualShow,
} from "../controllers/showController.js";
import { authenticateToken } from "../middleware/authentication.js";
import { authorization } from "../middleware/authorization.js";
import { validateShow } from "../middleware/showValidation.js";

router.get("/", viewShows);
// router.post(
// 	"/newShow",
// 	authenticateToken,
// 	authorization("Admin", "TheaterOwner"),
// 	validateShow("Add"),
// 	addShow
// );
router.get("/:showId", individualShow);

export default router;
