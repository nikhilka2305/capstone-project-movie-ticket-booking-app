import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import { createToken } from "../utils/createToken.js";

export const viewUsers = async (req, res, next) => {
	console.log(req.user);

	try {
		console.log(req.user);
		const users = await User.find().select("-passwordHash");
		res.json(users);
	} catch (err) {
		console.log("Unable to get user Data");
		console.log(err.message);
		return res.json({ message: "Error", error: err.message });
	}
};

export const viewUserProfile = async (req, res, next) => {
	const { userid } = req.params;

	if (req.user.role !== "Admin" && req.user.loggedUserId !== userid)
		return res.status(403).json({
			error: "Authorization Error",
			message: "You are not authorized to see this page",
		});

	try {
		const user = await User.findOne({ userId: userid }).select("-passwordHash");
		if (!user) throw new Error("No such user exists");
		res.status(200).json(user);
	} catch (err) {
		console.log("Unable to get user Data");
		console.log(err.message);
		return res.json({ message: "Error", error: err.message });
	}
};

export const updateUserProfile = async (req, res, next) => {
	const { userid } = req.params;

	if (req.user.role !== "Admin" && req.user.loggedUserId !== userid)
		return res.status(403).json({
			error: "Authorization Error",
			message: "You are not authorized to see this page",
		});

	/*

		Update User Profile Logic

		*/

	return res.send("Update User Profile page works");
};

export const registerUser = async (req, res, next) => {
	const { username, email, mobile, password, moviePreferences } = req.body;
	// Check for existing User;
	const passwordHash = await bcrypt.hash(password, 10);
	try {
		const user = new User({
			username,
			email,
			mobile,
			passwordHash,
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

export const loginUser = async (req, res) => {
	const { username, password } = req.body;
	try {
		const user = await User.findOne({ username: username });
		if (!user) {
			throw new Error("Invalid User Credentials");
		} else {
			const passwordMatch = await bcrypt.compare(password, user.passwordHash);
			if (!passwordMatch) {
				throw new Error("Invalid User Credentials");
			} else {
				console.log(user);
				const token = createToken({
					userId: user.userId,
					username: username,
					role: user.role,
					id: user._id,
				});

				console.log(token);
				res.cookie("token", token, {
					expires: new Date(Date.now() + 6 * 60 * 60 * 1000),
					httpOnly: true,
				});
				res.status(200).json({ message: "Succesfully Logged In" });
			}
		}
	} catch (err) {
		res.status(403).json({
			error: "Login Failed",
			message: err.message,
		});
	}
};
