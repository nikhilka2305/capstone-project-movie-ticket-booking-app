import HandleError from "../middleware/errorHandling.js";
import { Booking } from "../models/Booking.js";
import { Movie } from "../models/Movie.js";
import { Review } from "../models/Review.js";
import { Theater } from "../models/Theater.js";
import { ObjectId } from "mongodb";
import { User } from "../models/User.js";
export const viewReviews = async (req, res, next) => {
	const { filter, page = 1, limit = 10 } = req.query;

	const { movieid, theaterid } = req.params;

	const filterConditions = { deleted: false };

	try {
		if (movieid) {
			const movie = await Movie.findOne({ movieId: movieid });
			if (!movie) {
				throw new HandleError("Movie doesn't exist", 404);
			}
			filterConditions.movieId = movie._id;
		} else if (theaterid) {
			const theater = await Theater.findOne({ theaterId: theaterid });
			if (!theater) {
				throw new HandleError("Theater doesn't exist", 404);
			}
			filterConditions.theaterId = theater._id;
		}

		if (req.query.page && req.query.limit) {
			const skip = (page - 1) * limit;
			const reviews = await Review.find(filterConditions)
				.populate("movieId", "movieName")
				.populate("theaterId", "theaterName")
				.populate("userId", "username displayImage")
				.skip(skip)
				.limit(limit);
			const totalReviews = await Review.countDocuments(filterConditions);
			res.status(200).json({
				reviews,
				totalReviews,
				totalPages: Math.ceil(totalReviews / limit),
				currentPage: page,
			});
		} else {
			const reviews = await Review.find(filterConditions)
				.populate("movieId", "movieName")
				.populate("theaterId", "theaterName")
				.populate("userId", "username");
			res.status(200).json(reviews);
		}
	} catch (err) {
		return res
			.status(err?.statusCode)
			.json({ message: "Error", error: err?.message });
	}
};

export const viewIndividualReview = async (req, res, next) => {
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
		return res.status(200).json(review);
	} catch (err) {
		res.status(err?.statusCode).json({ message: err?.message });
	}
};

export const viewIndividualUserReview = async (req, res, next) => {
	const { filter, page = 1, limit = 10 } = req.query;

	const { userid } = req.params;
	try {
		const user = await User.findOne({ userId: userid });
		if (!user || user.deleted)
			throw new HandleError("No such user... Or User was removed", 404);
		if (
			req.user.role !== "Admin" &&
			!new ObjectId(req.user.loggedUserObjectId).equals(user._id)
		)
			throw new HandleError("You are not authorized to see these reviews", 403);

		if (req.query.page && req.query.limit) {
			const skip = (page - 1) * limit;
			const reviews = await Review.find({ userId: user._id, deleted: false })
				.populate("movieId", "movieName")
				.populate("theaterId", "theaterName")
				.populate("userId", "username displayImage")
				.skip(skip)
				.limit(limit);
			const totalReviews = await Review.countDocuments({
				userId: user._id,
				deleted: false,
			});
			res.status(200).json({
				reviews,
				totalReviews,
				totalPages: Math.ceil(totalReviews / limit),
				currentPage: page,
			});
		} else {
			const reviews = await Review.find({ userId: user._id, deleted: false });
			res.status(200).json(reviews);
		}
	} catch (err) {
		res.status(err?.statusCode || 500).json({ message: err?.message });
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
		return res.status(err?.statusCode).json({ message: err?.message });
	}
};

export const deleteReview = async (req, res, next) => {
	const { reviewid } = req.params;
	try {
		const review = await Review.findOne({ reviewId: reviewid, deleted: false });
		if (!review) throw new HandleError("No such review or review deleted", 404);
		if (
			req.user.role !== "Admin" &&
			!new ObjectId(req.user.loggedUserObjectId).equals(review.userId)
		)
			throw new HandleError(
				"You are not authorized to delete this review",
				403
			);
		const deletedReview = await Review.findOneAndUpdate(
			{ reviewId: reviewid },
			{ deleted: true },
			{ new: true, runValidators: true }
		);
		return res.status(204).send("Review deleted");
	} catch (err) {
		return res.status(err?.statusCode).json({ message: err?.message });
	}
};

