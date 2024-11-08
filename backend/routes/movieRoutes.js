import { Router } from "express";
const router = Router();
import {
	viewMovies,
	viewIndividualMovie,
	addMovie,
} from "../controllers/movieController.js";
import { viewReviews } from "../controllers/reviewController.js";
import { viewShows } from "../controllers/showController.js";

router.get("/", viewMovies);
router.get("/:movieid", viewIndividualMovie);
router.post("/addMovie", addMovie);
router.get("/:movieid/reviews", viewReviews);
router.get("/:movieid/shows", viewShows);

export default router;
