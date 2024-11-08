import { Router } from "express";
import {
	viewTheaters,
	addTheater,
	viewIndividualTheater,
} from "../controllers/theaterController.js";
import { viewReviews } from "../controllers/reviewController.js";
import { viewShows } from "../controllers/showController.js";

const router = Router();

router.get("/", viewTheaters);
router.post("/newTheater", addTheater);
router.get("/:theaterid/reviews", viewReviews);
router.get("/:theaterid/shows", viewShows);
router.get("/:theaterid", viewIndividualTheater);

export default router;
