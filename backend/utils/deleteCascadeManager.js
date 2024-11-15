import { Theater } from "../models/Theater.js";
import { Show } from "../models/Show.js";
import { Booking } from "../models/Booking.js";
import HandleError from "../middleware/errorHandling.js";
import { TheaterOwner } from "../models/TheaterOwner.js";

export const handleBookingCancellation = async (bookingId) => {
	try {
		const booking = await Booking.findOne({ bookingId: bookingId });
		if (!booking || booking.status === "Cancelled")
			throw new HandleError("Booking not found or already deleted", 404);

		const show = await Show.findById(booking.showInfo);
		if (!show || show.deleted === true)
			throw new HandleError("Show is not found or is already deleted");

		const seatsToCancelNumbers = booking.seats.map((seat) => ({
			row: seat.seatNumber.row,
			col: seat.seatNumber.col,
		}));
		console.log(seatsToCancelNumbers);

		for (const seat of seatsToCancelNumbers) {
			const { row, col } = seat;

			const show = await Show.findByIdAndUpdate(
				booking.showInfo,
				{
					$pull: {
						bookedSeats: { "seatNumber.row": row, "seatNumber.col": col },
					},
				},
				{ new: true }
			);
		}

		console.log(show);
	} catch (err) {
		throw new HandleError(err.message, err.statusCode);
	}
};

export const handleShowDeletion = async (showId) => {
	try {
		const show = await Show.findOne({ showId: showId });
		if (!show || show.deleted)
			throw new HandleError("The show is not found or is already deleted");

		const bookings = await Booking.find({ showInfo: show._id });

		for (const booking of bookings) {
			await Booking.findByIdAndUpdate(
				booking._id,
				{ status: "Cancelled" },
				{ new: true }
			);
			console.log(`Booking ${booking._id} status set to Cancelled`);
		}
		const updatedShow = await Show.findOneAndUpdate(
			{ showId: showId },
			{ deleted: true },
			{ runValidators: true, new: true }
		);
		console.log("show deleted");
		console.log(updatedShow);
	} catch (err) {
		throw new HandleError(err.message, err.statusCode);
	}
};

export const handleTheaterDeletion = async (theaterId) => {
	try {
		const theater = await Theater.findOne({ theaterId: theaterId });

		const shows = await Show.find({ theater: theater._id });
		if (!shows || shows.length === 0)
			console.log("There is no show to delete for this theater");
		for (let show of shows) {
			await handleShowDeletion(show.showId);
			console.log(`${show.showId} is deleted`);
		}

		const deletedTheater = await Theater.findOneAndUpdate(
			{ theaterId: theaterId },
			{
				adminApprovalStatus: "Deleted",
			},
			{ runValidators: true, new: true }
		);
	} catch (err) {
		throw new HandleError(err.message, err.statusCode);
	}
};

export const handleTheaterOwnerDeletion = async (ownerId) => {
	try {
		const theaterowner = await TheaterOwner.findOne({ userId: ownerId });

		const theaters = await Theater.find({ owner: theaterowner._id });
		if (!theaters || theaters.length === 0)
			console.log("There is no theater to delete for this theaterowner");

		for (let theater of theaters) {
			await handleTheaterDeletion(theater.theaterId);
			console.log(`${theater.theaterId} is deleted`);
		}

		await TheaterOwner.findOneAndUpdate(
			{ userId: ownerId },
			{ deleted: true },
			{ new: true }
		);
		console.log(theaterowner);
		console.log("Deleting Account");
	} catch (err) {
		throw new HandleError(err.message, err.statusCode);
	}
};
