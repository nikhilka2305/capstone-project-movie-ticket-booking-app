import mongoose, { Types } from "mongoose";
import { nanoid } from "nanoid";
import { Show } from "./Show.js";
import HandleError from "../middleware/errorHandling.js";

const bookingSchema = mongoose.Schema(
	{
		bookingId: {
			type: String,
			unique: true,
			default: () => `BID${nanoid(10)}`,
		},
		status: {
			type: String,
			enum: ["Confirmed", "Cancelled"],
			default: "Confirmed",
		},
		showInfo: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Show",
			required: true,
		},
		seats: [
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
				seatClass: {
					className: {
						type: String,
						required: true,
					},
					price: {
						type: Number,
						required: true,
					},
				},
			},
		],

		user: {
			type: mongoose.Schema.Types.ObjectId,
			refPath: "userType",
			required: true,
		},
		userType: {
			type: String,
			enum: ["User", "TheaterOwner", "Admin"],
			required: true,
		},
		bookingDate: {
			type: Date,
			required: true,
		},
	},
	{ timestamps: true }
);
bookingSchema.path("seats").validate({
	validator: function (value) {
		return Array.isArray(value) && value.length > 0; // Check if array exists and has at least one element
	},
	message: "There must be at least one seat selected to make a booking.",
});
bookingSchema.pre("save", async function (next) {
	try {
		// Check if any of the seats are already booked
		const show = await Show.findById(this.showInfo).populate(
			"theater",
			"seats"
		);
		if (!show) throw new Error("Show doesn't exist");
		console.log(show.theater.seats);
		// Check if entered seats are valid

		// Loop through the requested seats and check against bookedSeats
		for (let seat of this.seats) {
			console.log("Before Booking");
			if (
				seat.seatNumber.row < 0 ||
				seat.seatNumber.row > show.theater.seats.rows ||
				seat.seatNumber.col < 0 ||
				seat.seatNumber.col > show.theater.seats.seatsPerRow
			) {
				throw new HandleError(
					`Seat (${seat.seatNumber.row}, ${seat.seatNumber.col}) is an invalid seat`,
					403
				);
			}
			const isSeatBooked = show.bookedSeats.some(
				(bookedSeat) =>
					bookedSeat.seatNumber.row === seat.seatNumber.row &&
					bookedSeat.seatNumber.col === seat.seatNumber.col
			);

			// If seat is already booked, throw an error
			if (isSeatBooked) {
				throw new HandleError(
					`Seat (${seat.seatNumber.row}, ${seat.seatNumber.col}) is already booked.`,
					403
				);
			}
		}

		// Proceed if no conflicts
		next();
	} catch (err) {
		console.log("Error checking booked seats:");
		next(err); // Pass error to the next middleware
	}
});

bookingSchema.virtual("BookingAmount").get(function () {
	const Totalcost = this.seats.reduce((cost, seat) => {
		return (cost += seat.seatClass.price);
	}, 0);
	return Totalcost;
});

bookingSchema.set("toJSON", { virtuals: true });
bookingSchema.set("toObject", { virtuals: true });

bookingSchema.post("save", async function (val, next) {
	console.log("After Booking");
	try {
		const show = await Show.findOne({ _id: val.showInfo });
		if (!show) throw new HandleError("Show doesn't exist", 403);
		{
			await Show.findByIdAndUpdate(
				val.showInfo,
				{
					$addToSet: { bookedSeats: { $each: val.seats } },
					// $push: { bookedSeats: { $each: seatsToAdd } },
				},
				{ new: true }
			);
		}
		next();
	} catch (err) {
		console.log("Error updating Show...,", err);
		next(err);
	}
});

export const Booking = mongoose.model("Booking", bookingSchema);
