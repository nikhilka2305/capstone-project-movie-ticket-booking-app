import { Booking } from "../models/Booking.js";
import { User } from "../models/User.js";
import { TheaterOwner } from "../models/TheaterOwner.js";
import { Admin } from "../models/Admin.js";
import { ObjectId } from "mongodb";
import HandleError from "../middleware/errorHandling.js";
import { handleBookingCancellation } from "../utils/deleteCascadeManager.js";

export const viewPersonalBookings = async (req, res, next) => {
	const { filter, page = 1, limit = 10 } = req.query;
	const userid = req.params.userid || req.params.adminid || req.params.ownerid;
	console.log(userid);

	let filterOptions = {};
	if (req.user.role !== "Admin" && req.user.loggedUserId !== userid)
		throw new HandleError("You are not authorized to see this page", 403);
	else if (req.user.loggedUserId === userid) {
		filterOptions = { user: req.user.loggedUserObjectId };
	}
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
		console.log(filterOptions);
		console.log(limit);
		if (req.query.page && req.query.limit) {
			const skip = (page - 1) * limit;
			console.log(limit);
			console.log(skip);
			const bookings = await Booking.find(filterOptions)
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(limit)
				.populate({
					path: "user",
					select: "username",
				})

				.populate({
					path: "showInfo",
					populate: [
						{
							path: "movie",
							select: "movieName posterImage movieId",
						},
						{
							path: "theater",
							select: "theaterName",
						},
					],

					select: "-bookedSeats",
				});
			const totalBookings = await Booking.countDocuments(filterOptions);

			res.status(200).json({
				bookings,
				totalBookings,
				totalPages: Math.ceil(totalBookings / limit),
				currentPage: page,
			});
		} else {
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
							select: "movieName posterImage",
						},
						{
							path: "theater",
							select: "theaterName",
						},
					],

					select: "-bookedSeats",
				});

			res.status(200).json(bookings);
		}
	} catch (err) {
		console.log("Unable to get Bookings");
		console.log(err.message);
		return res
			.status(err.statusCode)
			.json({ message: "Error", error: err.message });
	}
};

export const viewIndividualBooking = async (req, res, nex) => {
	const { bookingid } = req.params;

	try {
		const booking = await Booking.findOne({ bookingId: bookingid }).populate({
			path: "showInfo",
			populate: [
				{
					path: "movie",
					select: "movieName posterImage movieId",
				},
				{
					path: "theater",
					select: "theaterName theaterId location",
				},
			],

			select: "-bookedSeats",
		});

		if (!booking) throw new HandleError("No bookings found", 404);
		console.log(booking.user, req.user.loggedUserObjectId);
		console.log(booking);
		if (
			req.user.role !== "Admin" &&
			!new ObjectId(req.user.loggedUserObjectId).equals(booking.user) &&
			!new ObjectId(req.user.loggedUserObjectId).equals(
				booking.showInfo.theater.owner
			)
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
		if (!seats || seats.length === 0)
			throw new HandleError("You must have atleast 1 seat to book ticket", 401);
		await booking.save();
		return res.status(200).json({ message: "Success" });
	} catch (err) {
		console.log("Unable to save Booking");
		console.log(err.message);
		return res
			.status(err.statusCode)
			.json({ message: "Error", error: err.message });
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

export const getPersonalBookingStats = async (req, res, next) => {
	const userid = req.params.userid || req.params.adminid || req.params.ownerid;
	console.log(userid);

	try {
		let userObjectId;
		if (req.user.role !== "Admin" && req.user.loggedUserId !== userid)
			throw new HandleError("You are not authorized to see this page", 403);
		else if (req.user.loggedUserId === userid) {
			userObjectId = req.user.loggedUserObjectId;
		} else if (req.user.role === "Admin") {
			if (req.params.userid) {
				const user = await User.findOne({ userId: userid })
					.lean()
					.select("_id");
				console.log(user);
				userObjectId = user._id.toString();
			} else if (req.params.ownerid) {
				const user = await TheaterOwner.findOne({ userId: userid })
					.lean()
					.select("_id");
				console.log(user);
				userObjectId = user._id.toString();
			} else {
				const user = await Admin.findOne({ userId: userid })
					.lean()
					.select("_id");
				console.log(user);
				userObjectId = user._id.toString();
			}
			console.log("Will try admin part later");
		}
		// console.log(filterOptions);
		const bookingStats = await Booking.aggregate([
			{
				// Match based on user ID if provided
				$match: {
					...(userid ? { user: new ObjectId(userObjectId) } : {}), // Conditional match
				},
			},
			{
				// Group by status to calculate counts and total price per status
				$group: {
					_id: "$status",
					totalCount: { $sum: 1 }, // Count of bookings for this status
					totalPrice: {
						$sum: {
							$cond: [
								{ $ne: ["$status", "Cancelled"] }, // Only include non-cancelled bookings in price
								{ $sum: "$seats.seatClass.price" },
								0,
							],
						},
					},
				},
			},
			{
				// Reshape the data to include cancelled count and confirmed details
				$group: {
					_id: null,
					totalConfirmedBookings: {
						$sum: {
							$cond: [
								{ $eq: ["$_id", "Confirmed"] }, // Count only "Confirmed" status
								"$totalCount",
								0,
							],
						},
					},
					totalCancelledBookings: {
						$sum: {
							$cond: [
								{ $eq: ["$_id", "Cancelled"] }, // Count only "Cancelled" status
								"$totalCount",
								0,
							],
						},
					},
					totalPrice: { $sum: "$totalPrice" }, // Sum of prices for confirmed bookings
				},
			},
			{
				// Optionally add back the user ID for clarity
				$project: {
					_id: 0,
					user_Id: userid ? new ObjectId(userObjectId) : null,
					totalConfirmedBookings: 1,
					totalCancelledBookings: 1,
					totalPrice: 1,
				},
			},
		]);
		res.status(200).json(bookingStats);
	} catch (err) {
		res
			.status(err.statusCode || 500)
			.json({ message: "Error", error: err.message });
	}
};
