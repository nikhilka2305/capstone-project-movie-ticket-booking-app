import { Movie } from "../models/Movie.js";
import { Show } from "../models/Show.js";
import { Theater } from "../models/Theater.js";
import { ObjectId } from "mongodb";
import { handleShowDeletion } from "../utils/deleteCascadeManager.js";
import HandleError from "../middleware/errorHandling.js";
import { validateDateTime } from "../utils/validateDate.js";

export const viewShows = async (req, res, next) => {
	const { filter, page = 1, limit = 10 } = req.query;

	const { movieid, theaterid } = req.params;

	const now = new Date().toISOString();

	const filterConditions = { showTime: { $gt: now } };
	if (!req.user) filterConditions.deleted = false;

	try {
		if (movieid) {
			const movie = await Movie.findOne({ movieId: movieid });
			if (!movie || movie.adminApprovalStatus !== "Approved")
				throw new HandleError("Such a movie doesn't exist or might be deleted");

			filterConditions.movie = movie._id;
		} else if (theaterid) {
			const theater = await Theater.findOne({ theaterId: theaterid });
			if (!theater || theater.adminApprovalStatus !== "Approved")
				throw new HandleError(
					"Such a theater doesn't exist or might be deleted"
				);

			filterConditions.theater = theater._id;
		}
		if (req.query.page && req.query.limit) {
			const skip = (page - 1) * limit;
			const shows = await Show.find(filterConditions)
				.populate("movie", "movieName movieId posterImage")
				.populate("theater", "theaterName seats seatClasses owner")
				.skip(skip)
				.limit(limit);
			const totalShows = await Show.countDocuments(filterConditions);

			res.status(200).json({
				shows,
				totalShows,
				totalPages: Math.ceil(totalShows / limit),
				currentPage: page,
			});
		} else {
			const shows = await Show.find(filterConditions)
				.populate("movie", "movieName posterImage")
				.populate("theater", "theaterName seats seatClasses owner");

			res.status(200).json(shows);
		}
	} catch (err) {
		return res
			.status(err?.statusCode || 500)
			.json({ message: "Error", error: err.message });
	}
};

export const addShow = async (req, res, next) => {
	const { theaterid } = req.params;
	const { showTime, movie } = req.body;
	// Verify Theater Owner
	console.log(showTime);
	const parsedShowTime = new Date(showTime); // Convert to Date object
	const utcShowTime = parsedShowTime.toISOString(); // Ensure UTC format
	console.log(utcShowTime);
	try {
		const theater = await Theater.findOne({ theaterId: theaterid })
			.populate("owner", "ownerId username _id")
			.lean();

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
			throw new HandleError("You are not authorized to do this", 403);
		}
		const validShowTime = validateDateTime(utcShowTime);
		if (validShowTime) {
			const show = new Show({
				showTime: utcShowTime,
				movie,
				theater: theater._id,
			});
			await show.save();
			return res.status(201).json({ message: "Successfully created show" });
		}
	} catch (err) {
		return res
			.status(err?.statusCode || 500)
			.json({ message: "Error", error: err.message });
	}
};

export const individualShow = async (req, res, next) => {
	const { showId, theaterId } = req.params;

	try {
		const show = await Show.findOne({ showId: showId })
			.populate("movie")
			.populate("theater", "theaterName theaterId seats seatClasses owner");
		if (!show) throw new Error("No such show exists");
		return res.status(200).json(show);
	} catch (err) {
		res
			.status(err?.statusCode || 404)
			.json({ error: "Couldn't find show details", message: err });
	}
};

export const editShow = async (req, res, next) => {
	const { showid } = req.params;
	try {
		const show = await Show.findOne({ showId: showid })
			.populate("movie", "movieName")
			.populate("theater", "theaterName seats seatClasses owner");

		if (!show || show.deleted)
			return res.status(404).json({
				error: "Show Cannot Be Accessed",
				message: "Show not found or deleted",
			});

		if (
			req.user.role !== "Admin" &&
			!new ObjectId(req.user.loggedUserObjectId).equals(show.theater.owner)
		) {
			throw new Error("You are not authorized to do this");
		}
		const { showTime, movie } = req.body;
		const parsedShowTime = new Date(showTime); // Convert to Date object
		const utcShowTime = parsedShowTime.toISOString();
		const validShowTime = validateDateTime(utcShowTime);
		if (validShowTime) {
			const updatedShow = await Show.findOneAndUpdate(
				{ showId: showid },
				{ showTime: utcShowTime, movie },
				{ runValidators: true, new: true }
			);

			return res
				.status(201)
				.json({ message: `Succesfully Updated ${showid}`, updatedShow });
		}
	} catch (err) {
		return res
			.status(err?.statusCode || 500)
			.json({ message: "Error", error: err.message });
	}
};

export const deleteShow = async (req, res, next) => {
	const { showid } = req.params;
	try {
		const show = await Show.findOne({ showId: showid })
			.populate("movie", "movieName")
			.populate("theater", "theaterName seats seatClasses owner");

		if (
			req.user.role !== "Admin" &&
			!new ObjectId(req.user.loggedUserObjectId).equals(show.theater.owner)
		) {
			throw new Error("You are not authorized to do this");
		}
		handleShowDeletion(showid);

		return res.status(204).json({ message: `Succesfully Deleted ${showid}` });
	} catch (err) {
		return res
			.status(err?.statusCode || 500)
			.json({ message: "Error", error: err.message });
	}
};
