import { Router } from "express";
const router = Router();

router.get("/", (req, res) => {
	res.send("Theater Owner Routes Working");
});

export default router;
