import express from "express";
const router = express.Router();

import userRouter from "./userRoutes.js";
import adminRouter from "./adminRoutes.js";
import bookingRouter from "./bookingRoutes.js";
import movieRouter from "./movieRoutes.js";
import reviewRouter from "./reviewRoutes.js";
import theaterOwnerRouter from "./theaterOwnerRoutes.js";
import theaterRouter from "./theaterRoutes.js";
import showRouter from "./showRoutes.js";
import { authenticateToken } from "../middleware/authentication.js";
import { logout } from "../controllers/commonControllers.js";

router.use("/user", userRouter);
router.use("/admin", adminRouter);
router.use("/booking", bookingRouter);
router.use("/movie", movieRouter);
router.use("/review", reviewRouter);
router.use("/theater", theaterRouter);
router.use("/show", showRouter);
router.use("/theaterOwner", theaterOwnerRouter);
router.post("/logout", authenticateToken, logout);

export { router as router };
