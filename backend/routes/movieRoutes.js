import { Router } from "express";
const router = Router();
import { viewMovies, addMovie } from "../controllers/movieController.js";

router.get("/", viewMovies);
router.post("/newMovie", addMovie);

export default router;
