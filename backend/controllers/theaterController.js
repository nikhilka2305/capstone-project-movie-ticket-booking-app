import HandleError from "../middleware/errorHandling.js";
import { Theater } from "../models/Theater.js";
import { TheaterOwner } from "../models/TheaterOwner.js";
import { ObjectId } from "mongodb";
import { addMultipleImages } from "../utils/cloudinaryUpload.js";
import { handleTheaterDeletion } from "../utils/deleteCascadeManager.js";

export const viewTheaters = async (req, res, next) => {
	console.log("owner");
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
			res.status(200).json(movies);
		}
	} catch (err) {
		console.log("Unable to get Theaters");
		console.log(err.message);
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
		console.log("Unable to get that Theater");
		console.log(err.message);
		return res.status(404).json({ message: "Error", error: err.message });
	}
};

export const addTheater = async (req, res, next) => {
	const { theaterName, location, owner, seats, seatClasses, amenities, shows } =
		req.body;

	try {
		const images = req.files;
		let theaterimages;

		if (images) {
			console.log(images);
			theaterimages = await addMultipleImages(images);
			console.log(theaterimages);
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
		console.log("Unable to save Theater");
		console.log(err.message);
		return res.json({ message: "Error", error: err.message });
	}
};

export const editIndividualTheater = async (req, res, next) => {
	const { theaterid } = req.params;
	try {
		const theater = await Theater.findOne({ theaterId: theaterid });
		if (!theater) throw new HandleError("Such a theater doesn't exist", 404);
		console.log(req.user.loggedUserObjectId, theater.owner);
		if (
			req.user.role !== "Admin" &&
			!new ObjectId(req.user.loggedUserObjectId).equals(theater.owner)
		) {
			console.log("not true owner");
			throw new HandleError("You are not authorized to edit this theater", 403);
		}
		const { theaterName, location, seats, seatClasses, amenities } = req.body;
		const images = req.files;
		console.log("body");
		console.log(req.body);
		let theaterimages = theater.images;

		if (images && images.length > 0) {
			console.log(images);
			theaterimages = await addMultipleImages(images);
			console.log(theaterimages);
		}
		console.log(req.body);
		const updatedTheater = await Theater.findOneAndUpdate(
			{ theaterId: theaterid },
			{
				theaterName: theaterName,
				location,
				images: images && [...images, ...theaterimages],
				seats: seats && { ...seats },
				seatClasses: seatClasses && [...seatClasses],
				amenities,
			},
			{ new: true, upsert: true }
		);
		console.log(updatedTheater);
		return res.json({ message: `Succesfully Updated ${theaterid}` });
	} catch (err) {
		console.log(err.statusCode ? err.statusCode : 500, err.message, err.stack);
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
