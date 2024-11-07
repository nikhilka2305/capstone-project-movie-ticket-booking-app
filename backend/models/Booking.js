import mongoose, { Types } from "mongoose";
import { nanoid } from "nanoid";

const bookingSchema = mongoose.Schema({
	bookingId: {
		type: String,
		unique: true,
		default: () => `BID${nanoid(10)}`,
	},
	movie: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Movie",
		required: true,
	},
	showInfo: {
		type: Date,
		required: true,
	},
	theater: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Theater",
		required: true,
	},
	seatNumbers: [
		{
			row: { type: Number, required: true },
			seatInRow: { type: Number, required: true },
		},
	],
	// Validation for seatNumber uniqueness required to avoid duplicate booking
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	bookingDate: {
		type: Date,
		required: true,
	},
});

export const Booking = mongoose.model("Booking", bookingSchema);
