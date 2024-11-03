import { Router } from "express";
const router = Router();

router.get("/", (req, res) => {
	res.send("Booking Routes Working");
});

export default router;
