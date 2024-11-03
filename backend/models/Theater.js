import mongoose from "mongoose";
import { nanoid } from "nanoid";

const theaterSchema = mongoose.Schema({
	theaterName: {
		type: String,
		unique: true,
		required: true,
	},
	theaterId: {
		type: String,
		unique: true,
		default: () => `TID${nanoid(10)}`,
	},
	adminApproved: {
		type: Boolean,
		default: false,
	},
	location: {
		type: String,
		required: true,
	},
	images: {
		type: [String],
	},
	seats: {
		rows: {
			type: Number,
			required: true,
		},
		seatsPerRow: {
			type: Number,
			required: true,
		},
	},
	seatClasses: [
		{
			className: { type: String },
			price: { type: Number },
		},
	],
	amenities: {
		parking: {
			type: String,
			default: "",
		},
		restroom: {
			type: String,
			default: "",
		},
		foodCounters: {
			type: String,
			default: "",
		},
	},
	shows: [
		{
			showTime: Date,
			movieId: { type: String },
		},
	],
	userReviews: [String],
	bookings: [String],
});

export const Theater = mongoose.model("Theater", theaterSchema);
