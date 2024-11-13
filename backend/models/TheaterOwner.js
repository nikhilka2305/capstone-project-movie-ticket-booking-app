import mongoose from "mongoose";
import { nanoid } from "nanoid";

const theaterOwnerSchema = mongoose.Schema(
	{
		username: {
			type: String,
			unique: true,
			required: true,
		},
		userId: {
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
		displayImage: {
			type: String,
			default: "No Image",
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
		blocked: {
			type: Boolean,
			default: false,
		},
		deleted: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

export const TheaterOwner = mongoose.model("TheaterOwner", theaterOwnerSchema);
