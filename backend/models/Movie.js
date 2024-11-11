import mongoose from "mongoose";
import { nanoid } from "nanoid";

const movieSchema = mongoose.Schema(
	{
		movieName: {
			type: String,
			unique: true,
			required: true,
		},
		movieId: {
			type: String,
			unique: true,
			default: () => `MID${nanoid(10)}`,
		},
		adminApprovalStatus: {
			type: String,
			enum: ["Pending", "Approved", "Rejected", "Deleted"],
			default: function () {
				if (this.userType === "Admin") return "Approved";
				else return "Pending";
			},
		},
		releaseDate: {
			type: Date,
			required: true,
		},
		movieduration: {
			type: Number,
			required: true,
		},
		language: {
			type: String,
			required: true,
		},
		genre: {
			type: String,
			required: true,
		},
		rating: {
			type: String,
			enum: ["R", "U/A", "U", "A"],
			required: true,
		},
		movieDescription: {
			type: String,
			required: true,
		},
		movieCast: {
			type: [String],
		},
		director: {
			type: String,
			required: true,
		},
		addedBy: {
			type: mongoose.Schema.Types.ObjectId,
			refPath: "userType",
			required: true,
		},
		userType: {
			type: String,
			enum: ["TheaterOwner", "Admin"],
			required: true,
		},
	},
	{ timestamps: true }
);

export const Movie = mongoose.model("Movie", movieSchema);
