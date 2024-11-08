import { Movie } from "../models/Movie.js";
import { Review } from "../models/Review.js";
import { Theater } from "../models/Theater.js";
export const viewReviews = async (req, res, next) => {
	const { movieid, theaterid } = req.params;
	console.log(movieid, theaterid);
	const filterConditions = {};

	try {
		if (movieid) {
			const movie = await Movie.findOne({ movieId: movieid });
			console.log("---");
			console.log(movie._id);
			filterConditions.movieId = movie._id;
			console.log(filterConditions);
		} else if (theaterid) {
			const theater = await Theater.findOne({ theaterId: theaterid });
			console.log("---");
			console.log(theater._id);
			filterConditions.theaterId = theater._id;
		}
		const reviews = await Review.find(filterConditions)
			.populate("movieId", "movieName")
			.populate("theaterId", "theaterName")
			.populate("userId", "username");
		res.json(reviews);
	} catch (err) {
		console.log("Unable to get Reviews");
		console.log(err.message);
		return res.json({ message: "Error", error: err.message });
	}
};

export const addReview = async (req, res, next) => {
	const { reviewFor, movieId, theaterId, userId, userRating, userReview } =
		req.body;

	try {
		const review = new Review({
			reviewFor,
			movieId,
			theaterId,
			userId,
			userRating,
			userReview,
		});
		await review.save();
		return res.send("Success");
	} catch (err) {
		console.log("Unable to save Review");
		console.log(err.message);
		return res.json({ message: "Error", error: err.message });
	}
};
