import { Movie } from "../models/Movie.js";
import { Show } from "../models/Show.js";

export const viewMovies = async (req, res, next) => {
	try {
		const { filter } = req.query;

		const filterConditions =
			req.user && req.user.role === "Admin"
				? {}
				: { adminApprovalStatus: "Approved" };

		if (filter === "newReleases") {
			const lastWeek = new Date();
			lastWeek.setDate(lastWeek.getDate() - 7);
			filterConditions.releaseDate = { $gte: lastWeek };
		} else if (filter === "currentlyRunning") {
			const currentlyRunningMovies = await Show.distinct("movie", {
				showTime: { $gte: new Date() },
			});
			filterConditions._id = { $in: currentlyRunningMovies };
		}

		const movies = await Movie.find(filterConditions);
		res.json(movies);
	} catch (err) {
		console.log("Unable to get Movies");
		console.log(err.message);
		return res.json({ message: "Error", error: err.message });
	}
};

export const viewIndividualMovie = async (req, res, next) => {
	const { movieid } = req.params;

	try {
		const movie = await Movie.findOne({ movieId: movieid });

		if (!movie) {
			return res
				.status(404)
				.json({ message: "Not Found", error: "Such a Movie doesn't exist" });
		}
		return res.json(movie);
	} catch (err) {
		console.log("Unable to get that Movie");
		console.log(err.message);
		return res.json({ message: "Error", error: err.message });
	}
};

export const editIndividualMovie = async (req, res, next) => {
	const { movieid } = req.params;

	try {
		const movie = await Movie.findOne({ movieId: movieid });

		if (!movie) {
			return res
				.status(404)
				.json({ message: "Not Found", error: "Such a Movie doesn't exist" });
		}
		return res.json("Edit Movie Worked");
	} catch (err) {
		console.log("Unable to get that Movie");
		console.log(err.message);
		return res.json({ message: "Error", error: err.message });
	}
};

export const deleteIndividualMovie = async (req, res, next) => {
	const { movieid } = req.params;

	try {
		const movie = await Movie.findOne({ movieId: movieid });

		if (!movie) {
			return res
				.status(404)
				.json({ message: "Not Found", error: "Such a Movie doesn't exist" });
		}
		return res.json("Delete Movie Worked");
	} catch (err) {
		console.log("Unable to get that Movie");
		console.log(err.message);
		return res.json({ message: "Error", error: err.message });
	}
};

export const addMovie = async (req, res, next) => {
	const {
		movieName,
		releaseDate,
		movieduration,
		language,
		genre,
		rating,
		movieDescription,
		movieCast,
		director,
	} = req.body;

	try {
		const movie = new Movie({
			movieName,
			releaseDate,
			movieduration,
			language,
			genre,
			rating,
			movieDescription,
			movieCast,
			director,
			addedBy: req.user.loggedUserObjectId,
			userType: req.user.role,
		});
		await movie.save();
		return res.send("Success");
	} catch (err) {
		console.log("Unable to save Movie");
		console.log(err.message);
		return res.json({ message: "Error", error: err.message });
	}
};
