import { Movie } from "../models/Movie.js";
import { Show } from "../models/Show.js";
import { Theater } from "../models/Theater.js";
import { ObjectId } from "mongodb";
import { handleShowDeletion } from "../utils/deleteCascadeManager.js";
import HandleError from "../middleware/errorHandling.js";
import { validateDateTime } from "../utils/validateDate.js";

export const viewShows = async (req, res, next) => {
	const { movieid, theaterid } = req.params;
	console.log(movieid, theaterid);
	const now = new Date();
	console.log(now);
	const filterConditions = { showTime: { $gt: now } };
	if (!req.user) filterConditions.deleted = false;

	try {
		if (movieid) {
			const movie = await Movie.findOne({ movieId: movieid });
			if (!movie || movie.adminApprovalStatus !== "Approved")
				throw new HandleError("Such a movie doesn't exist or might be deleted");
			console.log("---");
			console.log(movie._id);
			filterConditions.movie = movie._id;
			console.log(filterConditions);
		} else if (theaterid) {
			const theater = await Theater.findOne({ theaterId: theaterid });
			if (!theater || theater.adminApprovalStatus !== "Approved")
				throw new HandleError(
					"Such a theater doesn't exist or might be deleted"
				);
			console.log("---");
			console.log(theater._id);
			filterConditions.theater = theater._id;
		}

		const shows = await Show.find(filterConditions)
			.populate("movie", "movieName posterImage")
			.populate("theater", "theaterName seats seatClasses owner");

		res.json(shows);
	} catch (err) {
		console.log("Unable to get Shows");
		console.log(err.message);
		return res.json({ message: "Error", error: err.message });
	}
};

export const addShow = async (req, res, next) => {
	const { theaterid } = req.params;
	const { showTime, movie } = req.body;
	// Verify Theater Owner

	try {
		console.log(theaterid);
		const theater = await Theater.findOne({ theaterId: theaterid })
			.populate("owner", "ownerId username _id")
			.lean();
		console.log(theater);

		if (!theater || theater.adminApprovalStatus !== "Approved")
			throw new HandleError(
				"This theater is not found or is not available to host shows",
				404
			);
		const checkmovie = await Movie.findById(movie)
			.select("movieId movieName, adminApprovalStatus")
			.lean();
		if (!checkmovie || checkmovie.adminApprovalStatus !== "Approved")
			throw new HandleError(
				"This movie is not found or is not available to show",
				404
			);

		if (
			req.user.role !== "Admin" &&
			!new ObjectId(req.user.loggedUserObjectId).equals(theater.owner._id)
		) {
			console.log(req.user.role !== "Admin");
			console.log;
			throw new HandleError("You are not authorized to do this", 403);
		}
		const validShowTime = validateDateTime(showTime);
		if (validShowTime) {
			const show = new Show({
				showTime,
				movie,
				theater: theater._id,
			});
			await show.save();
			return res.status(201).json({ message: "Successfully created show" });
		}
	} catch (err) {
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

		if (
			req.user.role !== "Admin" &&
			!new ObjectId(req.user.loggedUserObjectId).equals(show.theater.owner)
		) {
			console.log(req.user.role !== "Admin");
			console.log;
			throw new Error("You are not authorized to do this");
		}
		handleShowDeletion(showid);

		return res.json({ message: `Succesfully Deleted ${showid}` });
	} catch (err) {
		console.log("Unable to save Show");
		console.log(err.message);
		return res.json({ message: "Error", error: err.message });
	}
};
