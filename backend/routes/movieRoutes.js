import { Router } from "express";
const router = Router();
import {
	viewMovies,
	viewIndividualMovie,
	addMovie,
	editIndividualMovie,
	deleteIndividualMovie,
} from "../controllers/movieController.js";
import {
	viewReviews,
	addReview,
	averageRating,
} from "../controllers/reviewController.js";
import { viewShows } from "../controllers/showController.js";
import { authenticateToken } from "../middleware/authentication.js";
import { authorization } from "../middleware/authorization.js";
import { multerSingleFileHandler } from "../middleware/multer.js";
import { validateMovie } from "../middleware/movieValidation.js";
import { validateReview } from "../middleware/reviewValidation.js";

router.get("/", viewMovies);
router.get("/:movieid", viewIndividualMovie);

router.post(
	"/addMovie",
	authenticateToken,
	authorization("Admin", "TheaterOwner"),
	multerSingleFileHandler("movieposter"),
	validateMovie("Add"),
	addMovie
);

router.patch(
	"/:movieid",
	authenticateToken,
	authorization("Admin"),
	multerSingleFileHandler("movieposter"),
	validateMovie("Patch"),
	editIndividualMovie
);

router.delete(
	"/:movieid",
	authenticateToken,
	authorization("Admin"),
	deleteIndividualMovie
);

router.post(
	"/:movieid/addreview",
	authenticateToken,
	authorization("User"),
	validateReview("Add"),
	addReview
);

router.get("/:movieid/avgrating", averageRating);

router.get("/:movieid/reviews", viewReviews);
router.get("/:movieid/shows", viewShows);

export default router;
