import HandleError from "../middleware/errorHandling.js";
import { Theater } from "../models/Theater.js";
import { TheaterOwner } from "../models/TheaterOwner.js";
import { ObjectId } from "mongodb";
import { addMultipleImages } from "../utils/cloudinaryUpload.js";
import { handleTheaterDeletion } from "../utils/deleteCascadeManager.js";

export const viewTheaters = async (req, res, next) => {
	const { filter, page = 1, limit = 10 } = req.query;

	try {
		const { ownerid, adminid } = req.params;
		const filterConditions = {};
		if (ownerid) {
			const owner = await TheaterOwner.findOne({ userId: ownerid });
			if (!owner) throw new Error("No Theater Owner exists with that Id");

			if (req.user.role !== "Admin" && req.user.loggedUserId !== ownerid)
				return res.status(403).json({
					error: "Authorization Error",
					message: "You are not authorized to see this page",
				});

			filterConditions.owner = owner._id;
		} else if (!adminid) {
			filterConditions.adminApprovalStatus = "Approved";
		}

		if (req.query.page && req.query.limit) {
			const skip = (page - 1) * limit;
			const theaters = await Theater.find(filterConditions)
				.skip(skip)
				.limit(limit)
				.populate("owner", "username");
			const totalTheaters = await Theater.countDocuments(filterConditions);

			res.status(200).json({
				theaters,
				totalTheaters,
				totalPages: Math.ceil(totalTheaters / limit),
				currentPage: page,
			});
		} else {
			const theaters = await Theater.find(filterConditions).select(
				"theaterName _id theaterId"
			);
			res.status(200).json(theaters);
		}
	} catch (err) {
		return res.json({ message: "Error", error: err.message });
	}
};

export const viewTheatersAdmin = async (req, res, next) => {
	const { filter, page = 1, limit = 10 } = req.query;

	try {
		if (req.user.role !== "Admin")
			return res.status(403).json({
				error: "Authorization Error",
				message: "You are not authorized to see this page",
			});

		if (req.query.page && req.query.limit) {
			const skip = (page - 1) * limit;
			const theaters = await Theater.find()
				.skip(skip)
				.limit(limit)
				.populate("owner", "username");
			const totalTheaters = await Theater.countDocuments();

			res.status(200).json({
				theaters,
				totalTheaters,
				totalPages: Math.ceil(totalTheaters / limit),
				currentPage: page,
			});
		} else {
			const theaters = await Theater.find().select("theaterName _id theaterId");
			res.status(200).json(theaters);
		}
	} catch (err) {
		return res.json({ message: "Error", error: err.message });
	}
};

export const viewIndividualTheater = async (req, res, next) => {
	const { theaterid } = req.params;

	try {
		const theater = await Theater.findOne({ theaterId: theaterid });
		if (!theater || theater.adminApprovalStatus !== "Approved")
			throw new HandleError("Such a Theater doesn't exist", 404);
		if (
			(req.user && req.user.role === "Admin") ||
			(req.user &&
				new ObjectId(req.user.loggedUserObjectId).equals(theater.owner))
		) {
			return res.status(200).json(theater);
		}

		return res.status(200).json(theater);
	} catch (err) {
		return res
			.status(err.statusCode || 500)
			.json({ message: "Error", error: err.message });
	}
};

export const viewManageIndividualTheater = async (req, res, next) => {
	const { theaterid } = req.params;

	try {
		const theater = await Theater.findOne({ theaterId: theaterid });
		if (!theater) throw new HandleError("Such a Theater doesn't exist", 404);
		if (
			(req.user && req.user.role === "Admin") ||
			(req.user &&
				new ObjectId(req.user.loggedUserObjectId).equals(theater.owner))
		) {
			return res.status(200).json(theater);
		} else {
			throw new HandleError(
				"You are not authorized to manage this theater",
				403
			);
		}
	} catch (err) {
		return res
			.status(err.statusCode || 500)
			.json({ message: "Error", error: err.message });
	}
};

export const addTheater = async (req, res, next) => {
	const { theaterName, location, owner, seats, seatClasses, amenities, shows } =
		req.body;

	try {
		const images = req.files;
		let theaterimages;

		if (images) {
			theaterimages = await addMultipleImages(images);
		}

		const theater = new Theater({
			theaterName,
			location,
			owner: req.user.role === "Admin" ? owner : req.user.loggedUserObjectId,
			adminApprovalStatus: req.user.role === "Admin" ? "Approved" : "Pending",
			images: theaterimages,
			seats,
			seatClasses,
			amenities,
			shows,
		});

		await theater.save();
		return res.send("Success");
	} catch (err) {
		return res.json({ message: "Error", error: err.message });
	}
};

export const editIndividualTheater = async (req, res, next) => {
	const { theaterid } = req.params;
	try {
		const theater = await Theater.findOne({ theaterId: theaterid });
		if (!theater) throw new HandleError("Such a theater doesn't exist", 404);

		if (
			req.user.role !== "Admin" &&
			!new ObjectId(req.user.loggedUserObjectId).equals(theater.owner)
		) {
			throw new HandleError("You are not authorized to edit this theater", 403);
		}
		const {
			theaterName,
			location,
			seats,
			seatClasses,
			amenities,
			adminApprovalStatus,
		} = req.body;

		const images = req.files;

		let theaterimages = theater.images;

		if (images && images.length > 0) {
			theaterimages = await addMultipleImages(images);
		}

		const updatedTheater = await Theater.findOneAndUpdate(
			{ theaterId: theaterid },
			{
				theaterName: theaterName,
				location,
				adminApprovalStatus: req.user.role === "Admin" ? "Approved" : "Pending",
				images: images && [...theaterimages],
				seats: seats && { ...seats },
				seatClasses: seatClasses && [...seatClasses],
				amenities,
			},
			{ new: true, upsert: true }
		);

		return res.json({ message: `Succesfully Updated ${theaterid}` });
	} catch (err) {
		return res
			.status(err.statusCode ? err.statusCode : 500)
			.json({ message: err.message });
	}
};

export const deleteIndividualTheater = async (req, res, next) => {
	const { theaterid } = req.params;
	try {
		const theater = await Theater.findOne({ theaterId: theaterid });
		if (!theater || theater.adminApprovalStatus === "Deleted")
			throw new HandleError(
				"Such a theater doesn't exist or it is deleted already",
				404
			);
		if (
			req.user.role !== "Admin" &&
			!new ObjectId(req.user.loggedUserObjectId).equals(theater.owner)
		) {
			throw new HandleError("You are not authorized to edit this theater", 403);
		}
		handleTheaterDeletion(theaterid);
		return res.status(204).json({ message: "Succesfully Deleted" });
	} catch (err) {
		return res.status(err.statusCode).json({ message: err.message });
	}

	res.send(`You have deleted ${theaterid} page`);
};
