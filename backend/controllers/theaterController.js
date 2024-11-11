import { Theater } from "../models/Theater.js";
import { TheaterOwner } from "../models/TheaterOwner.js";

export const viewTheaters = async (req, res, next) => {
	console.log("owner");
	console.log(req.user);

	try {
		const { ownerid, adminid } = req.params;
		const filterConditions = {};
		if (ownerid) {
			const owner = await TheaterOwner.findOne({ ownerId: ownerid });
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
		const theaters = await Theater.find(filterConditions)
			.populate("owner", "username")
			.populate("shows.movie", "movieName");
		res.json(theaters);
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
		console.log(req.user.loggedUserObjectId, theater.owner);
		if (
			req.user &&
			(req.user.role === "Admin" ||
				req.user.loggedUserObjectId == theater.owner)
		) {
			return res.json(theater);
		}
		if (theater.adminApprovalStatus !== "Approved") {
			return res
				.status(404)
				.json({ message: "Not Found", error: "Such a Theater doesn't exist" });
		}
		return res.json(theater);
	} catch (err) {
		console.log("Unable to get that Theater");
		console.log(err.message);
		return res.json({ message: "Error", error: err.message });
	}
};

export const addTheater = async (req, res, next) => {
	const {
		theaterName,
		location,
		owner,
		images,
		seats,
		seatClasses,
		amenities,
		shows,
	} = req.body;
	try {
		const theater = new Theater({
			theaterName,
			location,
			owner,
			images,
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
