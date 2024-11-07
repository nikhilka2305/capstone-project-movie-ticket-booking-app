import express, { json } from "express";
import connectDB from "./configs/db.js";
import { router } from "./routes/index.js";

const app = express();
connectDB();
const port = process.env.PORT || 5000;
app.use(json());

app.use("/", router);
app.get("/", (req, res, next) => {
	res.send("App Index Page");
});

app.all("*", (req, res) => {
	res.status(404).json({ message: "Such an endpoint doesn't exist" });
});
app.listen(port, () => {
	console.log(`Listening at ${port}`);
});
