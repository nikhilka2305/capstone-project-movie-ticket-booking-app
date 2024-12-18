import { Booking } from "../models/Booking.js";
import { User } from "../models/User.js";
import { TheaterOwner } from "../models/TheaterOwner.js";
import { Admin } from "../models/Admin.js";
import { ObjectId } from "mongodb";
import HandleError from "../middleware/errorHandling.js";
import { handleBookingCancellation } from "../utils/deleteCascadeManager.js";
import { Theater } from "../models/Theater.js";

export const viewPersonalBookings = async (req, res, next) => {
	const { filter, page = 1, limit = 10 } = req.query;
	const userid = req.params.userid || req.params.adminid || req.params.ownerid;

	let filterOptions = {};

	try {
		if (req.user.role !== "Admin" && req.user.loggedUserId !== userid)
			throw new HandleError("You are not authorized to see this page", 403);
		else if (req.user.loggedUserId === userid) {
			filterOptions = { user: req.user.loggedUserObjectId };
		}
		if (req.user.role === "Admin") {
			if (req.params.userid) {
				filterOptions.user = await User.findOne({ userId: userid }).select(
					"_id"
				);
			} else if (req.params.ownerid) {
				filterOptions.user = await TheaterOwner.findOne({
					userId: userid,
				}).select("_id");
			} else {
				filterOptions.user = await Admin.findOne({ userId: userid }).select(
					"_id"
				);
			}
		}

		if (req.query.page && req.query.limit) {
			const skip = (page - 1) * limit;

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
		return res
			.status(err?.statusCode || 500)
			.json({ message: "Error", error: err?.message });
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

		if (
			req.user.role !== "Admin" &&
			!new ObjectId(req.user.loggedUserObjectId).equals(booking.user) &&
			!new ObjectId(req.user.loggedUserObjectId).equals(
				booking.showInfo.theater.owner
			)
		)
			throw new HandleError("You are not Authorized to view this booking", 403);
		return res.status(200).json(booking);
	} catch (err) {
		return res
			.status(err?.statusCode || 500)
			.status(err?.statusCode)
			.json({ message: err?.message });
	}
};

export const viewBookings = async (req, res, next) => {
	try {
		const { page = 1, limit = 5, status } = req.query;
		const { ownerid } = req.params;
		const user = req.user;

		let filterConditions;
		if (ownerid) {
			if (user.role === "TheaterOwner")
				filterConditions = {
					...(user.role === "TheaterOwner" && {
						"showInfo.theater.owner._id": new ObjectId(user.loggedUserObjectId),
					}),
					...(status && { status }),
				};
			else {
				const ownerData = await TheaterOwner.findOne({ userId: ownerid })
					.lean()
					.select("_id");

				filterConditions = {
					"showInfo.theater.owner._id": ownerData._id,
					...(status && { status }),
				};
			}
		} else {
			filterConditions = { ...(status && { status }) };
		}

		const aggregation = [
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
				$match: filterConditions,
			},
			{
				$lookup: {
					from: "theaters",
					localField: "showInfo.theater._id",
					foreignField: "_id",
					as: "theaterDetails",
				},
			},
			{ $unwind: "$theaterDetails" },
			{
				$lookup: {
					from: "users",
					localField: "user",
					foreignField: "_id",
					as: "userDetails",
				},
			},
			// Lookup in theaterowners collection
			{
				$lookup: {
					from: "theaterowners",
					localField: "user",
					foreignField: "_id",
					as: "theaterOwnerDetails",
				},
			},
			// Lookup in admins collection
			{
				$lookup: {
					from: "admins",
					localField: "user",
					foreignField: "_id",
					as: "adminDetails",
				},
			},
			// Merge the results into a single field
			{
				$addFields: {
					userData: {
						$arrayElemAt: [
							{
								$concatArrays: [
									{
										$map: {
											input: "$userDetails",
											as: "u",
											in: {
												username: "$$u.username", // Field name in `users` collection
												userId: "$$u.userId",
												_id: "$$u._id",
											},
										},
									},
									{
										$map: {
											input: "$theaterOwnerDetails",
											as: "t",
											in: {
												username: "$$t.username", // Field name in `theaterowners` collection
												userId: "$$t.userId",
												_id: "$$t._id",
											},
										},
									},
									{
										$map: {
											input: "$adminDetails",
											as: "a",
											in: {
												username: "$$a.username", // Field name in `admins` collection
												userId: "$$a.userId",
												_id: "$$a._id",
											},
										},
									},
								],
							},
							0, // Get the first non-empty object
						],
					},
				},
			},
			{
				$addFields: {
					bookingAmount: {
						$reduce: {
							input: "$seats",
							initialValue: 0,
							in: {
								$add: ["$$value", "$$this.seatClass.price"],
							},
						},
					},
				},
			},
		];

		const totalBookingsData = await Booking.aggregate([
			...aggregation,
			{ $count: "totalBookings" },
		]);
		const totalBookings = totalBookingsData[0]?.totalBookings || 0;

		const skip = (page - 1) * limit;
		const bookingResults = await Booking.aggregate([
			...aggregation,
			{
				$project: {
					showInfo: {
						movie: {
							movieName: 1,
							_id: 1,
							movieId: 1,
							posterImage: 1,
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
						showTime: 1,
					},
					userType: 1,
					createdAt: 1,
					updatedAt: 1,
					bookingDate: 1,
					_id: 1,
					bookingId: 1,
					seats: 1,
					bookingAmount: 1,
					status: 1,
					userData: 1,
				},
			},
			{ $sort: { createdAt: -1 } },
			{ $skip: skip },
			{ $limit: parseInt(limit) },
		]);

		res.status(200).json({
			bookings: bookingResults,
			totalBookings,
			totalPages: Math.ceil(totalBookings / limit),
			currentPage: page,
		});
	} catch (err) {
		return res
			.status(err?.statusCode || 500)
			.json({ message: "Error", error: err?.message });
	}
};

export const totalBookingStats = async (req, res, next) => {
	try {
		const { ownerid } = req.params;
		const { status } = req.query;

		const user = req.user;
		let filterConditions;
		if (ownerid) {
			if (user.role === "TheaterOwner")
				filterConditions = {
					...(user.role === "TheaterOwner" && {
						"showInfo.theater.owner._id": new ObjectId(user.loggedUserObjectId),
					}),
					...(status && { status }),
				};
			else {
				const ownerData = await TheaterOwner.findOne({ userId: ownerid })
					.lean()
					.select("_id");

				filterConditions = {
					"showInfo.theater.owner._id": ownerData._id,
					...(status && { status }),
				};
			}
		} else {
			filterConditions = { ...(status && { status }) };
		}

		const aggregation = [
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
				$match: filterConditions,
			},
			{
				$addFields: {
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
				$group: {
					_id: null,
					totalBookings: { $sum: 1 },
					totalBookingAmount: { $sum: "$BookingAmount" },
				},
			},
		];

		const result = await Booking.aggregate(aggregation);

		const totalBookings = result[0]?.totalBookings || 0;
		const totalBookingAmount = result[0]?.totalBookingAmount || 0;

		res.status(200).json({
			totalBookings,
			totalBookingAmount,
		});
	} catch (err) {
		return res
			.status(err?.statusCode || 500)
			.json({ message: "Error", error: err?.message });
	}
};

export const addBooking = async (req, res, next) => {
	const { showInfo, seats } = req.body;
	const user = req.user.loggedUserObjectId;
	const userType = req.user.role;
	if (new Date(showInfo.showTime) < Date.now())
		throw new HandleError(
			"This Show has ended / cancelled.. You cannot book",
			404
		);
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
		return res
			.status(err?.statusCode)
			.json({ message: "Error", error: err?.message });
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

		if (booking.showInfo.showTime < Date.now()) {
			throw new HandleError(
				"You cannot cancel this Booking as time period has already passed"
			);
		} else {
			await handleBookingCancellation(bookingid);

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
		return res.status(err?.statusCode).json({ message: err?.message });
	}
};

export const getPersonalBookingStats = async (req, res, next) => {
	const userid = req.params.userid || req.params.adminid || req.params.ownerid;

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

				userObjectId = user._id.toString();
			} else if (req.params.ownerid) {
				const user = await TheaterOwner.findOne({ userId: userid })
					.lean()
					.select("_id");

				userObjectId = user._id.toString();
			} else {
				const user = await Admin.findOne({ userId: userid })
					.lean()
					.select("_id");

				userObjectId = user._id.toString();
			}
		}

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
			.status(err?.statusCode || 500)
			.json({ message: "Error", error: err?.message });
	}
};

