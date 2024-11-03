import { User } from "../models/User.js";

export const viewUsers = async (req, res, next) => {
	try {
		const users = await User.find();
		res.json(users);
	} catch (err) {
		console.log("Unable to get user Data");
		console.log(err.message);
		return res.json({ message: "Error", error: err.message });
	}
};

export const addUser = async (req, res, next) => {
	const { username, email, passwordHash, bookingHistory, moviePreferences } =
		req.body;
	try {
		const user = new User({
			username,
			email,
			passwordHash,
			bookingHistory,
			moviePreferences,
		});
		await user.save();
		return res.send("Success");
	} catch (err) {
		console.log("Unable to save User");
		console.log(err.message);
		return res.json({ message: "Error", error: err.message });
	}
};
