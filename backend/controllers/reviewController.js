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
			if (!movie) {
				throw new Error("Movie doesn't exist");
			}
			filterConditions.movieId = movie._id;
			console.log(filterConditions);
		} else if (theaterid) {
			const theater = await Theater.findOne({ theaterId: theaterid });
			if (!theater) {
				throw new Error("Theater doesn't exist");
			}
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
	console.log(req.user);

	const { movieid, theaterid } = req.params;
	console.log(req.user);
	const reviewData = { userId: req.user.loggedUserObjectId };

	try {
		if (movieid) {
			const movie = await Movie.findOne({ movieId: movieid });
			if (!movie) {
				throw new Error("Movie doesn't exist");
			}
			reviewData.movieId = movie._id;
			reviewData.reviewFor = "movie";
		} else if (theaterid) {
			const theater = await Theater.findOne({ theaterId: theaterid });
			if (!theater) {
				throw new Error("Theater doesn't exist");
			}
			reviewData.theaterId = theater._id;
			reviewData.reviewFor = "theater";
		}

		const { userRating, userReview } = req.body;
		reviewData.userRating = userRating;
		reviewData.userReview = userReview;
		console.log(reviewData);
		const review = new Review(reviewData);
		await review.save();
		return res.send("Success");
	} catch (err) {
		console.log("Unable to save Review");
		console.log(err.message);
		return res.json({ message: "Error", error: err.message });
	}
};
