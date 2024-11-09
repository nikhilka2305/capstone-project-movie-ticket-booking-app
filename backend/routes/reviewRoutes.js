import { Router } from "express";
const router = Router();
import { viewReviews, addReview } from "../controllers/reviewController.js";
import { authenticateToken } from "../middleware/authentication.js";
import { authorization } from "../middleware/authorization.js";

router.get("/", viewReviews);
router.post("/newReview", authenticateToken, authorization("User"), addReview);

export default router;