export const getBookingsByMovie = async (req, res, next) => {
	const { limit } = req.query;
	try {
		const aggregatePipeLine = [
			{
				$match: { status: "Confirmed" }, // Filter bookings with status "Confirmed"
			},
			{
				$lookup: {
					from: "shows", // Join with the shows collection
					localField: "showInfo", // Field in bookings collection
					foreignField: "_id", // Field in shows collection
					as: "showDetails",
				},
			},
			{ $unwind: "$showDetails" }, // Unwind the showDetails array
			{
				$lookup: {
					from: "movies", // Join with the movies collection
					localField: "showDetails.movie", // Field in shows collection
					foreignField: "_id", // Field in movies collection
					as: "movieDetails",
				},
			},
			{ $unwind: "$movieDetails" }, // Unwind the movieDetails array
			{
				$group: {
					_id: "$showDetails.movie", // Group by movie ID
					movieName: { $first: "$movieDetails.movieName" }, // Get the movie name
					bookings: { $sum: 1 }, // Count the number of bookings per movie
				},
			},
			{ $sort: { bookings: -1 } }, // Optional: Sort by most bookings
		];
		if (limit) {
			aggregatePipeLine.push({ $limit: parseInt(limit) });
		}
		const data = await Booking.aggregate(aggregatePipeLine);

		res.status(200).json(data);
	} catch (err) {
		res
			.status(err.status || 500)
			.json({ error: "Failed to fetch movie booking data" });
	}
};

