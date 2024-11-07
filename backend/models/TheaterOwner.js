import mongoose from "mongoose";
import { nanoid } from "nanoid";

const theaterOwnerSchema = mongoose.Schema({
	theaterownername: {
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
});

export const TheaterOwner = mongoose.model("TheaterOwner", theaterOwnerSchema);
