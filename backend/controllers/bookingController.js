import { Booking } from "../models/Booking.js";
import { User } from "../models/User.js";
import { Movie } from "../models/Movie.js";
import { Theater } from "../models/Theater.js";

const popObject = {
	path: "user",
	populate: {},
};

export const viewBookings = async (req, res, next) => {
	try {
		const bookings = await Booking.find()
			.populate("user", "username")
			.populate("movie", "movieName")
			.populate("theater", "theaterName");
		res.json(bookings);
	} catch (err) {
		console.log("Unable to get Bookings");
		console.log(err.message);
		return res.json({ message: "Error", error: err.message });
	}
};

export const addBooking = async (req, res, next) => {
	const { movie, showInfo, theater, seatNumbers, user, bookingDate } = req.body;

	try {
		const booking = new Booking({
			movie,
			showInfo,
			theater,
			seatNumbers,
			user,
			bookingDate,
		});
		await booking.save();
		return res.send("Success");
	} catch (err) {
		console.log("Unable to save Booking");
		console.log(err.message);
		return res.json({ message: "Error", error: err.message });
	}
};
