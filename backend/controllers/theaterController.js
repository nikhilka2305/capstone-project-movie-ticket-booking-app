import { Theater } from "../models/Theater.js";

export const viewTheaters = async (req, res, next) => {
	console.log(req.user);
	try {
		const theaters = await Theater.find({ adminApproved: true })
			.populate("owner", "theaterownername")
			.populate("shows.movie", "movieName");
		res.json(theaters);
	} catch (err) {
		console.log("Unable to get Theaters");
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
