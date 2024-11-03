import mongoose from "mongoose";
import { nanoid } from "nanoid";

const theaterOwnerSchema = mongoose.Schema({
	username: {
		type: String,
		unique: true,
		required: true,
	},
	ownerId: {
		type: String,
		unique: true,
		default: () => `OID${nanoid(10)}`,
	},
	email: {
		type: String,
		unique: true,
		required: true,
		// will use validate later
	},
	passwordHash: {
		type: String,
		required: true,
	},
	role: {
		type: String,
		default: "TheaterOwner",
		enum: ["TheaterOwner"],
	},
	theaterList: [String],
	bookings: [String],
});

export const TheaterOwner = mongoose.model("TheaterOwner", theaterOwnerSchema);
