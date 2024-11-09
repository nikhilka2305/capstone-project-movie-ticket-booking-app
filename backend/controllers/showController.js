import { Movie } from "../models/Movie.js";
import { Show } from "../models/Show.js";
import { Theater } from "../models/Theater.js";

export const viewShows = async (req, res, next) => {
	const { movieid, theaterid } = req.params;
	console.log(movieid, theaterid);
	const filterConditions = {};

	try {
		if (movieid) {
			const movie = await Movie.findOne({ movieId: movieid });
			console.log("---");
			console.log(movie._id);
			filterConditions.movie = movie._id;
			console.log(filterConditions);
		} else if (theaterid) {
			const theater = await Theater.findOne({ theaterId: theaterid });
			console.log("---");
			console.log(theater._id);
			filterConditions.theater = theater._id;
		}

		const shows = await Show.find(filterConditions)
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
	const { showTime, movie, theater, bookedSeats } = req.body;

	try {
		const show = new Show({
			showTime,
			movie,
			theater,
			bookedSeats,
		});
		await show.save();
		return res.send("Success");
	} catch (err) {
		console.log("Unable to save Show");
		console.log(err.message);
		return res.json({ message: "Error", error: err.message });
	}
};
