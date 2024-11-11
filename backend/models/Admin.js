import mongoose from "mongoose";
import { nanoid } from "nanoid";

const adminSchema = mongoose.Schema(
	{
		username: {
			type: String,
			unique: true,
			required: true,
		},
		userId: {
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

export const Admin = mongoose.model("Admin", adminSchema);
