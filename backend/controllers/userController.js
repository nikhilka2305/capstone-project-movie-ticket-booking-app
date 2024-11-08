import { User } from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const viewUsers = async (req, res, next) => {
	console.log(req.user);
	if (req.user.role !== "Admin")
		res.status(403).json({
			error: "Authorization Error",
			message: "You are not authorized to see this page",
		});
	else {
		try {
			console.log(req.user);
			const users = await User.find();
			res.json(users);
		} catch (err) {
			console.log("Unable to get user Data");
			console.log(err.message);
			return res.json({ message: "Error", error: err.message });
		}
	}
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
				const token = jwt.sign(
					{
						userId: user.userId,
						username: username,
						role: user.role,
					},
					process.env.JWT_ACCESS_TOKEN_COMMON_SECRET,
					{ expiresIn: "6h" }
				);
				console.log(token);
				res.cookie("token", token, { expiresIn: 60 * 60, httpOnly: true });
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
