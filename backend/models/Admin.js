import mongoose from "mongoose";
import { nanoid } from "nanoid";

const adminSchema = mongoose.Schema(
	{
		adminname: {
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
			default: "Admin",
			enum: ["Admin"],
		},
		pendingMovieApprovals: [
			{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
		],
		pendingTheaterApprovals: [
			{ type: mongoose.Schema.Types.ObjectId, ref: "Theater" },
		],
	},
	{ timestamps: true }
);

export const Admin = mongoose.model("Admin", adminSchema);
