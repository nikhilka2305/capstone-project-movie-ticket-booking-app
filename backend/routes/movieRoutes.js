import { Router } from "express";
const router = Router();

router.get("/", (req, res) => {
	res.send("Movie Routes Working");
});

export default router;
