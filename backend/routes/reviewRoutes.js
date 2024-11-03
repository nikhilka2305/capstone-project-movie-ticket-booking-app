import { Router } from "express";
const router = Router();

router.get("/", (req, res) => {
	res.send("Review Routes Working");
});

export default router;
