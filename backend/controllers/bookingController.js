import { Booking } from "../models/Booking.js";

export const viewBookings = async (req, res, next) => {
	try {
		const bookings = await Booking.find()
			.populate({
				path: "user",
				select: "theaterownername username adminname",
			})

			.populate({
				path: "showInfo",
				populate: [
					{
						path: "movie",
						select: "movieName",
					},
					{
						path: "theater",
						select: "theaterName",
					},
				],

				select: "-bookedSeats",
			});

		res.json(bookings);
	} catch (err) {
		console.log("Unable to get Bookings");
		console.log(err.message);
		return res.json({ message: "Error", error: err.message });
	}
};

export const addBooking = async (req, res, next) => {
	const { showInfo, seatNumbers } = req.body;
	const user = req.user.loggedUserObjectId;
	const userType = req.user.role;
	try {
		const booking = new Booking({
			showInfo,
			seatNumbers,
			user,
			userType,
			bookingDate: Date.now(),
		});
		await booking.save();
		return res.send("Success");
	} catch (err) {
		console.log("Unable to save Booking");
		console.log(err.message);
		return res.json({ message: "Error", error: err.message });
	}
};
