import { Show } from "../models/Show.js";

export const viewShows = async (req, res, next) => {
	try {
		const shows = await Show.find()
			.populate("movie", "movieName")
			.populate("theater", "theaterName");
		res.json(shows);
	} catch (err) {
		console.log("Unable to get Shows");
		console.log(err.message);
		return res.json({ message: "Error", error: err.message });
	}
};

export const addShow = async (req, res, next) => {
	const { showTime, movie, theater } = req.body;

	try {
		const show = new Show({
			showTime,
			movie,
			theater,
		});
		await show.save();
		return res.send("Success");
	} catch (err) {
		console.log("Unable to save Show");
		console.log(err.message);
		return res.json({ message: "Error", error: err.message });
	}
};
