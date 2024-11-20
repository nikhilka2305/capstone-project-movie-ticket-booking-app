import { Router } from "express";
import {
	viewTheaters,
	addTheater,
	viewIndividualTheater,
	editIndividualTheater,
	deleteIndividualTheater,
} from "../controllers/theaterController.js";
import {
	addReview,
	averageRating,
	viewReviews,
} from "../controllers/reviewController.js";
import {
	addShow,
	deleteShow,
	editShow,
	individualShow,
	viewShows,
} from "../controllers/showController.js";
import { authenticateToken } from "../middleware/authentication.js";
import { authorization } from "../middleware/authorization.js";
import { multerMultipleFileHandler } from "../middleware/multer.js";
import { validateTheater } from "../middleware/theaterValidation.js";
import { validateReview } from "../middleware/reviewValidation.js";
import { validateShow } from "../middleware/showValidation.js";

const router = Router();

router.get("/", viewTheaters);
router.post(
	"/addtheater",
	authenticateToken,
	authorization("Admin", "TheaterOwner"),
	multerMultipleFileHandler("theaterimages", 3),
	validateTheater("Add"),
	addTheater
);
router.patch(
	"/:theaterid",
	authenticateToken,
	authorization("Admin", "TheaterOwner"),

	multerMultipleFileHandler("theaterimages", 3),
	validateTheater("Patch"),
	editIndividualTheater
);
router.delete(
	"/:theaterid",
	authenticateToken,
	authorization("Admin", "TheaterOwner"),
	deleteIndividualTheater
);
router.post(
	"/:theaterid/addreview",
	authenticateToken,
	authorization("User"),
	validateReview("Add"),
	addReview
);

router.get("/:theaterid/avgrating", averageRating);
router.get("/:theaterid/reviews", viewReviews);
router.get("/:theaterid/shows", viewShows);
router.get(
	"/:theaterid",
	// authenticateToken,
	// authorization("Admin", "TheaterOwner"),
	viewIndividualTheater
);

router.post(
	"/:theaterid/newShow",
	authenticateToken,
	authorization("Admin", "TheaterOwner"),
	validateShow("Add"),
	addShow
);

export default router;
