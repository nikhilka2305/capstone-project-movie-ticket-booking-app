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
	mobile: {
		type: Number,
		required: true,
		unique: true,
		validate: {
			validator: function (val) {
				return val.toString().length === 10;
			},
			message: (val) => `${val.value} has to be 10 digits`,
		},
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
