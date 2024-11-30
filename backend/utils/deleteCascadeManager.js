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
		}
		const updatedShow = await Show.findOneAndUpdate(
			{ showId: showId },
			{ deleted: true },
			{ runValidators: true, new: true }
		);
	} catch (err) {
		throw new HandleError(err.message, err.statusCode);
	}
};

export const handleTheaterDeletion = async (theaterId) => {
	try {
		const theater = await Theater.findOne({ theaterId: theaterId });

		const shows = await Show.find({ theater: theater._id });
		if (!shows || shows.length === 0)
			for (let show of shows) {
				await handleShowDeletion(show.showId);
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
			for (let theater of theaters) {
				await handleTheaterDeletion(theater.theaterId);
			}

		await TheaterOwner.findOneAndUpdate(
			{ userId: ownerId },
			{ deleted: true },
			{ new: true }
		);
	} catch (err) {
		throw new HandleError(err.message, err.statusCode);
	}
};
