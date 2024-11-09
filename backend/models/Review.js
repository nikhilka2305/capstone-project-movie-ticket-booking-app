import mongoose from "mongoose";
import { nanoid } from "nanoid";

const reviewSchema = mongoose.Schema(
	{
		reviewId: {
			type: String,
			unique: true,
			default: () => `RID${nanoid(10)}`,
		},
		deleted: {
			type: Boolean,
			default: false,
		},
		reviewFor: {
			type: String,
			enum: ["movie", "theater"],
		},
		movieId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Movie",
		},
		theaterId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Theater",
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		userRating: {
			type: Number,
			required: true,
			min: 1,
			max: 5,
		},
		userReview: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

// Schema-level validation function
reviewSchema.path("reviewFor").validate(function (value) {
	// Check for 'movie' - movieId should be present and theaterId absent
	if (value === "movie") {
		if (!this.movieId) {
			throw new Error("For movie reviews, movieId is required");
		}
	}
	// Check for 'theater' - theaterId should be present and movieId absent
	else if (value === "theater") {
		if (!this.theaterId) {
			throw new Error("For theater reviews, theaterId is required");
		}
	}
	return true;
}, "Invalid review data.");

export const Review = mongoose.model("Review", reviewSchema);
