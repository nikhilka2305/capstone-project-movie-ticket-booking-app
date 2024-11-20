import express, { json } from "express";
import connectDB from "./configs/db.js";
import { router } from "./routes/index.js";
import cookieParser from "cookie-parser";
import HandleError from "./middleware/errorHandling.js";
const app = express();
connectDB();
const port = process.env.PORT || 5000;
app.use(cookieParser());
app.use(json());

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", process.env.CORS_DOMAIN);
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, Authorization"
	);
	res.setHeader("Access-Control-Allow-Credentials", true);
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, PATCH, DELETE, OPTIONS, HEAD"
	);
	next();
});

app.use("/", router);
app.get("/", (req, res, next) => {
	res.send("App Index Page");
});

app.all("*", (req, res, next) => {
	try {
		throw new HandleError("Such an end point doesn't exist...Class", 404);
	} catch (err) {
		res.status(err.statusCode).json({ message: err.message });
	}
});

app.listen(port, () => {
	console.log(`Listening at ${port}`);
});
