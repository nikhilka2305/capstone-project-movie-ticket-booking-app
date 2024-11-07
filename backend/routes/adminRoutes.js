import express from "express";
const router = express.Router();
import {
	viewAdmins,
	registerAdmin,
	loginAdmin,
} from "../controllers/adminController.js";
import { authenticateToken } from "../middleware/authentication.js";

router.get("/", authenticateToken, viewAdmins);
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

export default router;
