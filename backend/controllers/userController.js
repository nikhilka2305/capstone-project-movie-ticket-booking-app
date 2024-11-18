import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import { createToken } from "../utils/createToken.js";
import HandleError from "../middleware/errorHandling.js";
import { uploadDisplayImage } from "../utils/cloudinaryUpload.js";

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
		if (!user) throw new HandleError("No such user exists", 404);
		res.status(200).json(user);
	} catch (err) {
		console.log("Unable to get user Data");
		console.log(err.message);
		return res
			.status(err.statusCode)
			.json({ message: "Error", error: err.message });
	}
};

export const updateUserProfile = async (req, res, next) => {
	const { userid } = req.params;

	if (req.user.role !== "Admin" && req.user.loggedUserId !== userid)
		return res.status(403).json({
			error: "Authorization Error",
			message: "You are not authorized to update this profile",
		});
	try {
		const { mobile, email, moviePreferences } = req.body;
		const image = req.file;
		let displayImage;
		if (image) {
			console.log("><><>?<<<<>>");
			console.log(image);

			displayImage = await uploadDisplayImage(image);
		}

		const user = await User.findOneAndUpdate(
			{ userId: userid },
			{
				mobile,
				email,
				moviePreferences,
				displayImage: displayImage,
			},
			{ runValidators: true, new: true }
		);
		console.log(req.body);
		console.log("Updating User Profile");

		res.status(201).json("Profile updated");
	} catch (err) {
		res
			.status(500)
			.json({ error: "Unable to update profile", message: err.message });
	}
};

export const registerUser = async (req, res, next) => {
	const { username, email, mobile, password, moviePreferences } = req.body;
	// Check for existing User;
	try {
		const passwordHash = await bcrypt.hash(password, 10);
		let user = await User.findOne({ username });
		if (user) {
			throw new Error("Username already exists. Try again");
		}
		user = new User({
			username,
			email,
			mobile,
			passwordHash,
			moviePreferences,
			displayImage:
				"https://media.istockphoto.com/id/2151669184/vector/vector-flat-illustration-in-grayscale-avatar-user-profile-person-icon-gender-neutral.jpg?s=612x612&w=0&k=20&c=UEa7oHoOL30ynvmJzSCIPrwwopJdfqzBs0q69ezQoM8=",
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

		if (!user || user.deleted || user.blocked) {
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

					secure: process.env.NODE_ENV === "production",
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

export const resetUserPassword = async (req, res, next) => {
	const { userid } = req.params;

	if (req.user.role !== "Admin" && req.user.loggedUserId !== userid)
		return res.status(403).json({
			error: "Authorization Error",
			message: "You are not authorized to reset Password",
		});
	try {
		const { newPassword } = req.body;

		const newPasswordHash = await bcrypt.hash(newPassword, 10);
		console.log(newPasswordHash);
		console.log(req.user.loggedUserObjectId);
		const user = await User.findByIdAndUpdate(
			req.user.loggedUserObjectId,
			{ passwordHash: newPasswordHash },
			{ new: true }
		);
		console.log(user);
		console.log("Resetting password");

		res.status(201).json("Password Reset");
	} catch (err) {
		res
			.status(500)
			.json({ error: "Unable to Reset Password", message: err.message });
	}
};

export const deleteUser = async (req, res, next) => {
	const { userid } = req.params;
	console.log(req.user.loggedUserId, userid);
	if (req.user.role !== "Admin" && req.user.loggedUserId !== userid)
		return res.status(403).json({
			error: "Authorization Error",
			message: "You are not authorized to delete this account",
		});
	try {
		const user = await User.findOne({ userId: userid });
		if (!user || user.deleted)
			return res
				.status(404)
				.json("This account doesn't exist or is already deleted");
		else {
			await User.findOneAndUpdate(
				{ userId: userid },
				{ deleted: true },
				{ new: true }
			);
			console.log(user);
			console.log("Deleting Account");
			if (req.user.role !== "Admin")
				return res.status(204).clearCookie("token").json("Account Deleted");
			res.status(204).json("Account Deleted");
		}
	} catch (err) {
		res
			.status(500)
			.json({ error: "Unable to delete account", message: err.message });
	}
};
