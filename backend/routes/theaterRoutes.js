import { Router } from "express";
import {
	viewTheaters,
	addTheater,
	viewIndividualTheater,
	editIndividualTheater,
	deleteIndividualTheater,
} from "../controllers/theaterController.js";
import { addReview, viewReviews } from "../controllers/reviewController.js";
import {
	deleteShow,
	editShow,
	individualShow,
	viewShows,
} from "../controllers/showController.js";
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
router.patch(
	"/:theaterid",
	authenticateToken,
	authorization("Admin", "TheaterOwner"),
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
	addReview
);
router.get("/:theaterid/reviews", viewReviews);
router.get("/:theaterid/shows", viewShows);
router.get(
	"/:theaterid",
	authenticateToken,
	authorization("Admin", "TheaterOwner"),
	viewIndividualTheater
);

router.patch(
	"/:theaterid/shows/:showid",
	authenticateToken,
	authorization("Admin", "TheaterOwner"),
	editShow
);

router.delete(
	"/:theaterid/shows/:showid",
	authenticateToken,
	authorization("Admin", "TheaterOwner"),
	deleteShow
);

export default router;
