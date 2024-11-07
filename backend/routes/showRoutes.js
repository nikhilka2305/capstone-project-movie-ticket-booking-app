import { Router } from "express";
const router = Router();
import { viewShows, addShow } from "../controllers/showController.js";

router.get("/", viewShows);
router.post("/newShow", addShow);

export default router;
