import { Router } from "express";
import {
	viewTheaters,
	addTheater,
	viewIndividualTheater,
} from "../controllers/theaterController.js";
import { addReview, viewReviews } from "../controllers/reviewController.js";
import { viewShows } from "../controllers/showController.js";
import { authenticateToken } from "../middleware/authentication.js";
import { authorization } from "../middleware/authorization.js";

const router = Router();

router.get("/", viewTheaters);
router.post(
	"/newTheater",
	authenticateToken,
	authorization("Admin", "TheaterOwner"),
	addTheater
);
router.post(
	"/:theaterid/addreview",
	authenticateToken,
	authorization("User"),
	addReview
);
router.get("/:theaterid/reviews", viewReviews);
router.get("/:theaterid/shows", viewShows);
router.get("/:theaterid", viewIndividualTheater);

export default router;
