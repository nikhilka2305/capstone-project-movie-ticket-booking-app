import { Router } from "express";
const router = Router();
import {
	viewMovies,
	viewIndividualMovie,
	addMovie,
	editIndividualMovie,
} from "../controllers/movieController.js";
import { viewReviews, addReview } from "../controllers/reviewController.js";
import { viewShows } from "../controllers/showController.js";
import { authenticateToken } from "../middleware/authentication.js";
import { authorization } from "../middleware/authorization.js";

router.get("/", viewMovies);
router.get("/:movieid", viewIndividualMovie);
router.post(
	"/:movieid",
	authenticateToken,
	authorization("Admin"),
	editIndividualMovie
);
router.post("/addMovie", addMovie);
router.post(
	"/:movieid/addreview",
	authenticateToken,
	authorization("User"),
	addReview
);
router.get("/:movieid/reviews", viewReviews);
router.get("/:movieid/shows", viewShows);

export default router;
