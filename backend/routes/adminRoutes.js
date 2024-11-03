import express from "express";
const router = express.Router();
import { viewAdmins, addAdmin } from "../controllers/adminController.js";

router.get("/", viewAdmins);
router.post("/newAdmin", addAdmin);

export default router;
