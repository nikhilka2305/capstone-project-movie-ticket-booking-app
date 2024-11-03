import { Router } from "express";
const router = Router();
import {
	viewTheaterOwners,
	addTheaterOwner,
} from "../controllers/theaterOwnerController.js";

router.get("/", viewTheaterOwners);
router.post("/newTheaterOwner", addTheaterOwner);

export default router;
