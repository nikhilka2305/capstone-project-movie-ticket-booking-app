import { Router } from "express";
import { viewTheaters, addTheater } from "../controllers/theaterController.js";
const router = Router();

router.get("/", viewTheaters);
router.post("/newTheater", addTheater);

export default router;
