import { Review } from "../models/Review.js";
export const viewReviews = async (req, res, next) => {
	try {
		const reviews = await Review.find()
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
