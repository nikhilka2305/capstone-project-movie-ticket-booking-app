import mongoose from "mongoose";
import { nanoid } from "nanoid";

const showSchema = mongoose.Schema({
	showId: {
		type: String,
		unique: true,
		default: () => `SID${nanoid(10)}`,
	},

	showTime: {
		type: Date,
		required: true,
	},
	movie: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Movie",
	},
	theater: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Theater",
	},
});

export const Show = mongoose.model("Show", showSchema);