export const getBookingsByTheaters = async (req, res, next) => {
	const { ownerid } = req.params;
	const { limit } = req.query;
	try {
		if (
			ownerid &&
			req.user.role !== "Admin" &&
			req.user.loggedUserId !== ownerid
		) {
			throw new HandleError("You are not authorized!", 403);
		}
		const matchStage = {
			$match: {
				status: "Confirmed", // Only include confirmed bookings
			},
		};
		if (ownerid) {
			const user = await TheaterOwner.findOne({ userId: ownerid })
				.lean()
				.select("_id");
			if (!user) {
				throw new HandleError("Such a Theater owner doesn't exist", 404);
			}

			matchStage.$match["theaterDetails.owner"] = user._id;
		}
		const aggregatePipeLine = [
			{
				$lookup: {
					from: "shows", // Join with shows collection
					localField: "showInfo",
					foreignField: "_id",
					as: "showDetails",
				},
			},
			{ $unwind: "$showDetails" },
			{
				$lookup: {
					from: "theaters", // Join with theaters collection
					localField: "showDetails.theater",
					foreignField: "_id",
					as: "theaterDetails",
				},
			},
			{ $unwind: "$theaterDetails" },
			matchStage,
			{
				$group: {
					_id: "$showDetails.theater",
					theaterName: { $first: "$theaterDetails.theaterName" }, // Group by theater name
					bookings: { $sum: 1 }, // Count bookings
				},
			},
			{ $sort: { bookings: -1 } },
		];
		if (limit) {
			aggregatePipeLine.push({ $limit: limit });
		}
		const data = await Booking.aggregate(aggregatePipeLine);
		res.status(200).json(data);
	} catch (err) {
		res.status(err?.statusCode || 500).json({ message: err?.message });
	}
};

