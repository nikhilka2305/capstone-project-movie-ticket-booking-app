import mongoose from "mongoose";
import { nanoid } from "nanoid";

const theaterSchema = mongoose.Schema(
	{
		theaterName: {
			type: String,
			unique: true,
			required: true,
		},
		theaterId: {
			type: String,
			unique: true,
			default: () => `TID${nanoid(10)}`,
		},
		adminApprovalStatus: {
			type: String,
			enum: ["Pending", "Approved", "Rejected", "Deleted"],
		},
		location: {
			type: String,
			required: true,
		},
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "TheaterOwner",
			required: true,
		},
		images: {
			type: [String],
		},
		seats: {
			rows: {
				type: Number,
				required: true,
			},
			seatsPerRow: {
				type: Number,
				required: true,
			},
		},
		seatClasses: [
			{
				className: { type: String },
				price: { type: Number },
			},
		],
		amenities: {
			parking: {
				type: String,
				default: "",
			},
			restroom: {
				type: String,
				default: "",
			},
			foodCounters: {
				type: String,
				default: "",
			},
		},
		shows: [
			{
				showTime: Date,
				movie: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Movie",
				},
			},
		],
	},
	{ timestamps: true }
);

export const Theater = mongoose.model("Theater", theaterSchema);
