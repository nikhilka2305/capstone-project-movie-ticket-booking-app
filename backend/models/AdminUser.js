import mongoose from "mongoose";
import { nanoid } from "nanoid";

const adminSchema = mongoose.Schema({
	username: {
		type: String,
		unique: true,
		required: true,
	},
	adminId: {
		type: String,
		unique: true,
		default: () => `AID${nanoid(10)}`,
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
		default: "Admin",
		enum: ["Admin"],
	},
	pendingMovieApprovals: [String],
	pendingTheaterApprovals: [String],
});

export const Admin = mongoose.model("Admin", adminSchema);
