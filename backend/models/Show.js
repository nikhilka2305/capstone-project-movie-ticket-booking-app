import mongoose from "mongoose";
import { nanoid } from "nanoid";

const showSchema = mongoose.Schema(
	{
		showId: {
			type: String,
			unique: true,
			default: () => `SID${nanoid(10)}`,
		},
		deleted: {
			type: Boolean,
			default: false,
		},
		showTime: {
			type: Date,
			required: true,
		},
		bookedSeats: [
			{
				seatNumber: {
					row: {
						type: Number,
						required: true,
					},
					col: {
						type: Number,
						required: true,
					},
				},
			},
		],
		movie: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Movie",
			required: true,
		},
		theater: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Theater",
			required: true,
		},
	},
	{ timestamps: true }
);

export const Show = mongoose.model("Show", showSchema);
