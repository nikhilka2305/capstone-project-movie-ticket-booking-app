import mongoose from "mongoose";
import { nanoid } from "nanoid";

const bookingSchema = mongoose.Schema({
	bookingId: {
		type: String,
		unique: true,
		default: () => `BID${nanoid(10)}`,
	},
	movieId: {
		type: String,
		required: true,
	},
	showInfo: {
		type: Date,
		required: true,
	},
	theaterId: {
		type: String,
		required: true,
	},
	seatNumbers: [
		{
			row: { type: Number, required: true },
			seatInRow: { type: Number, required: true },
		},
	],
	// Validation for seatNumber uniqueness required to avoid duplicate booking
	userId: {
		type: String,
		required: true,
	},
	bookingDate: {
		type: Date,
		required: true,
	},
});

export const Booking = mongoose.model("Booking", bookingSchema);
