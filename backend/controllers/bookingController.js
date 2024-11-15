import { Booking } from "../models/Booking.js";
import { User } from "../models/User.js";
import { TheaterOwner } from "../models/TheaterOwner.js";
import { Admin } from "../models/Admin.js";
import { ObjectId } from "mongodb";
import HandleError from "../middleware/errorHandling.js";
import { handleBookingCancellation } from "../utils/deleteCascadeManager.js";

export const viewPersonalBookings = async (req, res, next) => {
	const userid = req.params.userid || req.params.adminid || req.params.ownerid;
	const filterOptions = { user: req.user.loggedUserObjectId };
	if (req.user.role !== "Admin" && req.user.loggedUserId !== userid)
		return res.status(403).json({
			error: "Authorization Error",
			message: "You are not authorized to see this page",
		});

	try {
		if (req.user.role === "Admin") {
			console.log("chek user");
			if (req.params.userid) {
				console.log("user here");
				filterOptions.user = await User.findOne({ userId: userid }).select(
					"_id"
				);
			} else if (req.params.ownerid) {
				filterOptions.user = await TheaterOwner.findOne({
					userId: userid,
				}).select("_id");
			} else {
				console.log("admin here");
				filterOptions.user = await Admin.findOne({ userId: userid }).select(
					"_id"
				);
			}
		}

		const bookings = await Booking.find(filterOptions)
			.populate({
				path: "user",
				select: "username",
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

export const viewIndividualBooking = async (req, res, nex) => {
	const { bookingid } = req.params;

	try {
		const booking = await Booking.findOne({ bookingId: bookingid });
		if (!booking) throw new HandleError("No such booking found", 404);
		console.log(booking.user, req.user.loggedUserObjectId);
		if (
			req.user.role !== "Admin" &&
			!new ObjectId(req.user.loggedUserObjectId).equals(booking.user)
		)
			throw new HandleError("You are not Authorized to view this booking", 403);
		return res.json(booking);
	} catch (err) {
		console.log(err);
		return res.status(err.statusCode).json({ message: err.message });
	}
};

export const viewBookings = async (req, res, next) => {
	const user = req.user;
	let filterConditions = {};
	if (user.role === "TheaterOwner") {
		filterConditions = {
			// "showInfo.theater.owner._id": user.loggedUserObjectId,
			"showInfo.theater.owner._id": {
				$eq: new ObjectId(user.loggedUserObjectId),
			},
		};
		console.log(filterConditions);
		console.log(
			"This is theater owner... Some filters needed",
			user.loggedUserObjectId
		);
	}
	try {
		const bookings = await Booking.aggregate([
			// {
			// 	$match: filterConditions,
			// },

			{
				$lookup: {
					from: "shows",
					localField: "showInfo",
					foreignField: "_id",
					as: "showInfo",
				},
			},
			{ $unwind: "$showInfo" },
			{
				$lookup: {
					from: "movies",
					localField: "showInfo.movie",
					foreignField: "_id",
					as: "showInfo.movie",
				},
			},
			{ $unwind: "$showInfo.movie" },

			{
				$lookup: {
					from: "theaters",
					localField: "showInfo.theater",
					foreignField: "_id",
					as: "showInfo.theater",
				},
			},
			{ $unwind: "$showInfo.theater" },
			{
				$lookup: {
					from: "theaterowners",
					localField: "showInfo.theater.owner",
					foreignField: "_id",
					as: "showInfo.theater.owner",
				},
			},
			{ $unwind: "$showInfo.theater.owner" },

			{
				$lookup: {
					from: "users",
					localField: "user",
					foreignField: "_id",
					as: "userDetails",
				},
			},
			{
				$lookup: {
					from: "admins",
					localField: "user",
					foreignField: "_id",
					as: "adminDetails",
				},
			},
			{
				$lookup: {
					from: "theaterowners",
					localField: "user",
					foreignField: "_id",
					as: "theaterOwnerDetails",
				},
			},
			{
				$addFields: {
					userInfo: {
						$switch: {
							branches: [
								{
									case: {
										$eq: ["$userType", "User"],
									},
									then: {
										$arrayElemAt: ["$userDetails", 0],
									},
								},
								{
									case: {
										$eq: ["$userType", "Admin"],
									},
									then: {
										$arrayElemAt: ["$adminDetails", 0],
									},
								},
								{
									case: {
										$eq: ["$userType", "TheaterOwner"],
									},
									then: {
										$arrayElemAt: ["$theaterOwnerDetails", 0],
									},
								},
							],
							default: null,
						},
					},
				},
			},
			{
				$project: {
					showInfo: {
						movie: {
							movieName: 1,
							_id: 1,
							movieId: 1,
						},
						theater: {
							_id: 1,
							theaterName: 1,
							location: 1,
							owner: {
								_id: 1,
								theaterownername: 1,
								ownerId: 1,
							},
						},
					},

					userInfo: 1,
					userType: 1,
					createdAt: 1,
					updatedAt: 1,
					bookingDate: 1,
					_id: 1,
					bookingId: 1,

					seats: 1,
					totalAmount: 1,
					__v: 1,
				},
			},
			{
				$addFields: {
					// Calculate total amount by summing up the price of each seat based on seatClass
					BookingAmount: {
						$sum: {
							$map: {
								input: "$seats",
								as: "seat",
								in: "$$seat.seatClass.price", // Access price from seatClass
							},
						},
					},
				},
			},
			{
				$project: {
					userInfo: {
						passwordHash: 0,
						deleted: 0,
						updatedAt: 0,
						createdAt: 0,
					},
				},
			},
			{
				$match: filterConditions,
			},
		]);
		console.log(`Length of retrieved data is ${bookings.length}`);

		res.json(bookings);
	} catch (err) {
		console.log("Unable to get Bookings");
		console.log(err.message);
		return res.json({ message: "Error", error: err.message });
	}
};

export const addBooking = async (req, res, next) => {
	const { showInfo, seats } = req.body;
	const user = req.user.loggedUserObjectId;
	const userType = req.user.role;
	try {
		const booking = new Booking({
			showInfo,
			seats,
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

export const cancelBooking = async (req, res, next) => {
	const { bookingid } = req.params;

	try {
		const booking = await Booking.findOne({ bookingId: bookingid }).populate({
			path: "showInfo",
			select: "showTime",
		});
		if (!booking) throw new HandleError("No such booking found", 404);

		console.log(booking.user, req.user.loggedUserObjectId);
		if (
			req.user.role !== "Admin" &&
			!new ObjectId(req.user.loggedUserObjectId).equals(booking.user)
		)
			throw new HandleError(
				"You are not Authorized to cancel this booking",
				403
			);
		if (booking.status === "Cancelled")
			throw new HandleError("This Booking is already cancelled", 403);

		console.log(booking);
		if (booking.showInfo.showTime < Date.now()) {
			console.log(booking.showInfo.showTime, new Date(Date.now()));
			console.log(
				"You cannot cancel this booking as the show time is already past.."
			);
			throw new HandleError(
				"You cannot cancel this Booking as time period has already passed"
			);
		} else {
			console.log(booking.showInfo.showTime, new Date(Date.now()));
			console.log("deleting seats from show..");
			await handleBookingCancellation(bookingid);
			console.log("cancelling booking");
			const cancelledBooking = await Booking.findOneAndUpdate(
				{ bookingId: bookingid },
				{
					status: "Cancelled",
				},
				{ runValidators: true, new: true }
			);
			return res.status(204).json({ message: "Booking Cancelled" });
		}
	} catch (err) {
		return res.status(err.statusCode).json({ message: err.message });
	}
};
