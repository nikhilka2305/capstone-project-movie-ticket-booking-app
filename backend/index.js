const express = require("express");
const dotenv = require("dotenv");

const connectDB = require("./configs/db");

const userRouter = require("./routes/userRoutes");
const adminRouter = require("./routes/adminRoutes");
const bookingRouter = require("./routes/bookingRoutes");
const movieRouter = require("./routes/movieRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const theaterOwnerRouter = require("./routes/theaterOwnerRoutes");
const theaterRouter = require("./routes/theaterRoutes");

dotenv.config();
const app = express();
connectDB();

const port = process.env.PORT || 5000;

app.use(express.json());

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
