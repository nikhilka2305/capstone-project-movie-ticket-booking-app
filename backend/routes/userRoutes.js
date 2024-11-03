import express from "express";
const router = express.Router();
import { viewUsers, addUser } from "../controllers/userController.js";

router.get("/", viewUsers);
router.post("/newUser", addUser);

export default router;
