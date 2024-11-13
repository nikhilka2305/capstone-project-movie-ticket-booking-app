import HandleError from "../middleware/errorHandling.js";
import { Booking } from "../models/Booking.js";
import { Movie } from "../models/Movie.js";
import { Review } from "../models/Review.js";
import { Theater } from "../models/Theater.js";
import { ObjectId } from "mongodb";
export const viewReviews = async (req, res, next) => {
	const { movieid, theaterid } = req.params;
	console.log(movieid, theaterid);
	const filterConditions = { deleted: false };

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

export const editReview = async (req, res, next) => {
	const { reviewid } = req.params;
	try {
		const review = await Review.findOne({ reviewId: reviewid });
		if (!review || review.deleted)
			throw new HandleError("No such review or review deleted", 404);
		if (
			req.user.role !== "Admin" &&
			!new ObjectId(req.user.loggedUserObjectId).equals(review.userId)
		)
			throw new HandleError("You are not authorized to edit this review", 403);

		const { userRating, userReview } = req.body;
		const updatedReview = await Review.findOneAndUpdate(
			{ reviewId: reviewid },
			{ userRating, userReview },
			{ new: true, runValidators: true }
		);
		return res.status(200).send("Review updated");
	} catch (err) {
		return res.status(err.statusCode).json({ message: err.message });
	}
};

export const deleteReview = async (req, res, next) => {
	const { reviewid } = req.params;
	try {
		const review = await Review.findOne({ reviewId: reviewid });
		if (!review || review.deleted)
			throw new HandleError("No such review or review deleted", 404);
		if (
			req.user.role !== "Admin" &&
			!new ObjectId(req.user.loggedUserObjectId).equals(review.userId)
		)
			throw new HandleError(
				"You are not authorized to deleted this review",
				403
			);
		const deletedReview = await Review.findOneAndUpdate(
			{ reviewId: reviewid },
			{ deleted: true },
			{ new: true, runValidators: true }
		);
		return res.status(204).send("Review deleted");
	} catch (err) {
		return res.status(err.statusCode).json({ message: err.message });
	}
};

export const addReview = async (req, res, next) => {
	console.log(req.user);

	const { movieid, theaterid } = req.params;
	console.log(req.user);
	const userBookings = await Booking.find({
		// _id: new ObjectId(req.user.loggedUserObjectId),
		user: req.user.loggedUserObjectId,
	}).populate({
		path: "showInfo",
		populate: [
			{
				path: "movie",
				select: "movieName movieId _id",
			},
			{
				path: "theater",
				select: "theaterName theaterId _id",
			},
		],

		select: "-bookedSeats",
	});
	console.log(userBookings);
	const reviewData = { userId: req.user.loggedUserObjectId };

	try {
		if (movieid) {
			const movie = await Movie.findOne({ movieId: movieid });
			if (!movie) {
				throw new HandleError("Movie doesn't exist", 404);
			}
			const watchedMovie = userBookings.find(
				(booking) => booking.showInfo.movie.movieId == movieid
			);
			console.log("Checking Movie");
			console.log(watchedMovie);
			if (!watchedMovie)
				throw new HandleError(
					"You need to have booked for this movie to review this.",
					403
				);
			reviewData.movieId = movie._id;
			reviewData.reviewFor = "movie";
		} else if (theaterid) {
			const theater = await Theater.findOne({ theaterId: theaterid });
			if (!theater) {
				throw new Error("Theater doesn't exist");
			}
			const watchedTheater = userBookings.find(
				(booking) => booking.showInfo.theater.theaterId == theaterid
			);
			console.log("Checking Theater");
			console.log(watchedTheater);
			if (!watchedTheater)
				throw new HandleError(
					"You need to have booked for this theater to review this.",
					403
				);
			reviewData.theaterId = theater._id;
			reviewData.reviewFor = "theater";
		}

		// Need to Verify if the user has booked the movie

		console.log(req.user.loggedUserObjectId);
		const reviewsAdded = await Review.find({
			userId: req.user.loggedUserObjectId,
		})
			.populate("movieId", "movieId _id movieName")
			.populate("theaterId", "theaterId _id theaterName");
		console.log("My reviews");
		console.log(reviewsAdded);

		// Now check if User already added review for this movie/theater
		console.log("check if User already added review for this movie/theater");
		const reviewEligible = reviewsAdded.find((review) => {
			console.log(review);
			if (theaterid && review.theaterId)
				return review.theaterId.theaterId === theaterid;
			if (movieid && review.movieId) return review.movieId.movieId === movieid;
		});
		console.log("review elligible");
		console.log(reviewEligible);
		console.log("review elligible2");
		if (reviewEligible) {
			throw new HandleError(
				"You have already added a review for this movie/theater "
			);
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
