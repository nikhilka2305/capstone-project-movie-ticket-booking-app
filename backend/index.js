import express, { json } from "express";
import { config } from "dotenv";

import connectDB from "./configs/db.js";

import userRouter from "./routes/userRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import movieRouter from "./routes/movieRoutes.js";
import reviewRouter from "./routes/reviewRoutes.js";
import theaterOwnerRouter from "./routes/theaterOwnerRoutes.js";
import theaterRouter from "./routes/theaterRoutes.js";

config();
const app = express();
connectDB();

const port = process.env.PORT || 5000;

app.use(json());

app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/booking", bookingRouter);
app.use("/movie", movieRouter);
app.use("/review", reviewRouter);
app.use("/theater", theaterRouter);
app.use("/theaterOwner", theaterOwnerRouter);

app.get("/", (req, res, next) => {
	res.send("App Index Page");
});
app.listen(port, () => {
	console.log(`Listening at ${port}`);
});
