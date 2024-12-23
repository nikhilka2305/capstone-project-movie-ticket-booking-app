import HandleError from "../middleware/errorHandling.js";
import { Movie } from "../models/Movie.js";
import { Show } from "../models/Show.js";
import { uploadMoviePoster } from "../utils/cloudinaryUpload.js";
import { ObjectId } from "mongodb";

export const viewMovies = async (req, res, next) => {
	try {
		const { filter, page = 1, limit = 10 } = req.query;

		const filterConditions =
			req.user && req.user.role === "Admin"
				? {}
				: { adminApprovalStatus: "Approved" };

		if (filter === "newreleases") {
			const lastWeek = new Date();
			lastWeek.setDate(lastWeek.getDate() - 7);
			filterConditions.releaseDate = { $gte: lastWeek };
		} else if (filter === "nowrunning") {
			const runningActiveShows = await Show.find(
				{ deleted: false, showTime: { $gte: Date.now() } },
				"movieID"
			)
				.lean()
				.select("movie");

			// Extract movie IDs for filtering
			const runningMovies = runningActiveShows.map((show) => show.movie);

			filterConditions._id = { $in: runningMovies };
		}

		if (req.query.page && req.query.limit) {
			const skip = (page - 1) * limit;
			const movies = await Movie.find(filterConditions)
				.select("movieName movieId posterImage adminApprovalStatus")
				.skip(skip)
				.limit(limit);
			const totalMovies = await Movie.countDocuments(filterConditions);

			res.status(200).json({
				movies,
				totalMovies,
				totalPages: Math.ceil(totalMovies / limit),
				currentPage: page,
			});
		} else {
			const movies = await Movie.find(filterConditions).select(
				"movieName _id movieId adminApprovalStatus"
			);
			res.status(200).json(movies);
		}
	} catch (err) {
		return res
			.status(err?.statusCode || 500)
			.json({ message: "Error", error: err?.message });
	}
};

export const viewIndividualMovie = async (req, res, next) => {
	const { movieid } = req.params;

	try {
		const movie = await Movie.findOne({ movieId: movieid })
			.lean()
			.select("-updatedAt ");

		if (!movie) {
			return res
				.status(404)
				.json({ message: "Not Found", error: "Such a Movie doesn't exist" });
		}
		return res.status(200).json(movie);
	} catch (err) {
		return res
			.status(err?.statusCode || 500)
			.json({ message: "Error", error: err?.message });
	}
};

export const editIndividualMovie = async (req, res, next) => {
	const { movieid } = req.params;

	try {
		const movie = await Movie.findOne({ movieId: movieid });

		if (!movie || movie.adminApprovalStatus === "Deleted") {
			throw new HandleError("Such a Movie doesn't exist or is deleted", 404);
		}

		const {
			movieName,
			adminApprovalStatus,
			releaseDate,
			movieduration,
			language,
			genre,
			rating,
			movieDescription,
			movieCast,
			director,
		} = req.body;
		const image = req.file;
		let posterImage;
		if (image) {
			posterImage = await uploadMoviePoster(image);
		}
		const updatedMovie = await Movie.findOneAndUpdate(
			{ movieId: movieid },
			{
				movieName,
				adminApprovalStatus: "Approved",
				releaseDate,
				movieduration,
				language,
				genre,
				rating,
				movieDescription,
				movieCast,
				director,
				posterImage: posterImage,
			},
			{ runValidators: true, new: true }
		);
		return res.status(201).json({ message: "Movie updated" });
	} catch (err) {
		return res.status(err?.statusCode).json({ message: err?.message });
	}
};

export const deleteIndividualMovie = async (req, res, next) => {
	const { movieid } = req.params;

	try {
		const movie = await Movie.findOne({ movieId: movieid });

		if (!movie || movie.adminApprovalStatus === "Deleted") {
			throw new HandleError("Such a Movie doesn't exist or is deleted", 404);
		}
		const deletedMovie = await Movie.findOneAndUpdate(
			{ movieId: movieid },
			{ adminApprovalStatus: "Deleted" }
		);
		return res.status(204).json({ message: " Movie Deleted" });
	} catch (err) {
		return res
			.status(err?.statusCode || 500)
			.json({ message: "Error", error: err?.message });
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
	const image = req.file;
	let posterImage;
	if (image) {
		posterImage = await uploadMoviePoster(image);
	}
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
			posterImage: posterImage,
			addedBy: req.user.loggedUserObjectId,
			userType: req.user.role,
		});
		await movie.save();
		return res.status(200).send("Success");
	} catch (err) {
		return res
			.status(err?.statusCode || 500)
			.json({ message: "Error", error: err?.message });
	}
};
