import { TheaterOwner } from "../models/TheaterOwner.js";

export const viewTheaterOwners = async (req, res, next) => {
	try {
		const owners = await TheaterOwner.find();
		res.json(owners);
	} catch (err) {
		console.log("Unable to get Theater Owner");
		console.log(err.message);
		return res.json({ message: "Error", error: err.message });
	}
};

export const addTheaterOwner = async (req, res, next) => {
	const { username, email, passwordHash } = req.body;
	try {
		const owner = new TheaterOwner({
			username,
			email,
			passwordHash,
		});
		await owner.save();
		return res.send("Success");
	} catch (err) {
		console.log("Unable to save Theater Owner");
		console.log(err.message);
		return res.json({ message: "Error", error: err.message });
	}
};