export const getMonthlyData = async (req, res, next) => {
	const { ownerid } = req.params;
	const { limit, filter = "bookings" } = req.query;
	let theaterFilter = {};
	try {
		if (
			ownerid &&
			req.user.role !== "Admin" &&
			req.user.loggedUserId !== ownerid
		) {
			throw new HandleError("You are not authorized!", 403);
		}
		if (ownerid) {
			const user = await TheaterOwner.findOne({ userId: ownerid })
				.lean()
				.select("_id");
			if (!user) {
				throw new HandleError("Such a Theater owner doesn't exist", 404);
			}

			theaterFilter = { owner: user._id };
		}
		const theaters = await Theater.find(theaterFilter, { _id: 1 });

		const theaterIds = theaters.map((t) => t._id);

		const aggregatePipeLine = [
			{
				$lookup: {
					from: "shows", // Join with shows collection
					localField: "showInfo",
					foreignField: "_id",
					as: "showDetails",
				},
			},
			{ $unwind: "$showDetails" },
			{
				$lookup: {
					from: "theaters", // Join with theaters collection
					localField: "showDetails.theater",
					foreignField: "_id",
					as: "theaterDetails",
				},
			},
			{ $unwind: "$theaterDetails" },
			{
				$match: {
					status: "Confirmed",
					"showDetails.theater": { $in: theaterIds },
				},
			},
			//
			{
				$group: {
					_id: {
						year: { $year: "$showDetails.showTime" },
						month: { $month: "$showDetails.showTime" },
					},
					totalBookings: { $sum: 1 },
					totalRevenue: {
						$sum: {
							$reduce: {
								input: "$seats",
								initialValue: 0,
								in: { $add: ["$$value", "$$this.seatClass.price"] },
							},
						},
					},
				},
			},
			{
				$sort: { "_id.year": 1, "_id.month": 1 }, // Sort by year first, then by month
			},
			{
				$project: {
					_id: 0,
					month: {
						$concat: [
							{ $toString: "$_id.year" },
							" ",
							{
								$arrayElemAt: [
									[
										"January",
										"February",
										"March",
										"April",
										"May",
										"June",
										"July",
										"August",
										"September",
										"October",
										"November",
										"December",
									],
									{ $subtract: ["$_id.month", 1] }, // Convert month number to name
								],
							},
						],
					},
					totalBookings: 1,
					totalRevenue: 1,
				},
			},
		];

		const bookings = await Booking.aggregate(aggregatePipeLine);
		const result = bookings.map((b) => ({
			month: b.month,
			value: filter === "revenue" ? b.totalRevenue : b.totalBookings,
		}));

		res.status(200).json(result);
	} catch (err) {
		res.status(err?.statusCode || 500).json({ message: err?.message });
	}
};

export const getBookingRevenueShare = async (req, res, next) => {
	const { ownerid } = req.params;
	const { limit, metric = "revenue" } = req.query;
	const matchFilter = {
		status: "Confirmed", // Only confirmed bookings
	};
	try {
		if (
			ownerid &&
			req.user.role !== "Admin" &&
			req.user.loggedUserId !== ownerid
		) {
			throw new HandleError("You are not authorized!", 403);
		}
		if (ownerid) {
			const user = await TheaterOwner.findOne({ userId: ownerid })
				.lean()
				.select("_id");
			if (!user) {
				throw new HandleError("Such a Theater owner doesn't exist", 404);
			}

			matchFilter["theaterDetails.owner"] = user._id;
		}
		const aggregatePipeLine = [
			{
				$lookup: {
					from: "shows", // Join with shows collection
					localField: "showInfo",
					foreignField: "_id",
					as: "showDetails",
				},
			},
			{ $unwind: "$showDetails" },
			{
				$lookup: {
					from: "theaters", // Join with theaters collection
					localField: "showDetails.theater",
					foreignField: "_id",
					as: "theaterDetails",
				},
			},
			{ $unwind: "$theaterDetails" },
			{ $match: matchFilter },
			{
				$group: {
					_id: "$theaterDetails.theaterName", // Group by theater name
					totalBookings: { $sum: 1 },
					totalRevenue: {
						$sum: {
							$reduce: {
								input: "$seats",
								initialValue: 0,
								in: { $add: ["$$value", "$$this.seatClass.price"] },
							},
						},
					},
				},
			},
			{
				$sort: {
					[metric === "revenue" ? "totalRevenue" : "totalBookings"]: -1,
				},
			},
			{
				$project: {
					_id: 0,
					theaterName: "$_id",
					value: metric === "revenue" ? "$totalRevenue" : "$totalBookings",
				},
			},
		];
		const data = await Booking.aggregate(aggregatePipeLine);

		res.status(200).json(data);
	} catch (err) {
		res.status(err?.statusCode || 500).json({ message: err?.message });
	}
};
