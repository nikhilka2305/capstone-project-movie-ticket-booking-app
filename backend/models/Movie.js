import mongoose from "mongoose";
import { nanoid } from "nanoid";

const movieSchema = mongoose.Schema({
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
	adminApproved: {
		type: Boolean,
		default: false,
	},
	releaseDate: {
		type: Date,
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
});

export const Movie = mongoose.model("Movie", movieSchema);
