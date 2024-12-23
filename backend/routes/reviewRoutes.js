import { Router } from "express";
const router = Router();
import {
	viewReviews,
	addReview,
	editReview,
	deleteReview,
	viewIndividualReview,
} from "../controllers/reviewController.js";
import { authenticateToken } from "../middleware/authentication.js";
import { authorization } from "../middleware/authorization.js";
import { validateReview } from "../middleware/reviewValidation.js";

router.get("/", viewReviews);
router.get(
	"/:reviewid",
	authenticateToken,
	authorization("Admin", "User"),
	viewIndividualReview
);
router.patch(
	"/:reviewid",
	authenticateToken,
	authorization("Admin", "User"),
	validateReview("Patch"),
	editReview
);
router.delete(
	"/:reviewid",
	authenticateToken,
	authorization("Admin", "User"),
	deleteReview
);
// router.post("/newReview", authenticateToken, authorization("User"), addReview);

export default router;