export const addReview = async (req, res, next) => {
	const { movieid, theaterid } = req.params;

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

	const reviewData = { userId: req.user.loggedUserObjectId };

	try {
		if (movieid) {
			const movie = await Movie.findOne({ movieId: movieid });
			if (!movie || movie.adminApprovalStatus !== "Approved") {
				throw new HandleError("Movie doesn't exist", 404);
			}
			const watchedMovie = userBookings.find(
				(booking) =>
					booking.showInfo.movie.movieId == movieid &&
					booking.status === "Confirmed"
			);

			if (!watchedMovie)
				throw new HandleError(
					"You need to have booked for this movie to review this.",
					403
				);
			reviewData.movieId = movie._id;
			reviewData.reviewFor = "movie";
		} else if (theaterid) {
			const theater = await Theater.findOne({ theaterId: theaterid });
			if (!theater || theater.adminApprovalStatus !== "Approved") {
				throw new Error("Theater doesn't exist");
			}
			const watchedTheater = userBookings.find(
				(booking) =>
					booking.showInfo.theater.theaterId == theaterid &&
					booking.status === "Confirmed"
			);

			if (!watchedTheater)
				throw new HandleError(
					"You need to have booked for this theater to review this.",
					403
				);
			reviewData.theaterId = theater._id;
			reviewData.reviewFor = "theater";
		}

		// Need to Verify if the user has booked the movie

		const reviewsAdded = await Review.find({
			userId: req.user.loggedUserObjectId,
		})
			.populate("movieId", "movieId _id movieName")
			.populate("theaterId", "theaterId _id theaterName");

		// Now check if User already added review for this movie/theater

		const reviewEligible = reviewsAdded.find((review) => {
			if (theaterid && review.theaterId)
				return review.theaterId.theaterId === theaterid;
			if (movieid && review.movieId) return review.movieId.movieId === movieid;
		});

		if (reviewEligible) {
			throw new HandleError(
				"You have already added a review for this movie/theater "
			);
		}
		const { userRating, userReview } = req.body;
		reviewData.userRating = userRating;
		reviewData.userReview = userReview;

		const review = new Review(reviewData);
		await review.save();
		return res.send("Success");
	} catch (err) {
		return res
			.status(err?.statusCode)
			.json({ message: "Error", error: err?.message });
	}
};

export const averageRating = async (req, res, next) => {
	const { movieid, theaterid } = req.params;

	const filterConditions = { deleted: false };
	let reviews;
	try {
		if (movieid) {
			const movie = await Movie.findOne({ movieId: movieid }).lean();
			if (!movie) throw new HandleError("Movie doesn't exist", 404);
			reviews = await Review.find({ movieId: movie._id, deleted: false });
		} else if (theaterid) {
			const theater = await Theater.findOne({ theaterId: theaterid }).lean();
			if (!theater) throw new HandleError("Theater doesn't exist", 404);
			reviews = await Review.find({ theaterId: theater._id, deleted: false });
		}
		if (!reviews || reviews.length === 0)
			return res.status(200).json({ message: "No Reviews are added" });
		// Average rating logic to be added

		const totalRating = reviews.reduce((total, review) => {
			return (total += review.userRating);
		}, 0);
		const averageRating = totalRating / reviews.length;

		return res.status(200).json({
			message: "The Average rating is",
			averageRating: averageRating,
			reviewCount: reviews.length,
		});
	} catch (err) {
		return res
			.status(err?.statusCode || 500)
			.json({ message: "Error", error: err?.message });
	}
};

export const getPersonalReviewStats = async (req, res, next) => {
	const userid = req.params.userid;

	try {
		let userObjectId;
		if (req.user.role !== "Admin" && req.user.loggedUserId !== userid)
			throw new HandleError("You are not authorized to see this page", 403);
		else if (req.user.role === "Admin") {
			const user = await User.findOne({ userId: userid }).lean().select("_id");

			userObjectId = user._id.toString();
		} else if (req.user.loggedUserId === userid) {
			userObjectId = req.user.loggedUserObjectId;
		}
		const aggregation = [
			{
				$match: {
					deleted: false,
					userId: new ObjectId(userObjectId), // Only include non-deleted reviews
				},
			},
			{
				$facet: {
					reviewCounts: [
						{
							$group: {
								_id: null,
								totalReviews: {
									$sum: 1,
								},
								movieReviews: {
									$sum: {
										$cond: [
											{
												$eq: ["$reviewFor", "movie"],
											},
											1,
											0,
										],
									},
								},
								theaterReviews: {
									$sum: {
										$cond: [
											{
												$eq: ["$reviewFor", "theater"],
											},
											1,
											0,
										],
									},
								},
							},
						},
					],
					recentMovieReview: [
						{
							$match: {
								reviewFor: "movie",
							},
						},
						{
							$sort: {
								createdAt: -1,
							},
						},
						{
							$lookup: {
								from: "movies",
								localField: "movieId",
								foreignField: "_id",
								as: "movieDetails",
							},
						},
						{
							$project: {
								_id: 0,
								movieDetails: {
									$arrayElemAt: ["$movieDetails.movieName", 0],
								},
								createdAt: 1,
							},
						},
						{
							$limit: 1,
						},
					],
					recentTheaterReview: [
						{
							$match: {
								reviewFor: "theater",
							},
						},
						{
							$sort: {
								createdAt: -1,
							},
						},
						{
							$lookup: {
								from: "theaters",
								localField: "theaterId",
								foreignField: "_id",
								as: "theaterDetails",
							},
						},
						{
							$project: {
								_id: 0,
								theaterDetails: {
									$arrayElemAt: ["$theaterDetails.theaterName", 0],
								},
								createdAt: 1,
							},
						},
						{
							$limit: 1,
						},
					],
				},
			},
			{
				$project: {
					reviewCounts: {
						$arrayElemAt: ["$reviewCounts", 0],
					},
					recentMovieReview: {
						$arrayElemAt: ["$recentMovieReview", 0],
					},
					recentTheaterReview: {
						$arrayElemAt: ["$recentTheaterReview", 0],
					},
				},
			},
		];

		const reviewStats = await Review.aggregate(aggregation);
		res.status(200).json(reviewStats);
	} catch (err) {
		res
			.status(err?.statusCode || 500)
			.json({ message: "Error", error: err?.message });
	}
};
