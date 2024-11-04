import { Booking } from "../models/Booking.js";

export const viewBookings = async (req, res, next) => {
	try {
		const bookings = await Booking.find();
		res.json(bookings);
	} catch (err) {
		console.log("Unable to get Bookings");
		console.log(err.message);
		return res.json({ message: "Error", error: err.message });
	}
};

export const addBooking = async (req, res, next) => {
	const { movieId, showInfo, theaterId, seatNumbers, userId, bookingDate } =
		req.body;

	try {
		const booking = new Booking({
			movieId,
			showInfo,
			theaterId,
			seatNumbers,
			userId,
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
