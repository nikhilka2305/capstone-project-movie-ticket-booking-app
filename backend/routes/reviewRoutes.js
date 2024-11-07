import { Router } from "express";
const router = Router();
import { viewReviews, addReview } from "../controllers/reviewController.js";

router.get("/", viewReviews);
router.post("/newReview", addReview);

export default router;
