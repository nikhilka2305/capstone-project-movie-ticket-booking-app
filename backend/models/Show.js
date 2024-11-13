import mongoose from "mongoose";
import { nanoid } from "nanoid";
import { format } from "date-fns-tz";

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
			validate: {
				validator: function (value) {
					return value > new Date(); // Ensure future dates
				},
				message: "Show time must be in the future.",
			},
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

// Add a virtual field for IST conversion
showSchema.virtual("showTimeIST").get(function () {
	const timeZone = "Asia/Kolkata"; // IST timezone
	return format(this.showTime, "yyyy-MM-dd HH:mm:ssXXX", { timeZone });
});

// Ensure virtual fields are included in JSON and Object outputs
showSchema.set("toJSON", { virtuals: true });
showSchema.set("toObject", { virtuals: true });

export const Show = mongoose.model("Show", showSchema);
