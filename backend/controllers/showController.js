import { Movie } from "../models/Movie.js";
import { Show } from "../models/Show.js";
import { Theater } from "../models/Theater.js";
import { ObjectId } from "mongodb";

export const viewShows = async (req, res, next) => {
	const { movieid, theaterid } = req.params;
	console.log(movieid, theaterid);
	const now = new Date();
	console.log(now);
	const filterConditions = { showTime: { $gt: now } };

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
			.populate("theater", "theaterName seats seatClasses owner");

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

export const individualShow = async (req, res, next) => {
	const { showId, theaterId } = req.params;

	try {
		console.log("ind show");
		console.log(showId);

		const show = await Show.findOne({ showId: showId })
			.populate("movie", "movieName")
			.populate("theater", "theaterName seats seatClasses owner");
		if (!show) throw new Error("No such show exists");
		return res.status(200).json(show);
	} catch (err) {
		res.status(404).json({ error: "Couldn't find show details", message: err });
	}
};

export const editShow = async (req, res, next) => {
	const { showid } = req.params;
	try {
		const show = await Show.findOne({ showId: showid })
			.populate("movie", "movieName")
			.populate("theater", "theaterName seats seatClasses owner");
		console.log(show);
		if (!show || show.deleted)
			return res.status(404).json({
				error: "Show Cannot Be Accessed",
				message: "Show not found or deleted",
			});

		if (
			req.user.role !== "Admin" &&
			!new ObjectId(req.user.loggedUserObjectId).equals(show.theater.owner)
		) {
			console.log(req.user.role !== "Admin");
			console.log;
			throw new Error("You are not authorized to do this");
		}
		const { showTime, movie } = req.body;
		const updatedShow = await Show.findOneAndUpdate(
			{ showId: showid },
			{ showTime, movie },
			{ runValidators: true, new: true }
		);
		console.log(updatedShow);
		return res.json({ message: `Succesfully Updated ${showid}` });
	} catch (err) {
		console.log("Unable to save Show");
		console.log(err.message);
		return res.json({ message: "Error", error: err.message });
	}
};

export const deleteShow = async (req, res, next) => {
	const { showid } = req.params;
	try {
		const show = await Show.findOne({ showId: showid })
			.populate("movie", "movieName")
			.populate("theater", "theaterName seats seatClasses owner");
		console.log(show);
		if (!show || show.deleted)
			return res.status(404).json({
				error: "Show Cannot Be Accessed",
				message: "Show not found or deleted",
			});

		if (
			req.user.role !== "Admin" &&
			!new ObjectId(req.user.loggedUserObjectId).equals(show.theater.owner)
		) {
			console.log(req.user.role !== "Admin");
			console.log;
			throw new Error("You are not authorized to do this");
		}

		const updatedShow = await Show.findOneAndUpdate(
			{ showId: showid },
			{ deleted: true },
			{ runValidators: true, new: true }
		);
		console.log(updatedShow);
		return res.json({ message: `Succesfully Deleted ${showid}` });
	} catch (err) {
		console.log("Unable to save Show");
		console.log(err.message);
		return res.json({ message: "Error", error: err.message });
	}
	// try {
	// 	const { showTime, movie, theater } = req.body;
	// 	const show = Show.findOne({ showId: showId });
	// 	if (!show)
	// 		// const show = new Show({
	// 		// 	showTime,
	// 		// 	movie,
	// 		// 	theater,
	// 		// });
	// 		await show.save();
	// 	return res.send("Success");
	// } catch (err) {
	// 	console.log("Unable to save Show");
	// 	console.log(err.message);
	// 	return res.json({ message: "Error", error: err.message });
	// }
};
