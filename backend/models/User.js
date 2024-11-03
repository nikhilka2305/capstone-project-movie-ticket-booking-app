import mongoose from "mongoose";
import { nanoid } from "nanoid";

const userSchema = mongoose.Schema({
	username: {
		type: String,
		unique: true,
		required: true,
	},
	userId: {
		type: String,
		unique: true,
		default: () => `UID${nanoid(10)}`,
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
		default: "User",
		enum: ["User"],
	},
	bookingHistory: [String],
	moviePreferences: {
		genre: {
			type: String,
			default: "",
		},
		favactors: {
			type: [String],
			validate: {
				validator: function (val) {
					return val.length <= 5;
				},
				message: "Max 5 fav actors..",
			},
		},
	},
});

export const User = mongoose.model("User", userSchema);
