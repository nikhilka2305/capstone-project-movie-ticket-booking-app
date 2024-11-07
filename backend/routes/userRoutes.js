import express from "express";
const router = express.Router();
import {
	viewUsers,
	registerUser,
	loginUser,
} from "../controllers/userController.js";
import { authenticateToken } from "../middleware/authentication.js";

router.get("/", authenticateToken, viewUsers); /* Admin Only*/
router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;
