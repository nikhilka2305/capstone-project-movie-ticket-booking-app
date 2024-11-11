import { Router } from "express";
const router = Router();
import {
	viewReviews,
	addReview,
	editReview,
	deleteReview,
} from "../controllers/reviewController.js";
import { authenticateToken } from "../middleware/authentication.js";
import { authorization } from "../middleware/authorization.js";

router.get("/", viewReviews);
router.patch(
	"/:reviewid",
	authenticateToken,
	authorization("Admin", "User"),
	editReview
);
router.delete(
	"/:reviewid",
	authenticateToken,
	authorization("Admin", "User"),
	deleteReview
);
router.post("/newReview", authenticateToken, authorization("User"), addReview);

export default router;
